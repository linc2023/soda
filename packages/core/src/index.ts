export * from "./lib/component.tsx";
export * from "./lib/dev";
export * from "./lib/mobx";
export * from "./lib/request.ts";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
