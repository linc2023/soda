import { Widget, reactive } from "@soda/core";
import { Segmented, UnorderedListOutlined, LinkOutlined, FunctionOutlined } from "@soda/common";
import ComponentWidget from "./components/component";
import "./index.scss";
import { UIPlugin, UIPluginPlacement, globalState } from "@soda/designer";
import { ReactNode } from "react";

@Widget
export class LeftToolsPlugin extends UIPlugin {
  @reactive currentTab = "component";

  component(): ReactNode {
    return (
      <div className={`${globalState.environment.$project_name}-left-tool`}>
        <Segmented<string>
          options={[
            { label: <UnorderedListOutlined />, value: "component" },
            { label: <LinkOutlined />, value: "dataSource" },
            { label: <FunctionOutlined />, value: "var" },
          ]}
          block
          onChange={(value) => (this.currentTab = value)}
        />
        {this.currentTab === "component" ? <ComponentWidget /> : null}
      </div>
    );
  }
  placement: UIPluginPlacement = "left";
  priority: number = 1;
}
