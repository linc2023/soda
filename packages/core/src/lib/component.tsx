import { CSSProperties, ErrorInfo, Component as ReactComponent, ReactNode } from "react";
import { ComponentMeta, PageSchema, PlatformMode, PlatformModeValue } from "@soda/utils";
import { Widget, reactive } from "./mobx";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export abstract class Component<P = any> extends ReactComponent<P & { children?: ReactNode | ReactNode[] }, any, any> {
  state: Readonly<P> = {} as Readonly<P>;

  setState(): void {
    throw new Error("setState is not allowed");
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log(error, errorInfo);
  }
}

@Widget
export class BaseComponent<P = object> extends Component<P & { __mode?: PlatformMode }> {
  /** @hidden */
  get __mode() {
    return this.props.__mode;
  }
  /** 组件标识 */
  static __sodaComponent = true;

  /**
   *  是否锁定
   *  @hidden
   */
  @reactive lock: boolean;
  render(): ReactNode {
    throw new Error("没有实现 render 方法");
  }
}

export type ContainerProps = {
  className?: string;
  placeholder?: string;
  style?: CSSProperties;
  childrenDragDisabled?: boolean;
  getWhiteList?: (meta: ComponentMeta) => boolean;
  mode: PlatformModeValue;
  chooseNode?: (selectedNode: PageSchema) => void;
};

/**
 * 容器
 */
export class Container extends BaseComponent<ContainerProps> {
  /** 容器组件标识 */
  static __isContainer__ = true;
  /**
   * 是否可设计
   */
  get canDesign() {
    return this.props.mode === "DESIGN";
  }

  render(): ReactNode {
    const { placeholder = "拖拽组件到此", className = "", style } = this.props;
    const { children } = this.props;
    return this.canDesign ? (
      <div style={style} className={`${className}`}>
        {Array.isArray(children) && children.length > 0 ? (
          children
        ) : (
          <div className={`default-page-containerEmpty`}>
            <div className={`default-page-containerPlaceholder`}>{placeholder}</div>
          </div>
        )}
      </div>
    ) : (
      <>{children}</>
    );
  }
}
