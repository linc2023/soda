import { Component, Provider } from "@soda/core";
import { globalState } from "@soda/designer";
import { createRef } from "react";
import { IFrameContainer } from "../components/iframeContainer";
export default class Previewer extends Component {
  desigerRootRef = createRef<HTMLDivElement>();
  iframeContainer = new IFrameContainer();
  render() {
    globalState.environment.init({ mode: "PREVIEW" });
    return (
      <Provider store={globalState}>
        <div ref={this.desigerRootRef} className={`${globalState.environment.$project_name}-previewer-main`}></div>
      </Provider>
    );
  }
  componentDidMount(): void {
    const iframe = this.iframeContainer;
    iframe.append(this.desigerRootRef.current!);
    iframe.onReady(async () => {
      await Promise.all([iframe.insertJS("https://g.alicdn.com/code/lib/react/18.2.0/umd/react.development.js"), iframe.insertJS("https://g.alicdn.com/code/lib/react-dom/18.2.0/umd/react-dom.development.js"), iframe.insertJS("https://cdnjs.cloudflare.com/ajax/libs/react-is/18.3.1/umd/react-is.development.js")]);
      await iframe.insertJS("https://cdnjs.cloudflare.com/ajax/libs/mobx/6.13.1/mobx.umd.production.min.js");
      await iframe.insertJS("https://cdnjs.cloudflare.com/ajax/libs/mobx-react-lite/4.0.7/mobxreactlite.umd.production.min.js");
      await iframe.insertJS(" https://cdnjs.cloudflare.com/ajax/libs/mobx-react/9.1.1/mobxreact.umd.production.min.js");
      iframe.insertStyle("http://g.alicdn.com/code/lib/antd/4.23.0/antd.min.css");
      await Promise.all([iframe.insertJS("https://cdnjs.cloudflare.com/ajax/libs/classnames/2.5.2/index.min.js"), iframe.insertJS("https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.4/axios.min.js"), iframe.insertJS("/components/@soda/core/core.umd.js"), iframe.insertJS("https://g.alicdn.com/code/lib/antd/4.23.0/antd.min.js")]);
      await iframe.insertJS("/components/@soda/base/1.0.0/base.umd.js");
      iframe.insertStyle("/components/@soda/base/1.0.0/style.css");
      // const ReactDOM = iframe.window.ReactDOM;
      // const sodaCore = iframe.window.sodaCore;
      // ReactDOM.createRoot(iframe.document.getElementById("app")!).render(<>xxx</>);
    });
  }
}
