import * as SodaCore from "@soda/core";
import { globalState } from "../states";
import React, { DragEvent, ReactNode, createRef } from "react";
import ReactDOM from "react-dom/client";
import { BorderBox, DesignNodeBox } from "../components/borderBox";
import { ComponentMeta, DesignNode, PageSchema, getMainVersion, packageNameToCamelCase, uuid } from "@soda/utils";

const schema: PageSchema = {
  components: [
    { package: "@soda/base", version: "1.0.0", componentName: "A" },
    { package: "@soda/base", version: "1.0.0", componentName: "Button" },
    { package: "@soda/base", version: "1.0.0", componentName: "Span" },
  ],
  componentsTree: [
    {
      componentName: "Page",
      id: "aqasiz7lkk7a3dy222z1",
      children: [
        { componentName: "A", id: "aqasiz7lkk7a3dyz1" },
        { componentName: "Button", id: "kje68elzgza63nve2" },
        { componentName: "A", id: "aqasiz7lkk7a3dyz" },
        { componentName: "Span", id: "kje68elzgza63nve" },
      ],
    },
  ],
};

@SodaCore.Widget
export class Designer extends SodaCore.Component {
  /** 需要挂载的根节点 */
  solidDesignNodeBoxRef = createRef<any>();
  dashBorderBoxRef = createRef<any>();
  /** schema */
  @SodaCore.reactive pageSchema = schema;

  /** 选中节点 */
  selectedNode: DesignNode;

  render(): ReactNode {
    const componentMap = globalState.component.componentMap;
    return (
      <div className={`${globalState.environment.$project_name}-designer-main`} onDragOver={(e) => e.preventDefault()} onPointerMove={this.onPointerMove} onDrop={this.addComponent} onPointerDown={this.onPointerDown}>
        <SodaCore.WebRender schema={this.pageSchema} mode={globalState.environment.mode} componentMap={componentMap} />
        <DesignNodeBox borderStyle="solid" ref={this.solidDesignNodeBoxRef} components={[]}></DesignNodeBox>
        <BorderBox borderWidth={1} borderStyle="dashed" ref={this.dashBorderBoxRef}></BorderBox>
      </div>
    );
  }
  getLibraryByComponentName(instance: SodaCore.Component) {
    const componentMap = globalState.component.componentMap;
    const res = this.pageSchema.components
      .map(({ package: packageName, version, componentName }) => {
        const libName = packageNameToCamelCase(packageName) + getMainVersion(version);
        return {
          packageName,
          version,
          componentName,
          libName,
          component: componentMap[libName][componentName],
        };
      })
      .find((c) => c.component === instance) ?? { libName: null, componentName: null };
    return { packageName: res.libName, componentName: res.componentName };
  }
  /**
   * 选中节点
   * @param designNode
   */
  chooseNode = (designNode: DesignNode) => {
    const rect: DOMRect = designNode?.element?.getBoundingClientRect();
    this.solidDesignNodeBoxRef.current.resize(rect);
    this.selectedNode = designNode;

    const res = this.getLibraryByComponentName(designNode.type);
    designNode.componentName = res.componentName;
    designNode.libary = res.packageName;

    globalState.event.emit("selectedNode:change", designNode);
  };
  /**
   * 绘制虚线框
   * @param designNode
   */
  drawDashBox = (designNode: DesignNode) => {
    const rect: DOMRect = designNode?.element?.getBoundingClientRect();
    this.dashBorderBoxRef.current.resize(rect);
  };
  addComponent = (ev: DragEvent) => {
    const componentMeta: ComponentMeta = JSON.parse(ev.dataTransfer.getData("componentMeta"));
    this.pageSchema = {
      ...this.pageSchema,
      componentsTree: [
        {
          ...this.pageSchema.componentsTree[0],
          children: [...this.pageSchema.componentsTree[0].children, { componentName: componentMeta.componentName, id: uuid() }],
        },
      ],
    };
  };

  onPointerUp = (ev) => {
    this.selectedNode = null;
  };
  onPointerMove = (ev) => {
    this.drawDashBox(this.findDesignNodeByDOM(ev.target));
    // const { clientX, clientY } = ev
    // const {offsetLeft,offsetTop} = ev.target
    // this.current.node.style.cursor = 'move'
    // this.current.node.style.left = clientX+ 'px'
    // this.current.node.style.top = clientY+ 'px'
    // console.log(ev, 111000);
    // console.log(clientX,this.dragStartX,offsetLeft)
    // console.log(clientY,this.dragStartY,offsetTop)
    // console.log( ev.target,offsetTop,offsetLeft,clientX - offsetLeft, clientY - offsetTop)
  };
  onPointerDown = (ev) => {
    this.selectedNode = this.findDesignNodeByDOM(ev.target);
    this.chooseNode(this.selectedNode);
    // const { clientX, clientY } = ev;
    // const { offsetLeft, offsetTop } = ev.target;
    // this.dragStartX = clientX - offsetLeft;
    // this.dragStartY = clientY - offsetTop;
    // this.current.node.style.position = 'absolute'
    // this.current.node.clientX
    // if(!componentId){
    //     return
    // }
    // console.log(dom,componentId,1112)
  };
  /**
   * 获取设计节点
   * @param node
   * @returns
   */
  findDesignNodeByDOM = (node): DesignNode => {
    const __reactFiberPropty = Object.keys(node).find((i) => i.startsWith("__reactFiber"));
    /** 往上找第一个 class 组件 */
    const findDeisgnNode = (fiber) => {
      let element = null;
      while (fiber) {
        if (fiber.tag === 5) {
          element = fiber.stateNode;
        }
        fiber = fiber.return;
        if (fiber?.tag == 1) {
          return { fiber, element };
        }
      }
      return null;
    };
    let classComponent = findDeisgnNode(node[__reactFiberPropty]);
    /** 如果找到的组件不是容器组件，继续找 */
    let parentClassComponent = classComponent;
    const parents: DesignNode[] = [];
    while (parentClassComponent?.fiber) {
      parentClassComponent = findDeisgnNode(parentClassComponent.fiber);
      const { element, fiber } = parentClassComponent ?? {};
      if (!parentClassComponent || !element) {
        break;
      }
      parents.push({ element, type: fiber.type, id: fiber.key });
      if (["Page"].includes(parentClassComponent.fiber.type.name)) {
        break;
      }
      if (!["Container", "Designer"].includes(parentClassComponent.fiber.type.name)) {
        classComponent = parentClassComponent;
      }
    }
    if (!classComponent.fiber || !classComponent.fiber.key) {
      return null;
    }
    return { element: classComponent.element, type: classComponent.fiber.type, id: classComponent.fiber.key };
  };
}

declare global {
  interface Window {
    React: typeof React;
    ReactDOM: typeof ReactDOM;
    sodaCore: typeof SodaCore;
  }
}
