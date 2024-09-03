import { globalState } from "../states";
import React, { DragEvent, ReactNode, createRef } from "react";
import ReactDOM from "react-dom/client";
import { BorderBox, DesignNodeBox } from "./borderBox";
import { ComponentMeta, DesignNode, findDesignInfoByDOM, findDomByFiber } from "@soda/utils";
import { UIPlugin } from "..";
import { Widget, WebRender, reactive, action } from "@soda/core";

@Widget
export class PageDesigner extends UIPlugin {
  /** 需要挂载的根节点 */
  positionRef = createRef<HTMLElement>();
  webRenderRef = createRef<WebRender>();
  dragDomRef = createRef<HTMLDivElement>();
  /** 组件库 */
  componentMap = globalState.package.componentMap;
  /** 设计中的节点 */
  @reactive designNode: DesignNode;
  /** 鼠标移入节点 */
  @reactive hoverNode: DesignNode;
  /** 画布中移动的节点 */
  moveNode: DesignNode;

  offsetX = 0;
  offsetY = 0;

  render(): ReactNode {
    return (
      <div className={`${globalState.environment.$project_name}-designer-main`} onPointerLeave={this.onPointerLeave} onDragLeave={this.hidePositionRef} onDragOver={this.changePositionRef} onPointerMove={this.onPointerMove} onPointerUp={this.onPointerUp} onDrop={this.insertComponent} onPointerDown={this.onPointerDown}>
        <WebRender ref={this.webRenderRef} schema={globalState.page.schema} componentMap={this.componentMap} />
        <div className="design-tool">
          <DesignNodeBox designNode={this.designNode}></DesignNodeBox>
          <BorderBox designNode={this.hoverNode} borderWidth={1} borderStyle="dashed"></BorderBox>
          <div ref={this.dragDomRef} style={{ padding: "8px 10px", boxShadow: "0px 0px 2px 2px #eeeeee", color: "#555555", position: "absolute", pointerEvents: "none" }}></div>
          <span ref={this.positionRef} style={{ borderLeft: "4px solid #1772f6", position: "absolute" }}></span>
        </div>
      </div>
    );
  }

  /**
   * 选中节点
   * @param designNode
   */
  @action chooseNode = (designNode: DesignNode) => {
    const res = globalState.page.getLibraryByComponentName(designNode.type, this.componentMap);
    designNode.componentName = res.componentName;
    designNode.libary = res.packageName;
    this.$emit("designNode:change", designNode, this.webRenderRef.current.$refs[designNode.id]);
    this.designNode = designNode;
  };
  componentDidMount(): void {
    this.$on("designNode:propsChange", (key: string, value: any) => {
      const node = globalState.page.getNodeSchemaById(this.designNode.id);
      node.props[key] = value;
      this.webRenderRef.current.modifyNodeProps(this.designNode.id, key, value);
      setTimeout(() => this.refreshDesignNode());
    });
    this.$on("designNode:changeDesignNodeById", (id: string) => {
      const instance = this.webRenderRef.current.$refs[id];
      const fiber = instance._reactInternals;
      const element = findDomByFiber(fiber);
      this.chooseNode({ element, type: fiber?.type, id: fiber?.key });
    });
  }

  @action private refreshDesignNode = () => {
    this.designNode = { ...this.designNode };
  };

  /**
   * 隐藏插入位置
   */
  hidePositionRef = () => {
    this.positionRef.current.style.height = "0px";
  };
  /**
   * 修改插入位置
   * @param ev
   */
  changePositionRef = (ev) => {
    ev.preventDefault();
    const slibing = this.findDesignInfoByDOM(ev.target as HTMLElement);
    let lastChildNode = slibing.element.previousElementSibling;
    if (slibing.type.__isContainer__) {
      const childNodes = slibing.element.childNodes;
      lastChildNode = childNodes[childNodes.length - 1] as HTMLElement;
    }
    const { x, y, height, width } = (lastChildNode ?? slibing.element).getBoundingClientRect();
    this.positionRef.current.style.top = `${y}px`;
    this.positionRef.current.style.left = `${x + (lastChildNode ? width : 0) - 4}px`;
    this.positionRef.current.style.height = `${height}px`;
  };

  changeDragDOMRef = (ev) => {
    if (this.moveNode?.componentName) {
      this.dragDomRef.current.style.left = ev.clientX - this.offsetX + "px";
      this.dragDomRef.current.style.top = ev.clientY - this.offsetY + "px";
      this.dragDomRef.current.innerHTML = this.moveNode.componentName;
      this.dragDomRef.current.style.display = "inline";
    }
  };
  /**
   * 新增组件
   * @param ev
   */
  insertComponent = (ev: DragEvent<HTMLElement>) => {
    const componentMeta: ComponentMeta = JSON.parse(ev.dataTransfer.getData("componentMeta"));
    const sibling = this.findDesignInfoByDOM(ev.target as HTMLElement);
    globalState.page.insertNodeSchema(componentMeta, sibling);
    this.hidePositionRef();
  };

  @action onPointerUp = (ev) => {
    const sibling = this.findDesignInfoByDOM(ev.target as HTMLElement);
    if (this.moveNode && this.moveNode.id !== sibling.id) {
      const nodeSchema = globalState.page.deleteNode(this.moveNode.id);
      globalState.page.insertNodeSchema(nodeSchema, sibling);
    }
    this.dragDomRef.current.style.display = "none";
    this.hidePositionRef();
    this.moveNode = null;
    setTimeout(() => this.refreshDesignNode());
  };
  /**
   * 鼠标移出
   */
  @action onPointerLeave = (ev) => {
    this.hoverNode = null;
  };
  @action onPointerMove = (ev) => {
    ev.preventDefault();
    if (this.moveNode) {
      this.changePositionRef(ev);
      this.changeDragDOMRef(ev);
    } else {
      this.hoverNode = this.findDesignInfoByDOM(ev.target);
    }
  };
  onPointerDown = (ev) => {
    const node = this.findDesignInfoByDOM(ev.target);
    if (!node) {
      return;
    }
    this.offsetX = ev.clientX - node.element.getBoundingClientRect().left;
    this.offsetY = ev.clientY - node.element.getBoundingClientRect().top;
    this.moveNode = node;
    this.chooseNode(node);
  };
  /**
   * 获取设计信息
   * @param dom DOM节点
   * @returns node 鼠标所在节点
   */
  findDesignInfoByDOM = (dom: HTMLElement): DesignNode => {
    const isDesignComponent = (fiber) => fiber?.tag == 1 && fiber?.type.__sodaComponent;
    return findDesignInfoByDOM(dom, isDesignComponent) as DesignNode;
  };
}

declare global {
  interface Window {
    React: typeof React;
    ReactDOM: typeof ReactDOM;
    sodaCore: typeof SodaCore;
  }
}
