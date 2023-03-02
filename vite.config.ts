import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      copyDtsFiles: true,
      exclude: ["vite-env.d.ts"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/types/"),
      name: "VueResponsiveness",
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
