import z from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["test", "development", "production"]),
    APP_ENV: z.enum(["local", "development", "staging", "production"]),
    GIT_HASH_VERSION: z.string().min(1),
    TZ: z.string().min(1),
    PORT: z.string().min(1).transform(Number),
    JWT_SECRET: z.string().min(1),
    CACHE_URI: z.string().min(1),
    DB_URI: z.string().min(1),
    DB_LOGGING: z.string().transform(Boolean).default(""),
  })
  .strip();

const ENV = envSchema.parse(process.env);
export default ENV;
