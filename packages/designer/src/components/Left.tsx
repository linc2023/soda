import { Component } from "@soda/core";
import { GlobalStateProps, UIPluginPlacement, globalState, pluginRunder } from "@soda/designer";
import { CSSProperties } from "react";

type LeftProps = {
  width?: number;
  style?: CSSProperties;
  className?: string;
};

export default class Left extends Component<GlobalStateProps & LeftProps> {
  /**
   * 组件位置
   */
  placement: UIPluginPlacement = "left";

  render() {
    const { style = {}, className = "", width = 240 } = this.props;
    return (
      <div className={`${globalState.environment.$project_name}-designer-left ${className}`} style={{ width, height: "100%", ...style }}>
        {pluginRunder(this.placement)}
      </div>
    );
  }
}
