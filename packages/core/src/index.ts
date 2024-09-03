export * from "./lib/component.tsx";
export * from "./lib/dev";
export * from "./lib/mobx";
export * from "./lib/request.ts";
export * from "./lib/renders.tsx";
export * from "./lib/propertyEditor.tsx";
export * from "./types.ts";
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
