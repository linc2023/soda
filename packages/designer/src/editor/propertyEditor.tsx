/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from "@soda/core/src/lib/component";

export interface PropertyEditorProps {
  value: any;
  onChange: (val: any) => void;
}

export abstract class PropertyEditor extends Component<PropertyEditorProps> {}
