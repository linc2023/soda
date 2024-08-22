import { globalState } from "@soda/designer";
import { Component, Provider } from "@soda/core";
import { App } from "../components/App";

export default class Designer extends Component {
  render() {
    return (
      <Provider store={globalState}>
        <App />
      </Provider>
    );
  }
}
