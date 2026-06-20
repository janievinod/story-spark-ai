/**
 * Jest global test setup — provides required environment variables so that
 * modules which call requiredEnv() at import time (e.g. config/index.ts)
 * do not throw during test runs.  Real secrets are never committed here;
 * these are dummy values only used in the test environment.
 */
process.env.JWT_SECRET = "test-jwt-secret-for-tests-only";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-for-tests-only";
process.env.JWT_EXPIRES_IN = "15m";
process.env.JWT_REFRESH_EXPIRES_IN = "30d";
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "mongodb://127.0.0.1:27017/story_spark_ai_test";
