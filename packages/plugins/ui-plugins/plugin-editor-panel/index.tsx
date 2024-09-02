import { Collapse, Dropdown, Form, LinkOutlined, Tabs } from "@soda/common";
import { Component, Widget, action, reactive } from "@soda/core";
import "./index.scss";
import { UIPlugin, UIPluginPlacement, globalState } from "@soda/designer";
import { DesignNode, PropDescriptor } from "@soda/utils";
import { ReactNode, createRef } from "react";

@Widget
export class EditorPlugin extends UIPlugin {
  @reactive values = {};
  /** 组件配置 */
  @reactive propsConfig: PropDescriptor[] = [];

  propsConfigMap: { [key: string]: PropDescriptor } = {};

  formRef = createRef();

  @action setPropsConfig(propsConfig) {
    this.propsConfig = propsConfig;
  }

  componentDidMount(): void {
    this.$on("designNode:change", (selectedNode: DesignNode, component: Component) => {
      const configs = globalState.package.getPropsConfig(selectedNode.libary, selectedNode.componentName);
      const propsConfig: { [key: string]: { [prop: string]: PropDescriptor[] } } = {};
      configs.forEach((item) => {
        if (item.editorsProps?.[0]?.type === "Method") {
          return;
        }
        // 隐藏
        const config = { ...item };
        config.hidden = item.hidden ? new Function(`return ${item.hidden}`).bind(component) : () => false;
        this.propsConfigMap[item.name] = item;
        config.group = config.group ?? "";
        const tab = config.tab ?? "属性";
        if (!propsConfig[tab]) {
          propsConfig[tab] = {};
        }
        if (!propsConfig[tab][config.group]) {
          propsConfig[tab][config.group] = [];
        }
        if (typeof config.order !== "number") {
          config.order = 0;
        }
        config.defaultValue = component[item.name];
        const index = propsConfig[tab][config.group].findLastIndex((i: PropDescriptor) => i.order <= config.order);
        propsConfig[tab][config.group].splice(index + 1, 0, config);
      });
      this.setPropsConfig(propsConfig);
    });
  }
  @action onValuesChange = (value: unknown) => {
    const key = Object.keys(value)[0];
    this.$emit("designNode:propsChange", key, value[key]);
  };
  render(): ReactNode {
    const { propsConfig } = this;
    const { componentName } = this.props;
    return (
      <Form onValuesChange={this.onValuesChange} className="plugin-editor-panel" ref={this.formRef}>
        <Tabs
          tabBarStyle={{
            height: 40,
            marginBottom: 0,
            borderBottom: "1px solid #DEE1E4",
          }}
          centered
          items={Object.keys(propsConfig).map((tab) => {
            const groups = Object.keys(propsConfig[tab])
              .filter((i) => i !== "")
              .map((i) => ({
                groupName: i,
                items: propsConfig[tab][i],
              }));
            const items = propsConfig[tab][""] ?? [];
            return {
              label: tab,
              key: tab,
              children: (
                <div>
                  {items?.length > 0 ? <div style={{ padding: "6px 8px" }}>{renderFormItems.call(this, items)}</div> : null}
                  <Collapse
                    defaultActiveKey={groups.map((i) => i.groupName)}
                    expandIconPosition="end"
                    bordered={false}
                    ghost
                    collapsible="icon"
                    items={groups.map((group) => {
                      return {
                        label: group.groupName,
                        key: group.groupName,
                        style: {
                          marginBottom: 4,
                          border: "none",
                        },
                        children: renderFormItems.call(this, group.items),
                      };
                    })}
                  />
                </div>
              ),
            };
          })}
        ></Tabs>
      </Form>
    );
    function renderFormItems(items) {
      return items.map((config) => {
        const { name, label, editorsProps, hidden, defaultValue } = config;
        const key = `${name}-${componentName}`;
        const components = globalState.package.getEditors(editorsProps) ?? [];
        const formComponents = Array.isArray(components) ? components : [];
        return (
          <div key={key}>
            {formComponents.map((Comp, key) => {
              return !hidden() ? (
                <div key={key} className={`editor-item`}>
                  <Form.Item
                    name={name}
                    initialValue={defaultValue}
                    label={
                      <Dropdown menu={{ items }} trigger={["contextMenu"]}>
                        <span>{label ?? name}</span>
                      </Dropdown>
                    }
                  >
                    <Comp />
                  </Form.Item>
                  <LinkOutlined></LinkOutlined>
                </div>
              ) : null;
            })}
          </div>
        );
      });
    }
  }

  static placement: UIPluginPlacement = "right";
}
