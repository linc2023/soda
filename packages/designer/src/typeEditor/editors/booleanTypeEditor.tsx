import { ReactNode } from "react";
import { TypeEditor } from "@soda/core";
import { Switch } from "@soda/common";

export class BooleanTypeEditor extends TypeEditor {
  render(): ReactNode {
    return <Switch {...this.props}></Switch>;
  }
}
