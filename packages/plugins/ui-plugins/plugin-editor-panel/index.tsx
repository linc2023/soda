import { Collapse, Dropdown, Form, FormInstance, LinkOutlined, SwapOutlined, Tabs } from "@soda/common";
import { Component, Widget, action, reactive } from "@soda/core";
import "./index.scss";
import { UIPlugin, UIPluginPlacement, globalState } from "@soda/designer";
import { DesignNode, PropDescriptor, EditorType } from "@soda/utils";
import { ReactNode, createRef } from "react";

type Config = { [key: string]: { [prop: string]: (PropDescriptor & { editors: { editor: Component; status: boolean }[]; hidden: () => boolean })[] } };
@Widget
export class EditorPlugin extends UIPlugin {
  @reactive values = {};
  /** 组件配置 */
  @reactive propMates: Config = {};

  componentName: string = "";
  /** 编辑器状态 */
  @reactive editorsState: { [key: string]: boolean } = {};

  formRef = createRef<FormInstance>();

  @action setPropMates(propMates) {
    this.propMates = propMates;
  }

  @action showEditor({ tab, group, name, editor }: { tab: string; group: string; name: string; editor: Component }) {
    const props = this.propMates[tab][group];
    const { editors } = props.find((prop) => prop.name === name) ?? {};
    editors.forEach((item) => {
      if (item.status) {
        item.status = false;
      }
      if (item.editor === editor) {
        item.status = true;
      }
    });
    this.propMates = { ...this.propMates };
  }

  componentDidMount(): void {
    this.$on("designNode:change", (selectedNode: DesignNode, component: Component) => {
      this.componentName = selectedNode.componentName;
      const configs = globalState.package.getPropMetas(selectedNode.libary, selectedNode.componentName);
      const propMates: Config = {};
      configs.forEach((item) => {
        if (item.editorsProps?.[0]?.type === EditorType.Method) {
          return;
        }
        // 隐藏
        const config = { ...item };
        config.hidden = item.hidden ? new Function(`return ${item.hidden}`).bind(component) : () => false;
        config.group = config.group ?? "";
        const tab = config.tab ?? "属性";
        if (!propMates[tab]) {
          propMates[tab] = {};
        }
        if (!propMates[tab][config.group]) {
          propMates[tab][config.group] = [];
        }
        if (typeof config.order !== "number") {
          config.order = 0;
        }
        config.editors = globalState.package.getEditors(item.editorsProps) ?? [];
        config.defaultValue = component[item.name];
        const index = propMates[tab][config.group].findLastIndex((i: PropDescriptor) => i.order <= config.order);
        propMates[tab][config.group].splice(index + 1, 0, config);
      });
      const keys = Object.keys(propMates);
      for (let i = 0; i < keys.length; i++) {
        if (Object.keys(propMates[keys[i]]).length === 0) {
          delete propMates[keys[i]];
        }
        const isAllMetaHidden = Object.keys(propMates[keys[i]]).every((key) => {
          return propMates[keys[i]][key].every(({ hidden }) => hidden?.());
        });
        if (isAllMetaHidden) {
          delete propMates[keys[i]];
        }
      }
      this.setPropMates(propMates);
    });
  }
  @action onValuesChange = (value: unknown) => {
    const key = Object.keys(value)[0];
    this.$emit("designNode:propsChange", key, value[key]);
  };
  render(): ReactNode {
    const { propMates, componentName } = this;
    const tabs = Object.keys(propMates);
    return tabs.length > 0 ? (
      <Form onValuesChange={this.onValuesChange} className="plugin-editor-panel" ref={this.formRef}>
        <div className="panel-title"> {componentName}</div>
        <Tabs
          tabBarStyle={{
            height: 40,
            marginBottom: 0,
            borderBottom: "1px solid #DEE1E4",
          }}
          activeKey={tabs[0]}
          centered
          items={tabs.map((tab) => {
            const groups = Object.keys(propMates[tab])
              .filter((i) => i !== "")
              .map((i) => ({
                groupName: i,
                items: propMates[tab][i],
              }));
            const items = propMates[tab][""] ?? [];
            return {
              label: tab,
              key: tab,
              children: (
                <div>
                  {items?.length > 0 ? <div style={{ padding: "6px 8px" }}>{renderFormItems.call(this, items, tab, "")}</div> : null}
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
                        children: renderFormItems.call(this, group.items, tab, group.groupName),
                      };
                    })}
                  />
                </div>
              ),
            };
          })}
        ></Tabs>
      </Form>
    ) : null;
    function renderFormItems(items, tab, groupName) {
      return items.map((config) => {
        const { name: name, label, editors, hidden, defaultValue } = config;
        const key = `${name}-${componentName}`;
        return (
          <div key={key} className="editor-item">
            {!hidden() ? (
              <>
                <Form.Item
                  name={name}
                  initialValue={defaultValue}
                  label={
                    <Dropdown menu={{ items }} trigger={["contextMenu"]}>
                      <span>{label ?? name}</span>
                    </Dropdown>
                  }
                >
                  {editors.map(({ editor, status }) => {
                    const Comp = editor();
                    return status ? <Comp key={key + Comp.name} /> : null;
                  })}
                </Form.Item>
                <Dropdown
                  menu={{
                    items: editors
                      .filter(({ status }) => !status)
                      .map(({ editor }) => {
                        const menuName = editor().name;
                        return {
                          label: <div onClick={() => this.showEditor({ tab, group: groupName, name: name, editor })}>{menuName}</div>,
                          key: key + menuName,
                        };
                      }),
                  }}
                  placement="bottomLeft"
                >
                  {editors.length > 1 ? <SwapOutlined /> : <LinkOutlined style={{ rotate: "45deg" }} />}
                </Dropdown>
              </>
            ) : null}
          </div>
        );
      });
    }
  }

  static placement: UIPluginPlacement = "right";
}
