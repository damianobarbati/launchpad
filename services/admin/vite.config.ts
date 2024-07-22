import { ValidateEnv } from "@julr/vite-plugin-validate-env";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { z } from "zod";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    target: "esnext",
    emptyOutDir: true,
  },
  // needed to have top-level await working with vite
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  define: {
    "window.global": {},
  },
  server: {
    host: "0.0.0.0",
    port: Number(3001),
    proxy: {
      "^/api/.*": {
        target: "http://localhost:8080",
        rewrite: (path) => path.replace(/^\/api/, ""),
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [
    react({ tsDecorators: true }),
    visualizer({
      gzipSize: true,
    }) as Plugin,
    tsconfigPaths(),
    ValidateEnv({
      debug: true,
      validator: "zod",
      schema: {
        VITE_GIT_HASH_VERSION: z.string().min(1),
        VITE_APP_ENV: z.enum(["local", "development", "staging", "production"]),
        VITE_API_URL: z.string().min(1).url(),
        VITE_SENTRY_DSN: z.string().nullish().default(""),
      },
    }),
  ],
});
