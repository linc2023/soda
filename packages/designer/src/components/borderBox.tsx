import { Component, Widget, action, reactive } from "@soda/core";
import { CSSProperties, ReactNode, createRef } from "react";

@Widget
export class BorderBox extends Component<{ borderStyle: "dashed" | "solid"; borderWidth?: number; style?: CSSProperties; itemRender?: ReactNode }> {
  /** 边框位置 */
  @reactive rect;
  /**
   * 修改边框大小
   * @param rect
   */
  @action resize(rect) {
    this.rect = rect;
  }
  render(): ReactNode {
    const { x, y, width, height, style = {} } = this.rect ?? { x: 0, y: 0, width: 0, height: 0, style: {} };
    const shown = !(width === 0 || height === 0);
    return (
      <div className="soda-borderBox" style={{ pointerEvents: "none", ...style, position: "absolute", left: x, top: y, width, height, outline: `${this.props.borderWidth ?? 2}px ${this.props.borderStyle} rgb(44, 115, 253)`, display: shown ? "block" : "none" }}>
        {this.props.itemRender}
      </div>
    );
  }
}

@Widget
export class DesignNodeBox extends Component {
  borderBoxRef = createRef();
  resize(rect) {
    this.borderBoxRef.current?.resize(rect);
  }
  render(): ReactNode {
    return <BorderBox borderStyle="solid" ref={this.borderBoxRef}></BorderBox>;
  }
}
