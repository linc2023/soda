import { Widget, action, reactive } from "@soda/core";
import { Segmented, UnorderedListOutlined, LinkOutlined, FunctionOutlined, ApartmentOutlined, Tooltip, ProductOutlined } from "@soda/common";
import { UIPlugin, UIPluginPlacement, globalState } from "@soda/designer";
import { ReactNode } from "react";
import { ComponentTree } from "./components/componentTreePanel";
import { ComponentPanel } from "./components/componentPanel";
import { VariablePanel } from "./components/var";
import { LogicPanel } from "./components/logic";
import { DataSourcePanel } from "./components/dataSourcePanel";
import "./index.scss";
@Widget
export class LeftToolsPlugin extends UIPlugin {
  @reactive currentTab = "component";

  @action onTabChange = (value) => (this.currentTab = value);

  render(): ReactNode {
    return (
      <div className={`${globalState.environment.$project_name}-left-tool`}>
        <Segmented<string>
          options={[
            {
              label: (
                <Tooltip title="组件库">
                  <UnorderedListOutlined />
                </Tooltip>
              ),
              value: "component",
            },
            {
              label: (
                <Tooltip title="组件树">
                  <ApartmentOutlined />
                </Tooltip>
              ),
              value: "componentTree",
            },
            {
              label: (
                <Tooltip title="数据源">
                  <LinkOutlined />
                </Tooltip>
              ),
              value: "dataSource",
            },
            {
              label: (
                <Tooltip title="逻辑">
                  <FunctionOutlined />
                </Tooltip>
              ),
              value: "logic",
            },
            {
              label: (
                <Tooltip title="变量">
                  <ProductOutlined />
                </Tooltip>
              ),
              value: "var",
            },
          ]}
          block
          onChange={this.onTabChange}
        />
        {this.currentTab === "component" ? <ComponentPanel /> : null}
        {this.currentTab === "componentTree" ? <ComponentTree /> : null}
        {this.currentTab === "dataSource" ? <DataSourcePanel /> : null}
        {this.currentTab === "logic" ? <LogicPanel /> : null}
        {this.currentTab === "var" ? <VariablePanel /> : null}
      </div>
    );
  }
  static placement: UIPluginPlacement = "left";
  static priority: number = 1;
}
