import { ReactNode } from "react";
import { TypeEditor } from "@soda/core";
import { InputNumber } from "@soda/common";

export class NumberTypeEditor extends TypeEditor {
  static name = "数字输入";
  render(): ReactNode {
    return <InputNumber {...this.props}></InputNumber>;
  }
}
