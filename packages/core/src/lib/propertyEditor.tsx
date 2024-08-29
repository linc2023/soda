import { Component } from "./component";

export interface TypeEditorProps {
  value: any;
  onChange: (val: any) => void;
}

export abstract class TypeEditor extends Component<TypeEditorProps> {}
