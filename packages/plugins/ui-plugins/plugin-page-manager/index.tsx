import { Widget } from "@soda/core";
import { UIPlugin, UIPluginPlacement } from "@soda/designer";
import { ReactNode } from "react";

@Widget
export class PageManagerPlugin extends UIPlugin {
  render(): ReactNode {
    return <div style={{ height: 270, width: "100%" }}></div>;
  }
  static placement: UIPluginPlacement = "left";
  static priority: number = 1;
}
