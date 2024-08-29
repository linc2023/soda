import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { globalState } from "@soda/designer";
import { EditorPlugin, LeftToolsPlugin, PageManagerPlugin } from "@soda/plugins";

async function main() {
  await globalState.package.register(["/components/@soda/base/1.0.0"]);
  globalState.plugin.register(PageManagerPlugin);
  globalState.plugin.register(EditorPlugin);
  globalState.plugin.register(LeftToolsPlugin);
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
main();
