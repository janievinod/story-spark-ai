import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../../models/post";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import LoadingAnimation from "../../loading/loading.component";

const INITIAL_VISIBLE_COUNT = 6;

const LatestPostsComponent = () => {
  const { data, isLoading } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();
  const [showAllPosts, setShowAllPosts] = useState(false);import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../../models/post";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import LoadingAnimation from "../../loading/loading.component";

const LatestPostsComponent = () => {
  const { data, isLoading } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();

  // Add showAllPosts state and helper variables
  const [showAllPosts, setShowAllPosts] = useState(false);

  // Collect posts
  const posts = (data?.posts ?? []) as Post[];
  const shouldShowLoadMore = posts.length >= 7;
  const visiblePosts = showAllPosts || !shouldShowLoadMore ? posts : posts.slice(0, 6);

  // Reset 'Load More' when list changes (e.g., on reload)
  useEffect(() => {
    setShowAllPosts(false);
  }, [posts.length]);

  if (isLoading) return <LoadingAnimation />;

  return (
    <section className="text-slate-100">
      <h2 className="mb-6 text-2xl font-bold">Latest Posts</h2>
      <div className="space-y-5">
        {posts.length > 0 ? (
          visiblePosts.map((post: Post) => (
            <button
              key={post._id}
              onClick={() => navigate(`/post/${post._id}`)}
              className="motion-card-subtle story-panel w-full rounded-lg p-5 text-left"
            >
              <h3 className="mb-2 text-xl font-bold text-slate-100">{post.title}</h3>
              <p className="line-clamp-2 text-slate-400">{post.content || ""}</p>
            </button>
          ))
        ) : (
          <div className="story-panel rounded-lg px-4 py-5 text-slate-300">Posts are not available.</div>
        )}
      </div>
      {shouldShowLoadMore && !showAllPosts && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowAllPosts(true)}
            className="motion-cta cursor-pointer rounded-lg border border-slate-300/70 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
};

export default LatestPostsComponent;


  const posts = (data?.posts ?? []) as Post[];
  const shouldShowLoadMore = posts.length > INITIAL_VISIBLE_COUNT;
  const visiblePosts = showAllPosts || !shouldShowLoadMore ? posts : posts.slice(0, INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    setShowAllPosts(false);
  }, [data?.posts]);

  if (isLoading) return <LoadingAnimation />;

  return (
    <section className="text-slate-100">
      <h2 className="mb-6 text-2xl font-bold">Latest Posts</h2>
      <div className="space-y-5">
        {posts.length > 0 ? (
          visiblePosts.map((post: Post) => (
            <button key={post._id} onClick={() => navigate(`/post/${post._id}`)} className="motion-card-subtle story-panel w-full rounded-lg p-5 text-left">
              <h3 className="mb-2 text-xl font-bold text-slate-100">{post.title}</h3>
              <p className="line-clamp-2 text-slate-400">{post.content || ""}</p>
            </button>
          ))
        ) : (
          <div className="story-panel rounded-lg px-4 py-5 text-slate-300">Posts are not available.</div>
        )}
      </div>
      {shouldShowLoadMore && !showAllPosts && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowAllPosts(true)}
            className="motion-cta cursor-pointer rounded-lg border border-slate-300/70 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
};

export default LatestPostsComponent;
