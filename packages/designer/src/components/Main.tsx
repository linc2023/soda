import { Component, Widget } from "@soda/core";
import { Designer } from "@soda/designer";
import { ReactNode } from "react";

@Widget
export default class Main extends Component {
  render(): ReactNode {
    return <Designer />;
  }
}
