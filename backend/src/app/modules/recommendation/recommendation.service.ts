import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";
import { ITokenPayload } from "../../../interfaces/token";
import mongoose from "mongoose";
import { IPost } from "../post/post.interface";

// Field-selection constants keep both the service and its tests in sync,
// and allow MongoDB to project only the fields needed for recommendations.
const USER_RECOMMENDATION_FIELDS = "readingPreferences readingHistory";
const POST_RECOMMENDATION_FIELDS =
  "_id title imageURL author emotions genre likesCount viewsCount publishedAt createdAt";
const AUTHOR_RECOMMENDATION_FIELDS = "name profile.avatar";

type RecommendationPost = Partial<IPost> & {
  _id: mongoose.Types.ObjectId;
};

const getPersonalizedRecommendations = async (token: ITokenPayload) => {
  // Use select() + lean() so that only the two preference fields are fetched
  // and returned as a plain object (faster than a full Mongoose document).
  const user = await User.findById(token._id)
    .select(USER_RECOMMENDATION_FIELDS)
    .lean();

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const { readingPreferences, readingHistory } = user;

  // Base query: not deleted and published
  const query: any = { isDeleted: false, isPublished: true };

  // Exclude read posts
  if (readingHistory && readingHistory.length > 0) {
    query._id = { $nin: readingHistory };
  }

  let recommendations: RecommendationPost[] = [];

  // If user has preferences, try to match them
  if (readingPreferences) {
    // Spread into new arrays before sorting so that the originals stored on
    // the user document are never mutated (regression guard tested explicitly).
    const favoriteGenres = [...(readingPreferences.favoriteGenres || [])]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(g => g.name);

    const favoriteEmotions = [...(readingPreferences.favoriteEmotions || [])]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(e => e.name);

    if (favoriteGenres.length > 0 || favoriteEmotions.length > 0) {
      const orConditions = [];
      if (favoriteGenres.length > 0) {
        orConditions.push({ genre: { $in: favoriteGenres } });
      }
      if (favoriteEmotions.length > 0) {
        orConditions.push({ emotions: { $in: favoriteEmotions } });
      }

      const prefQuery = { ...query, $or: orConditions };

      // Use populate with projected fields and lean() so that we fetch only
      // the data we need without the overhead of full Mongoose hydration.
      recommendations = await Post.find(prefQuery)
        .populate("author", AUTHOR_RECOMMENDATION_FIELDS)
        .select(POST_RECOMMENDATION_FIELDS)
        .sort({ likesCount: -1, viewsCount: -1 })
        .limit(10)
        .lean() as RecommendationPost[];
    }
  }

  // Fallback: If no preferences or not enough recommendations, get top popular posts
  if (recommendations.length < 10) {
    const limit = 10 - recommendations.length;
    const recommendationIds = recommendations.map(r => r._id);

    // Add existing recommendations to exclusion list to avoid duplicates
    const fallbackQuery = {
      ...query,
      ...(recommendationIds.length > 0 && {
        _id: {
          $nin: [...(readingHistory || []), ...recommendationIds]
        }
      })
    };

    const popularPosts = await Post.find(fallbackQuery)
      .populate("author", AUTHOR_RECOMMENDATION_FIELDS)
      .select(POST_RECOMMENDATION_FIELDS)
      .sort({ likesCount: -1, viewsCount: -1 })
      .limit(limit)
      .lean() as RecommendationPost[];

    recommendations = [...recommendations, ...popularPosts];
  }

  return recommendations;
};

export const RecommendationService = {
  getPersonalizedRecommendations,
};
