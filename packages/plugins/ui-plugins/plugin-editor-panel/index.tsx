import { Collapse, Dropdown, Form, LinkOutlined, Tabs } from "@soda/common";
import { Widget, action, reactive } from "@soda/core";
import "./index.scss";
import { UIPlugin, UIPluginPlacement, globalState } from "@soda/designer";
import { DesignNode, PropDescriptor } from "@soda/utils";
import { ReactNode } from "react";

@Widget
export class EditorPlugin extends UIPlugin {
  @reactive values = {};
  /** 组件配置 */
  @reactive propsConfig: PropDescriptor[] = [];

  propsConfigMap: { [key: string]: PropDescriptor } = {};

  @action setPropsConfig(propsConfig) {
    this.propsConfig = propsConfig;
  }

  componentDidMount(): void {
    this.$on("selectedNode:change", (selectedNode: DesignNode) => {
      const propsConfig = globalState.package.getPropsConfig(selectedNode.libary, selectedNode.componentName);
      this.setPropsConfig(propsConfig);
    });
  }
  @action onValuesChange = (value: unknown) => {
    const key = Object.keys(value)[0];
    this.$emit("selectedNode:propsChange", key, value[key]);
  };
  render(): ReactNode {
    const propsConfig: { [key: string]: { [prop: string]: PropDescriptor[] } } = {};
    const events: PropDescriptor[] = [];
    this.propsConfig.forEach((item) => {
      // 隐藏
      if (item.hidden) {
        const hidden = !new Function(`return ${item.hidden}`)();
        if (hidden) {
          return;
        }
      }
      // 事件
      if (item.name.startsWith("on") && item.type === "event") {
        events.push(item);
        return;
      }
      const config = { ...item };
      this.propsConfigMap[item.name] = item;
      if (!(config.group?.length > 0)) {
        config.group = config.tab ?? "";
      }
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
      const index = propsConfig[tab][config.group].findLastIndex((i: PropDescriptor) => i.order <= config.order);
      propsConfig[tab][config.group].splice(index + 1, 0, config);
    });
    const { componentName } = this.props;

    // propsConfig["事件"] = { "": events };

    return (
      <Form onValuesChange={this.onValuesChange} className="plugin-editor-panel">
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
        const { name, label, editorsProps } = config;
        const key = `${name}-${componentName}`;
        const visible = config.condition ? config.condition(this.values) : true;
        const components = globalState.package.getEditors(editorsProps) ?? [];
        const formComponents = Array.isArray(components) ? components : [];
        return !visible ? null : (
          <div className={`editor-item`} key={key}>
            <Form.Item
              name={name}
              label={
                <Dropdown menu={{ items }} trigger={["contextMenu"]}>
                  <span>{label ?? name}</span>
                </Dropdown>
              }
            >
              {formComponents.map((Comp, key) => {
                return <Comp key={key} />;
              })}
            </Form.Item>
            <LinkOutlined></LinkOutlined>
          </div>
        );
      });
    }
  }

  static placement: UIPluginPlacement = "right";
}
