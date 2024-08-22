import { Component, Provider } from "@soda/core";
import { globalState } from "@soda/designer";
export default class Previewer extends Component {
  render() {
    return <Provider store={globalState}>1111</Provider>;
  }
}
