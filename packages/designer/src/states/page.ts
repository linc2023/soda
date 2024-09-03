import { makeObservable, action } from "mobx";
import { Component, computed, reactive } from "@soda/core";
import { ComponentMeta, NodeSchema, PageSchema, getMainVersion, packageNameToCamelCase, uuid } from "@soda/utils";
import PackageState from "./package";

export default class PageState {
  constructor() {
    makeObservable(this);
  }
  /**
   * 页面 Schema
   */
  @reactive schema: PageSchema = {
    components: [
      { package: "@soda/base", version: "1.0.0", componentName: "A" },
      { package: "@soda/base", version: "1.0.0", componentName: "Button" },
      { package: "@soda/base", version: "1.0.0", componentName: "Span" },
      { package: "@soda/base", version: "1.0.0", componentName: "EventTest" },
      { package: "@soda/base", version: "1.0.0", componentName: "B" },
      { package: "@soda/base", version: "1.0.0", componentName: "MixinTest" },
    ],
    componentsTree: [
      {
        componentName: "Page",
        id: "aqasiz7lkk7a3dy222z1",
        children: [
          { componentName: "A", id: "aqasiz7lkk7a3dyz1", props: {} },
          { componentName: "EventTest", id: "aqasiz7lkk7a3dyz12", props: {} },
          { componentName: "Button", id: "kje68elzgza63nve2", props: {} },
          { componentName: "A", id: "aqasiz7lkk7a3dyz", props: {} },
          { componentName: "Span", id: "kje68elzgza63nve", props: {} },
          { componentName: "MixinTest", id: "kje68elzgza63nv11e", props: {} },
        ],
      },
    ],
  };
  /**
   * 获取节点 schema
   * @param id
   * @returns
   */
  getNodeSchemaById(id: string): NodeSchema {
    const findNode = (parents: NodeSchema[]) => {
      for (const parent of parents) {
        if (parent.id === id) {
          return parent;
        }
        if (Array.isArray(parent.children)) {
          const res = findNode(parent.children);
          if (res) {
            return res;
          }
        }
      }
      return null;
    };
    return findNode(this.schema.componentsTree);
  }

  /**
   * 获取节点 schema
   * @param id
   * @returns
   */
  getNextNodeSchemaById(id: string): NodeSchema {
    const findNode = (parents: NodeSchema[]) => {
      for (let i = 0; i < parents.length; i++) {
        const parent = parents[i];
        if (parent.id === id) {
          return i < parents.length - 1 ? parents[i + 1] : null;
        }
        if (Array.isArray(parent.children)) {
          const res = findNode(parent.children);
          if (res) {
            return res;
          }
        }
      }
      return null;
    };
    return findNode(this.schema.componentsTree);
  }

  /**
   * 根据组件实例获取组件库信息
   * @param instance
   * @param componentMap
   * @returns
   */
  getLibraryByComponentName(instance: Component, componentMap: PackageState["componentMap"]) {
    const res = this.schema.components
      .map(({ package: packageName, version, componentName }) => {
        const libName = packageNameToCamelCase(packageName) + getMainVersion(version);
        return {
          packageName,
          version,
          componentName,
          libName,
          component: componentMap[libName][componentName],
        };
      })
      .find((c) => c.component === instance) ?? { libName: null, componentName: null };
    return { packageName: res.libName, componentName: res.componentName };
  }
  /**
   * 获取所有父节点
   * @param id
   * @returns
   */
  getParents(id: string) {
    const parents = [];
    const findNode = (nodes: NodeSchema[]) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.id === id) {
          break;
        }
        if (Array.isArray(node.children)) {
          parents.push(node);
          findNode(node.children);
        }
      }
    };
    findNode(this.schema.componentsTree);
    if (parents.length === 0) {
      parents.push(this.schema.componentsTree[0]);
    }
    return parents;
  }
  /**
   * 获取单个父节点
   * @param id
   * @returns
   */
  getParent(id: string): NodeSchema {
    const parents = this.getParents(id);
    return parents?.length > 0 ? parents[0] : null;
  }
  /**
   * 删除节点
   * @param id
   */
  @action deleteNode(id: string) {
    const parent = this.getParent(id);
    const index = parent.children.findIndex((i) => i.id === id);
    const item = parent.children[index];
    parent.children.splice(index, 1);
    return item;
  }
  /**
   * 设置 schema
   * @param schema
   */
  @action setSchema(schema: PageSchema) {
    this.schema = schema;
  }
  /**
   * 在节点前插入新节点
   * @param newNode
   * @param referenceNode
   */
  @action insertNodeSchema(newNode: ComponentMeta | NodeSchema, referenceNode: any) {
    const parent = this.getParent(referenceNode.id);
    const index = parent.children.findIndex((i) => i.id === referenceNode.id);
    const node = { id: uuid(), ...newNode };
    if (index === -1) {
      parent.children.push(node);
    } else {
      parent.children.splice(index, 0, node);
    }
    this.schema = {
      ...this.schema,
    };
  }
}
