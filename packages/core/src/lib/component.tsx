import { CSSProperties, ErrorInfo, Component as ReactComponent, ReactNode, RefObject } from "react";
// import { globalState } from "../states";
// import { LogicPlugin, PluginOptions } from "../common/plugin";
import { Widget, reactive } from "./mobx";
import * as antd from "antd";
import { ComponentMeta, DesignComponent, uuid } from "@soda/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class Component<P = object> extends ReactComponent<P, any, any> {
  abstract render(): ReactNode;
  state: Readonly<P> = {} as Readonly<P>;
  /**
   *  @deprecated
   */
  setState(): void {
    throw new Error("setState is not allowed");
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log(error, errorInfo);
  }
  // $emit(eventName: string | string[], plugin: LogicPlugin, options: PluginOptions = { allowOverride: false }) {
  //   globalState.event.emit(eventName, plugin, options);
  // }
  // $on(eventName: string | string[], logicPlugin: LogicPlugin) {
  //   globalState.event.on(eventName, logicPlugin);
  // }
}

export type ContainerProps = {
  className?: string;
  placeholder?: string;
  style?: CSSProperties;
  dropDisabled?: boolean;
  childrenDragDisabled?: boolean;
  getWhiteList?: (meta: ComponentMeta) => boolean;
};

/**
 * 容器
 */

export class Container extends Component<ContainerProps> {
  /**
   * 组件列表
   */
  children: DesignComponent[] = [];
  /**
   * 拖到开始 x 坐标
   */
  private dragStartX = 0;
  /**
   * 拖到开始 y 坐标
   */
  private dragStartY = 0;

  current: DesignComponent;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentRefMap: { [key: string]: RefObject<any> } = {};

  onDrop = (ev) => {
    ev.preventDefault();
    const componentMeta: ComponentMeta = JSON.parse(ev.dataTransfer.getData("componentMeta"));
    const getWhiteList = this.props.getWhiteList ?? (() => true);
    if (getWhiteList(componentMeta)) {
      this.children.push({ ...componentMeta, id: uuid() });
    }
    console.log(ev);
    // const div = document.createElement('div')
    // div.innerHTML = componentMeta.label
    // ev.target.appendChild(render(Input, null));
  };
  onDragOver = (ev) => {
    if (this.current) {
      return;
    }
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  };
  initDesignComponent = (node) => {
    // let componentId = null
    // while (node.parentNode) {
    //     for (const [key, ref] of Object.entries(this.componentRefMap)) {
    //         if (ref === node) {
    //             componentId = key
    //             break
    //         }
    //     }
    //     if (componentId) {
    //         break
    //     }
    //     node = node.parentNode
    // }
    // if (!componentId) {
    //     this.current = null
    //     return
    // }
    // this.current = { node, componentId, }
  };
  onPointerDown = (ev) => {
    this.initDesignComponent(ev.target);
    if (!this.current) {
      return;
    }
    const { clientX, clientY } = ev;
    const { offsetLeft, offsetTop } = ev.target;
    this.dragStartX = clientX - offsetLeft;
    this.dragStartY = clientY - offsetTop;
    // this.current.node.style.position = 'absolute'
    // this.current.node.clientX
    console.log(ev);
    // if(!componentId){
    //     return
    // }
    // console.log(dom,componentId,1112)
  };
  onPointerUp = (ev) => {
    this.current = null;
  };
  onPointerMove = (ev) => {
    if (!this.current) {
      return;
    }
    // const { clientX, clientY } = ev
    // const {offsetLeft,offsetTop} = ev.target
    // this.current.node.style.cursor = 'move'
    // this.current.node.style.left = clientX+ 'px'
    // this.current.node.style.top = clientY+ 'px'
    console.log(ev, 111000);

    // console.log(clientX,this.dragStartX,offsetLeft)
    // console.log(clientY,this.dragStartY,offsetTop)
    // console.log( ev.target,offsetTop,offsetLeft,clientX - offsetLeft, clientY - offsetTop)
  };
  render(): ReactNode {
    const { placeholder = "拖拽组件到此", className = "", dropDisabled, ...rest } = this.props;
    return (
      <div onDrop={!dropDisabled ? this.onDrop : null} onDragOver={!dropDisabled ? this.onDragOver : null} onPointerDown={this.onPointerDown} onPointerUp={this.onPointerUp} onPointerMove={this.onPointerMove} {...rest} className={`default-page ${className}`}>
        {this.children?.length > 0 ? (
          this.children.map((component) => {
            const { componentName, id } = component;
            const Comp = antd[component.componentName] ?? (() => <div>{componentName}组件不存在</div>);
            return (
              <Comp key={component.id} ref={(ref) => (this.componentRefMap[id] = ref)}>
                按钮
              </Comp>
            );
          })
        ) : (
          <div className={`default-page-containerEmpty`}>
            <div className={`default-page-containerPlaceholder`}>{placeholder}</div>
          </div>
        )}
      </div>
    );
  }
}
