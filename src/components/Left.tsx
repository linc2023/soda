import { Component, Node, CSSProperties } from "@soda/core";
import { GlobalStateProps, UIPluginPlacement, PluginRender, globalState } from "@soda/designer";

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

  render(): Node {
    const { placement } = this;
    const { style = {}, className = "", width = 240 } = this.props;
    return (
      <div className={`${globalState.environment.$project_name}-designer-left ${className}`} style={{ width, height: "100%", ...style }}>
        {<PluginRender placement={placement}></PluginRender>}
      </div>
    );
  }
}
