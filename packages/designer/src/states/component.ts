import { makeObservable, action } from "mobx";
import { computed, reactive } from "@soda/core";
import { ComponentGroup, PropDescriptor, getLibName, getMainVersion } from "@soda/utils";

import { Http } from "../utils";
import { A, Button, Span } from "@soda/base";

export default class ComponentState {
  constructor() {
    makeObservable(this);
  }
  /**
   * 组件元数据
   */
  @reactive groups: ComponentGroup[] = [];
  /**
   * 组件元数据
   */
  @reactive propsMeta: { [key: string]: PropDescriptor[] } = {};
  /**
   * 组件库地址
   */
  @reactive urls: string[] = [];
  /**
   * 组件初始化
   * @param groups
   */
  @action init(groups: ComponentGroup[] = [], props: PropDescriptor[][] = []) {
    this.groups = groups;
    this.groups.sort(({ order: order1 = 0 }, { order: order2 = 0 }) => +order1 - +order2);
    const propsMeta: { [key: string]: PropDescriptor[] } = {};
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      propsMeta[group.library] = props[i];
    }
    this.propsMeta = propsMeta;
  }

  @action async register(urls: string[]) {
    this.urls = urls;
    const [groups, props] = await Promise.all([Promise.all(urls.map((url) => Http.get<ComponentGroup>(`${url}/manifest.json`))), Promise.all(urls.map((url) => Http.get<PropDescriptor[]>(`${url}/prop-meta.json`)))]);
    this.init(groups, props);
  }
  @action getPropsMeta(packageName: string, componentName: string) {
    return this.propsMeta[packageName]?.[componentName] ?? [];
  }
  /**
   * 获取组件元数据
   */
  @computed get componentMeta() {
    return this.groups
      .map((group) => {
        return group.components.map((component) => ({
          ...component,
          packageName: group.library,
          packageVersion: group.version,
        }));
      })
      .reduce((pre, cur) => pre.concat(cur), []);
  }
  /**
   * 获取库
   */
  @computed get componentMap() {
    const map = {};
    this.groups.forEach((group) => {
      const { library, name, version } = group;
      const libName = `${getLibName(library, name)}${getMainVersion(version)}`;
      const classes = window[libName];
      if (!map[library] && classes) {
        map[library] = [classes];
      }
    });
    return Object.keys(map).length ? map : { sodaBase1: { Span, A, Button, version: "1.0.0" } };
  }
}
