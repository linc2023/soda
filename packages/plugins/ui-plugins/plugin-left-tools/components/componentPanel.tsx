import { Widget, reactive } from "@soda/core";
import { ComponentMeta, toPinYin } from "@soda/utils";
import { Collapse, Input } from "@soda/common";
import { UIPlugin, globalState } from "@soda/designer";
import { ReactNode } from "react";

@Widget
export default class ComponentPanel extends UIPlugin {
  /**
   * 搜索条件
   */
  @reactive keyWord = "";

  onDragStart = ({ displayName, packageName, packageVersion, componentName, isContainer }: ComponentMeta) => {
    return (ev) => {
      return ev.dataTransfer.setData(
        "componentMeta",
        JSON.stringify({
          displayName,
          packageName,
          packageVersion,
          componentName,
          isContainer,
        })
      );
    };
  };

  render(): ReactNode {
    const { keyWord, onDragStart } = this;
    const originGroups = globalState.package.componentMeta;
    const groups = [];
    const groupMap = {};
    originGroups
      .filter(({ displayName, componentName }) => {
        return toPinYin(displayName).includes(keyWord) || displayName?.includes(keyWord) || componentName?.startsWith(keyWord);
      })
      .forEach((component) => {
        const { packageName, packageVersion, group: groupName = "默认分组" } = component;
        const groupKey = `${packageName}-${packageVersion}-${groupName}`;
        const systems = ["isc-base-components", "isc-chart-components"];
        if (!groupMap[groupKey]) {
          const group = {
            key: groupKey,
            groupName: `${groupName} (${systems.includes(packageName) ? "系统组件" : packageName})`,
            children: [component],
          };
          groupMap[groupKey] = group;
          groups.push(group);
        } else {
          groupMap[groupKey].children.push(component);
        }
      });
    return (
      <div className={`${globalState.environment.$project_name}-component-wrapper`}>
        <div className="wrapper-name">组件库</div>
        <Input onChange={({ target: { value } }) => (this.keyWord = value)} placeholder="搜索组件"></Input>
        <Collapse
          defaultActiveKey={groups.map((group) => group.key)}
          expandIconPosition="end"
          bordered={false}
          ghost
          collapsible="icon"
          items={groups.map(({ groupName, key, children, style }) => {
            return {
              label: groupName,
              key,
              style,
              children: children.map((component) => {
                const { displayName, icon, hidden, componentName, packageName, packageVersion } = component;
                const key = `${packageName}-${packageVersion}-${componentName}`;
                return hidden ? null : (
                  <div className="component-item" key={key} draggable onDragStart={onDragStart(component)}>
                    <img src={icon} alt="" />
                    <div className="component-name">{displayName}</div>
                  </div>
                );
              }),
            };
          })}
        />
      </div>
    );
  }
}
