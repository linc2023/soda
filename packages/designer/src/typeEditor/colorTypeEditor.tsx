import { ReactNode } from "react";
import { TypeEditor } from "@soda/core";
import { ColorPicker } from "@soda/common";

export class ColorTypeEditor extends TypeEditor {
  static name = "颜色选择器";
  render(): ReactNode {
    return <ColorPicker {...this.props}></ColorPicker>;
  }
}
