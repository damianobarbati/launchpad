import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 60 * 10 * 1000, // 10min
    globalSetup: ["./vitest.setup.global.ts"],
    setupFiles: ["./vitest.setup.ts"],
    sequence: { shuffle: { files: true } },
    coverage: {
      reporter: ["text", "json", "html", "cobertura"],
      reportsDirectory: "/tmp/coverage",
      skipFull: true,
      reportOnFailure: true,
      thresholds: {
        lines: 70,
        functions: 70,
        statements: 70,
        branches: 70,
      },
      exclude: ["**/__mocks__/**", "**/vitest.setup.global.ts", "**/vitest.config.ts"],
    },
    restoreMocks: true,
    chaiConfig: {
      truncateThreshold: 0,
    },
  },
  plugins: [tsconfigPaths()],
});
