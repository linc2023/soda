import { Component } from "@soda/core";
import { DesignNode } from "@soda/utils";
import { CSSProperties, ReactNode } from "react";

export class BorderBox extends Component<{ borderStyle: "dashed" | "solid"; borderWidth?: number; style?: CSSProperties; itemRender?: ReactNode; designNode: DesignNode }> {
  render(): ReactNode {
    const { style = {} } = this.props;
    const { x, y, width, height } = this.props.designNode?.element?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0, style: {} };
    const shown = !(width === 0 || height === 0);

    return (
      <div className="soda-borderBox" style={{ pointerEvents: "none", ...style, position: "absolute", left: x, top: y, width, height, outline: `${this.props.borderWidth ?? 2}px ${this.props.borderStyle} rgb(44, 115, 253)`, display: shown ? "block" : "none" }}>
        {this.props.itemRender}
      </div>
    );
  }
}

export class DesignNodeBox extends Component<{ designNode: DesignNode }> {
  render(): ReactNode {
    return <BorderBox borderStyle="solid" designNode={this.props.designNode}></BorderBox>;
  }
}
