import { UIPlugin, UIPluginPlacement } from "@soda/designer";
import { ReactNode } from "react";

export class PageManagerPlugin extends UIPlugin {
  component(props: Record<string, string>): ReactNode {
    console.log(props);
    return <div style={{ height: 270, width: "100%" }}></div>;
  }
  placement: UIPluginPlacement = "left";
  priority: number = 1;
}
