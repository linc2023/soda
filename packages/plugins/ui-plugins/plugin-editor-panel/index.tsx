import { Collapse, Dropdown, Form, InputNumber, LinkOutlined, MenuProps, Tabs } from "@soda/common";
import { Widget, reactive } from "@soda/core";
import "./index.scss";
import { UIPlugin, globalState } from "@soda/designer";
import { DesignNode, PropDescriptor } from "@soda/utils";
import { ReactNode } from "react";

@Widget
export class EditorPlugin extends UIPlugin {
  @reactive values = {};
  @reactive editors = [];
  componentDidMount(): void {
    this.$on("selectedNode:change", (selectedNode: DesignNode) => {
      const editors = globalState.component.getPropsMeta(selectedNode.libary, selectedNode.componentName);
      this.editors = editors;
    });
  }
  getFormCompoent(componentName: string) {
    return InputNumber;
  }
  render(): ReactNode {
    const blocks: { [key: string]: { [prop: string]: PropDescriptor[] } } = {};
    this.editors.forEach((editor) => {
      if (!(editor.group?.length > 0)) {
        editor.group = editor.tab ?? "";
      }
      const tab = editor.tab ?? "属性";
      if (!blocks[tab]) {
        blocks[tab] = {};
      }
      if (!blocks[tab][editor.group]) {
        blocks[tab][editor.group] = [];
      }
      if (typeof editor.order !== "number") {
        editor.order = 0;
      }
      const index = blocks[tab][editor.group].findLastIndex((i: PropDescriptor) => i.order <= editor.order);
      blocks[tab][editor.group].splice(index + 1, 0, editor);
    });
    const { componentName } = this.props;

    return (
      <Form onValuesChange={(_changedValues: unknown, values: unknown) => (this.values = values)} className="plugin-editor-panel">
        <Tabs
          tabBarStyle={{
            height: 40,
            marginBottom: 0,
            borderBottom: "1px solid #DEE1E4",
          }}
          centered
          items={Object.keys(blocks).map((tab) => {
            const groups = Object.keys(blocks[tab])
              .filter((i) => i !== "")
              .map((i) => ({
                groupName: i,
                items: blocks[tab][i],
              }));
            const items = blocks[tab][""] ?? [];
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
      return items.map((editor) => {
        const { name, label, descriptor } = editor;
        const key = `${name}-${componentName}`;
        const visible = editor.condition ? editor.condition(this.values) : true;
        const FormComponent = this.getFormCompoent(descriptor.type);
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
              <FormComponent />
            </Form.Item>
            <LinkOutlined></LinkOutlined>
          </div>
        );
      });
    }
  }

  static placement: UIPluginPlacement = "right";
}
