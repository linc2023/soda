import { App, globalState } from "@soda/designer";
import { Component, Provider } from "@soda/core";

export default class Designer extends Component {
  render() {
    return (
      <Provider store={globalState}>
        <App />
      </Provider>
    );
  }
}
