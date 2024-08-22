import * as SodaCore from "@soda/core";
import { IFrameContainer } from "./iframeContainer";
import { globalState } from "../states";
import React, { ReactNode, createRef } from "react";
import ReactDOM from "react-dom/client";

@SodaCore.Widget
export class Designer extends SodaCore.Component {
  iframeContainer = new IFrameContainer();
  ref = createRef<HTMLDivElement>();
  render(): ReactNode {
    return <div ref={this.ref} className={`${globalState.environment.$project_name}-designer-main`}></div>;
  }
  componentDidMount(): void {
    const iframe = this.iframeContainer;
    iframe.append(this.ref.current!);
    iframe.onReady(async () => {
      await Promise.all([iframe.insertJS("https://g.alicdn.com/code/lib/react/18.2.0/umd/react.development.js"), iframe.insertJS("https://g.alicdn.com/code/lib/react-dom/18.2.0/umd/react-dom.development.js"), iframe.insertJS("https://cdnjs.cloudflare.com/ajax/libs/react-is/18.3.1/umd/react-is.development.js")]);
      await iframe.insertJS("https://g.alicdn.com/code/lib/antd/4.23.0/antd.min.js");
      await iframe.insertJS("https://cdnjs.cloudflare.com/ajax/libs/mobx/6.13.1/mobx.umd.production.min.js");
      await iframe.insertJS(" https://cdnjs.cloudflare.com/ajax/libs/mobx-react/9.1.1/mobxreact.umd.production.min.js");

      iframe.insertStyle("http://g.alicdn.com/code/lib/antd/4.23.0/antd.min.css");
      await iframe.insertJS("https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.4/axios.min.js");

      await iframe.insertJS("https://cdnjs.cloudflare.com/ajax/libs/classnames/2.5.2/index.min.js");
      // await iframe.insertJS("https://cdnjs.cloudflare.com/ajax/libs/classnames/2.5.2/index.min.js")
      await iframe.insertJS("/components/@soda/core/core.umd.js");
      await iframe.insertJS("/components/@soda/base/1.0.0/base.umd.js");

      // iframe.window.Container = Container
      // <Container style={{'--container-emptyBackgroundColor': '#fff'}} />
      // eslint-disable-next-line no-with
      const ReactDOM = iframe.window.ReactDOM;
      const sodaCore = iframe.window.sodaCore;
      ReactDOM.createRoot(iframe.document.getElementById("app")!).render(<sodaCore.Container />);
    });
  }
}

declare global {
  interface Window {
    React: typeof React;
    ReactDOM: typeof ReactDOM;
    sodaCore: typeof SodaCore;
  }
}
