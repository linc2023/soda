import { Component } from "@soda/core";
import { GlobalStateProps, UIPluginPlacement, globalState, pluginRunder } from "@soda/designer";
import { CSSProperties, ReactNode } from "react";

type LeftProps = {
  width?: number;
  style?: CSSProperties;
  className?: string;
};

export default class Right extends Component<GlobalStateProps & LeftProps> {
  /**
   * 组件位置
   */
  placement: UIPluginPlacement = "right";

  render(): ReactNode {
    const { style = {}, className = "", width = 300 } = this.props;
    return (
      <div className={`${globalState.environment.$project_name}-designer-right ${className}`} style={{ width, height: "100%", ...style }}>
        {pluginRunder(this.placement)}
      </div>
    );
  }
}
