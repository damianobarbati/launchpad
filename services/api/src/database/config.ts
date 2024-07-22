import type { Knex } from 'knex';
import ENV from '../env.js'; // js extension needed due to knex machinery

const config: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: ENV.DB_URI,
    ssl: ENV.APP_ENV === 'local' ? undefined : { rejectUnauthorized: false },
  },
  pool: {
    min: 1,
    max: 100,
    propagateCreateError: false,
  },
  acquireConnectionTimeout: 1000,
  debug: !!ENV.DATABASE_LOGGING,
  log: {
    debug: ({ sql, bindings }) => {
      if (!sql || sql.includes('no-log')) return;
      console.log(`[QUERY] ${sql}`, bindings);
    },
  },
  migrations: {
    stub: './migration.stub.ts',
    tableName: 'knex_migrations',
    directory: './migrations',
    loadExtensions: ['.ts'],
  },
  seeds: {
    directory: './seeds',
    loadExtensions: ['.ts'],
  },
};

export default config;
