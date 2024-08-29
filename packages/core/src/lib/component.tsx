import { CSSProperties, ErrorInfo, Component as ReactComponent, ReactNode } from "react";
import { ComponentMeta, PageSchema, PlatformModeValue } from "@soda/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class Component<P = any> extends ReactComponent<P, any, any> {
  abstract render(): ReactNode;
  state: Readonly<P> = {} as Readonly<P>;

  setState(): void {
    throw new Error("setState is not allowed");
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log(error, errorInfo);
  }
}

export abstract class BaseComponent<P = any> extends Component<P> {
  /** @hidden */
  get __mode() {
    return this.props.__mode;
  }
  /** 组件标识 */
  static __sodaComponent = true;
}

export type ContainerProps = {
  className?: string;
  placeholder?: string;
  style?: CSSProperties;
  childrenDragDisabled?: boolean;
  getWhiteList?: (meta: ComponentMeta) => boolean;
  components: { [key: string]: { version: string; [key: string]: object | string }[] };
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
        {children?.length > 0 ? (
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
