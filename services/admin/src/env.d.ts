/// <reference types="vite/client" />
type ImportMetaEnv = {
  readonly VITE_APP_ENV: string;
  readonly VITE_API_URL: string;
  readonly VITE_SENTRY_DSN: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
