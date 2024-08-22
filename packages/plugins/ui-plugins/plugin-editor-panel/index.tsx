import { Collapse, Dropdown, Form, Input, InputNumber, LinkOutlined, MenuProps, Select, Switch, Tabs } from "@soda/common";
import { Widget, reactive } from "@soda/core";
import "./index.scss";
import { UIPlugin } from "@soda/designer";
import { EditorMeta } from "@soda/utils";
import { ReactNode } from "react";

const editors: EditorMeta[] = [
  { block: "属性", group: "基础信息", label: "组件名称", component: Input, defaultValue: "11112", order: 2, propName: "nodeName1" },
  { block: "属性", group: "基础信息", label: "组件标识", component: Input, defaultValue: "测试属性", order: 1, propName: "nodeRef" },
  { block: "属性", group: "基础信息", label: "是否展示", component: Switch, defaultValue: true, order: 3, propName: "visible" },
  { block: "属性", group: "分页", label: "显示分页", component: Switch, defaultValue: true, propName: "showPage" },
  {
    block: "属性",
    group: "分页",
    label: "每页条数",
    component: Select,
    condition({ showPage }: any) {
      return !!showPage;
    },
    propName: "pageSize",
  },
  { block: "属性", group: "分页", label: "总页数", component: InputNumber, propName: "pageNumber" },
  { block: "样式", group: "基础信息", label: "高度", component: InputNumber, defaultValue: 250, propName: "height" },
  { block: "样式", group: "基础信息", label: "宽度", component: InputNumber, defaultValue: 32, propName: "width" },
  { block: "样式", group: "基础信息", label: "字体", component: InputNumber, defaultValue: 16, propName: "fontSize" },
  { block: "事件", group: "", label: "onClick", component: InputNumber, defaultValue: () => {}, propName: "onClick" },
  { block: "事件", group: "", label: "onHover", component: InputNumber, defaultValue: () => {}, propName: "onHover" },
  { block: "事件", group: "", label: "onChange", component: InputNumber, defaultValue: () => {}, propName: "onChange" },
  { block: "高级", group: "xxx", label: "onChange", component: InputNumber, defaultValue: () => {}, propName: "onChange" },
];

@Widget
export class EditorPlugin extends UIPlugin {
  @reactive values = {};

  component(props: Record<string, object>): ReactNode {
    const blocks: { [key: string]: { [prop: string]: EditorMeta[] } } = {};

    editors.forEach((editor) => {
      if (!(editor.group?.length > 0)) {
        editor.group = editor.block;
      }
      if (!blocks[editor.block]) {
        blocks[editor.block] = {};
      }
      if (!blocks[editor.block][editor.group]) {
        blocks[editor.block][editor.group] = [];
      }
      if (typeof editor.order !== "number") {
        editor.order = 0;
      }
      const index = blocks[editor.block][editor.group].findLastIndex((i: EditorMeta) => i.order <= editor.order);
      blocks[editor.block][editor.group].splice(index + 1, 0, editor);
    });

    const { componentName } = props;
    const items: MenuProps["items"] = [{ label: "复制", key: "copy", style: { fontSize: 12, height: 12 } }];
    return (
      <Form onValuesChange={(_changedValues: unknown, values: unknown) => (this.values = values)} className="plugin-editor-panel">
        <Tabs
          tabBarStyle={{
            height: 40,
            marginBottom: 0,
            borderBottom: "1px solid #DEE1E4",
          }}
          centered
          items={Object.keys(blocks).map((block) => {
            return {
              label: block,
              key: block,
              children: (
                <Collapse
                  defaultActiveKey={Object.keys(blocks[block])}
                  expandIconPosition="end"
                  bordered={false}
                  ghost
                  collapsible="icon"
                  items={Object.keys(blocks[block]).map((key) => {
                    return {
                      label: key,
                      key,
                      style: {
                        marginBottom: 4,
                        border: "none",
                      },
                      children: blocks[block][key].map((editor) => {
                        const { propName, label } = editor;
                        const key = `${propName}-${componentName}`;
                        const visible = editor.condition ? editor.condition(this.values) : true;
                        return !visible ? null : (
                          <div className={`editor-item`} key={key}>
                            <Form.Item
                              name={propName}
                              label={
                                <Dropdown menu={{ items }} trigger={["contextMenu"]}>
                                  <span>{label}</span>
                                </Dropdown>
                              }
                            >
                              <editor.component />
                            </Form.Item>
                            <LinkOutlined></LinkOutlined>
                          </div>
                        );
                      }),
                    };
                  })}
                />
              ),
            };
          })}
        ></Tabs>
      </Form>
    );
  }
  placement: UIPluginPlacement = "right";
}
