import { Widget } from "@soda/core";
import { UIPlugin, UIPluginPlacement } from "@soda/designer";
import { ReactNode } from "react";
import "./index.scss";

@Widget
export class PageManagerPlugin extends UIPlugin {
  render(): ReactNode {
    return (
      <div className="soda-page-manager">
        <div>默认页面</div>
      </div>
    );
  }
  static placement: UIPluginPlacement = "left";
  static priority: number = 1;
}
