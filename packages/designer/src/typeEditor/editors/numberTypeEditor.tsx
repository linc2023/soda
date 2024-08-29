import { ReactNode } from "react";
import { TypeEditor } from "@soda/core";
import { InputNumber } from "@soda/common";

export class NumberTypeEditor extends TypeEditor {
  render(): ReactNode {
    return <InputNumber {...this.props}></InputNumber>;
  }
}
