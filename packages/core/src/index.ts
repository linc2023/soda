export * from "./lib/component.tsx";
export * from "./lib/dev";
export * from "./lib/mobx";
export * from "./lib/request.ts";
export * from "./lib/renders.tsx";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
