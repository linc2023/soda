import { ElementType, ReactNode, forwardRef } from "react";
import { Component, Container } from "./component";
import { NodeSchema, PageSchema, getMainVersion, packageNameToCamelCase } from "@soda/utils";
import { globalState } from "@soda/designer";

/**
 * @container
 */
export class Page extends Container {
  render() {
    const { children } = this.props;
    return (
      <div className="default-page" style={{ width: "100%", height: "100%" }}>
        {children}
      </div>
    );
  }
}

type RenderType = {
  schema: PageSchema;
  componentMap: { [key: string]: { [key: string]: Component }[] };
};

abstract class Render extends Component<RenderType> {
  /** refs */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refsMap: { [key: string]: any } = {};
  /**
   * 所有 refs
   */
  get $refs() {
    return this.refsMap;
  }
  /**
   * 查询组件
   * @param componentName
   * @param componentMap
   * @returns
   */
  getComponent(componentName: string, componentMap: RenderType["componentMap"]): ElementType {
    const findComponent = ({ package: packageName, version, componentName }: { package: string; version: string; componentName: string }) => {
      const libName = packageNameToCamelCase(packageName) + getMainVersion(version);
      return componentMap[libName][componentName];
    };
    const meta = this.props.schema.components.find(({ componentName: cname }) => componentName === cname);
    let Comp = meta ? findComponent(meta) : null;
    if (!Comp) {
      if (componentName === "Page") {
        Comp = Page;
      } else {
        Comp = forwardRef(() => <div>{componentName}组件不存在</div>);
      }
    }
    Comp.__componentMeta = meta;
    return Comp as ElementType;
  }
  /**
   * 通过组件 schema 渲染组件
   * @param schemas
   * @param componentMap
   * @returns
   */
  schemasToComponent(schemas: NodeSchema[], componentMap = this.props.componentMap): ReactNode[] {
    return schemas.map((schema) => {
      const { componentName, id, children: childrenMeta, props, advanced: { isContainer } = { isContainer: false } } = schema;
      const Comp = this.getComponent(componentName, componentMap);
      const children = !Array.isArray(childrenMeta) ? null : this.schemasToComponent(childrenMeta, componentMap);
      return (
        <Comp key={id} id={id} {...this.calcProps(props)} ref={(ref) => (this.refsMap[id] = ref)}>
          {isContainer ? <Container mode={globalState.environment.mode} children={children}></Container> : children}
        </Comp>
      );
    });
  }
  calcProps(props = {}) {
    const res = {};
    Object.keys(props).forEach((key) => {
      // if (props[key]?.type === "function") {
      // }
      res[key] = props[key];
    });
    return res;
  }
}

/**
 * 渲染浏览器组件
 */
export class WebRender extends Render {
  render(): ReactNode {
    const { componentsTree } = this.props.schema;
    return <>{this.schemasToComponent(componentsTree)}</>;
  }
  modifyNodeProps(nodeId: string, propKey: string, value: any) {
    if (this.$refs && this.$refs[nodeId] && this.$refs[nodeId][propKey]) {
      this.$refs[nodeId][propKey] = value;
    }
  }
}
