import { makeObservable } from "mobx";
import { observer } from "mobx-react";

export { makeObservable, action, computed } from "mobx";
export { observable as reactive } from "mobx";
export { Provider } from "mobx-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Widget(target: any) {
  observer.call(target, target as never);
  return class extends target {
    constructor(args: never) {
      super(args);
      makeObservable(this);
    }
  } as never;
}
