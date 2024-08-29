import { Tree } from "@soda/common";
import { UIPlugin, globalState } from "@soda/designer";
import { ReactNode } from "react";

export class ComponentTree extends UIPlugin {
  render(): ReactNode {
    const treeData = globalState.page.schema.componentsTree as unknown[];
    return (
      <Tree
        showLine={false}
        defaultExpandedKeys={["0-0-0"]}
        treeData={treeData}
        titleRender={(item: any) => {
          return (
            <div key={item.id} onClick={() => this.chooseNode(item.id)}>
              {item.componentName}
            </div>
          );
        }}
      />
    );
  }
  chooseNode = (id: string) => {
    this.$emit("designNode:changeDesignNodeById", id);
  };
}
