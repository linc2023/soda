import { ElementType, ReactNode, forwardRef } from "react";
import { Component, Container } from "./component";
import { PageSchema, getMainVersion, packageNameToCamelCase } from "@soda/utils";

/**
 * @container
 */
export class Page extends Component {
  render() {
    const { children } = this.props;
    return <div className="default-page">{children}</div>;
  }
}

type RenderType = {
  schema: PageSchema;
  componentMap: { [key: string]: { version: string; [key: string]: object | string }[] };
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
    const pkg = this.props.schema.components.find(({ componentName: cname }) => componentName === cname);
    let Comp = pkg ? findComponent(pkg) : null;
    if (!Comp) {
      if (componentName === "Page") {
        Comp = Page;
      } else {
        Comp = forwardRef(() => <div>{componentName}组件不存在</div>);
      }
    }
    return Comp as ElementType;
  }
  /**
   * 通过组件 schema 渲染组件
   * @param schemas
   * @param componentMap
   * @returns
   */
  schemasToComponent(schemas: PageSchema["componentsTree"], componentMap = this.props.componentMap) {
    return schemas.map((schema) => {
      const { componentName, id, children: childrenMeta, props = {}, advanced: { isContainer = true } = { isContainer: true } } = schema;
      const Comp = this.getComponent(componentName, componentMap);
      const children = !Array.isArray(childrenMeta) ? null : this.schemasToComponent(childrenMeta, componentMap);
      return (
        <Comp key={id} id={id} {...props} ref={(ref) => (this.refsMap[id] = ref)}>
          {isContainer ? <Container children={children}></Container> : children}
        </Comp>
      );
    });
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
}
