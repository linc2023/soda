import { Component } from "@soda/core";
import { CSSProperties } from "react";

import { PageDesigner } from "../designer/pageDesigner.tsx";
import { pluginRunder } from "../plugin.tsx";
import { globalState } from "../states";

import "./app.scss";

type AppProps = {
  style?: CSSProperties;
  className?: string;
};
export class App extends Component<AppProps> {
  render() {
    return (
      <div className={`${globalState.environment.$project_name}-designer`} style={this.props.style}>
        <div className={`${globalState.environment.$project_name}-designer-left`} style={{ width: 240, height: "100%" }}>
          {pluginRunder("left")}
        </div>
        <PageDesigner></PageDesigner>
        <div className={`${globalState.environment.$project_name}-designer-right`} style={{ width: 300, height: "100%" }}>
          {pluginRunder("right")}
        </div>
      </div>
    );
  }
}
