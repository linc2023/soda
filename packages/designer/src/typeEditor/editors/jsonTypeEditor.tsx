import { ReactNode } from "react";
import { Input } from "@soda/common";
import { TypeEditor } from "@soda/core";

export class StringTypeEditor extends TypeEditor {
  render(): ReactNode {
    return <Input {...this.props}></Input>;
  }
}
