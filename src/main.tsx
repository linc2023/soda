import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { EditorPlugin, LeftToolsPlugin, PageManagerPlugin } from "@soda/plugins";
import { globalState } from "@soda/designer";

async function main() {
  await globalState.component.register(["/components/@soda/base/1.0.0"]);
  globalState.plugin.register(new PageManagerPlugin());
  globalState.plugin.register(new EditorPlugin());
  globalState.plugin.register(new LeftToolsPlugin());

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
main();
