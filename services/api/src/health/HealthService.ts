import cache from "@api/database/cache.ts";
import database from "@api/database/database.ts";

const check = async () => {
  let database_status: boolean | string = false;
  try {
    const start = Date.now();
    await database.raw("SELECT 1 /* no-log */");
    const end = Date.now() - start;
    database_status = `${end}ms`;
  } catch {}

  let cache_status: boolean | string = false;
  try {
    const start = Date.now();
    await cache.memory("STATS");
    const end = Date.now() - start;
    cache_status = `${end}ms`;
  } catch {}

  const status = database_status && cache_status;

  return {
    status: status,
    database: database_status,
    cache: cache_status,
  };
};

export const HealthService = { check };
