/// <reference types="vitest" />

import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "**/src/*", "**/public/*"],
  },
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "VueResponsiveness",
      formats: ["es", "umd"],
      fileName: "vue-responsiveness",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
