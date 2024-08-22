import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import httpProxyPlugin from "./vite-plugin/http-proxy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["@babel/plugin-proposal-decorators", { legacy: true }],
          ["@babel/plugin-proposal-class-properties", { loose: true }],
        ],
      },
    }),
    httpProxyPlugin("/soda-app"),
  ],
});
