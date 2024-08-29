import { Widget, reactive } from "@soda/core";
import { Segmented, UnorderedListOutlined, LinkOutlined, FunctionOutlined, ApartmentOutlined } from "@soda/common";
import { UIPlugin, UIPluginPlacement, globalState } from "@soda/designer";
import { ReactNode } from "react";
import { ComponentTree } from "./components/componentTree";
import ComponentPanel from "./components/componentPanel";
import "./index.scss";

@Widget
export class LeftToolsPlugin extends UIPlugin {
  @reactive currentTab = "component";

  render(): ReactNode {
    return (
      <div className={`${globalState.environment.$project_name}-left-tool`}>
        <Segmented<string>
          options={[
            { label: <UnorderedListOutlined />, value: "component" },
            { label: <ApartmentOutlined />, value: "componentTree" },
            { label: <LinkOutlined />, value: "dataSource" },
            { label: <FunctionOutlined />, value: "var" },
          ]}
          block
          onChange={(value) => (this.currentTab = value)}
        />
        {this.currentTab === "component" ? <ComponentPanel /> : null}
        {this.currentTab === "componentTree" ? <ComponentTree /> : null}
      </div>
    );
  }
  static placement: UIPluginPlacement = "left";
  static priority: number = 1;
}
