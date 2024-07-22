import ENV from "@api/env.ts";
import Redis from "ioredis";

const cache = new Redis(ENV.CACHE_URI);

// we run only in local environment, because in remote environments this is delegated to kube health check relying on the /health endpoint
if (ENV.APP_ENV === "local") await cache.memory("STATS");

export default cache;
