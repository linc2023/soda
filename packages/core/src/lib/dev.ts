import { ReactNode } from "react";

export interface Renderer {
  render(): ReactNode;
}

export class ReactRenderer implements Renderer {
  render(): ReactNode {
    throw new Error("Method not implemented.");
  }
}
