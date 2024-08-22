import React ,{ ReactNode } from "react";
import { PropertyEditor } from "../propertyEditor";
import { Input } from "@soda/common";

export class StringTypeEditor extends PropertyEditor{
    render(): ReactNode {
        return <Input {...this.props}></Input>
    }
}