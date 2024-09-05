import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/

const isPlatform = process.argv.includes("-platform");
console.log(isPlatform);
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
    createHtmlPlugin(
      process.env.NODE_ENV === "development"
        ? {
            inject: {
              data: {
                scripts: [],
                links: [],
              },
            },
          }
        : {
            minify: true,
            inject: {
              data: {
                scripts: ["https://g.alicdn.com/code/lib/react/18.2.0/umd/react.development.js", "https://g.alicdn.com/code/lib/react-dom/18.2.0/umd/react-dom.development.js", "https://cdnjs.cloudflare.com/ajax/libs/react-is/18.3.1/umd/react-is.development.js", "https://cdnjs.cloudflare.com/ajax/libs/mobx/6.13.1/mobx.umd.production.min.js", "https://cdnjs.cloudflare.com/ajax/libs/mobx-react-lite/4.0.7/mobxreactlite.umd.production.min.js", "https://cdnjs.cloudflare.com/ajax/libs/mobx-react/9.1.1/mobxreact.umd.production.min.js", "https://cdnjs.cloudflare.com/ajax/libs/classnames/2.5.2/index.min.js", "https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.4/axios.min.js", "/packages/@soda/common/common.umd.js", "/packages/@soda/core/core.umd.js", "/packages/@soda/designer/designer.umd.js"],
                links: ["/packages/@soda/designer/designer.css"],
              },
            },
          }
    ),
  ],
});
