export * from "./core/designer.tsx";
export * from "./plugin.tsx";
export * from "./states";
import { Component, Widget } from "@soda/core";
import { globalState } from "@soda/designer";

import Left from "./components/Left";
import Main from "./components/Main";
import Right from "./components/Right";
import "./components/app.scss";

@Widget
export class App extends Component {
  render() {
    return (
      <div className={`${globalState.environment.$project_name}-designer`}>
        <Left></Left>
        <Main></Main>
        <Right></Right>
      </div>
    );
  }
}
