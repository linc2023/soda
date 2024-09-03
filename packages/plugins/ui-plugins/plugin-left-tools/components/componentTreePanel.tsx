import { Tree } from "@soda/common";
import { UIPlugin, globalState } from "@soda/designer";
import { ReactNode } from "react";

export class ComponentTree extends UIPlugin {
  render(): ReactNode {
    const treeData = globalState.page.schema.componentsTree as unknown[];
    return (
      <Tree
        showLine={false}
        defaultExpandedKeys={[treeData?.[0].id]}
        treeData={treeData}
        fieldNames={{ key: "id" }}
        className={`${globalState.environment.$project_name}-componentTree-panel`}
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
