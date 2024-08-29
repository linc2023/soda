import { ReactNode } from "react";
import { TypeEditor } from "@soda/core";
import { ColorPicker } from "@soda/common";

export class ColorTypeEditor extends TypeEditor {
  render(): ReactNode {
    return <ColorPicker {...this.props}></ColorPicker>;
  }
}
