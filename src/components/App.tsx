import { Component, Widget } from "@soda/core";
import { globalState } from "@soda/designer";

import Left from "./Left";
import Main from "./Main";
import Right from "./Right";
import "./app.scss";

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
