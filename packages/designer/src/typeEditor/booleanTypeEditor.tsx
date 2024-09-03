import { ReactNode } from "react";
import { TypeEditor } from "@soda/core";
import { Switch } from "@soda/common";

export class BooleanTypeEditor extends TypeEditor {
  static name = "布尔";
  render(): ReactNode {
    return <Switch {...this.props}></Switch>;
  }
}
