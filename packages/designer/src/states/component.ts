import { makeObservable, action } from "mobx";
import { computed, reactive } from "@soda/core";
import { ComponentGroup } from "@soda/utils";

import { Http } from "../utils";

export default class ComponentState {
  constructor() {
    makeObservable(this);
  }
  /**
   * 组件元数据
   */
  @reactive groups: ComponentGroup[] = [];
  /**
   * 组件库地址
   */
  @reactive urls: string[] = [];
  /**
   * 组件初始化
   * @param component
   */
  @action init(component?: ComponentGroup[]) {
    this.groups = component ? component : [];
    this.groups.sort(({ order: order1 = 0 }, { order: order2 = 0 }) => +order1 - +order2);
  }

  @action async register(urls: string[]) {
    this.urls = urls;
    const res = await Promise.all(urls.map((url) => Http.get<ComponentGroup>(`${url}/manifest.json`)));
    this.init(res);
  }
  @computed get components() {
    return this.groups
      .map((group) => {
        return group.components.map((component) => ({
          ...component,
          packageName: group.name,
          packageVersion: group.version,
        }));
      })
      .reduce((pre, cur) => pre.concat(cur), []);
  }
}
