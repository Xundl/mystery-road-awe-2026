import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Two entry pages: index.html (vanilla app) and react.html (React migration).
export default defineConfig({
  base: "/mystery-road-awe-2026/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        react: resolve(import.meta.dirname, "react.html"),
      },
    },
  },
});
