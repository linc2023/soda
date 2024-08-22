import { Component, Widget } from "@soda/core";
import { globalState } from "./states";
import { ReactNode, cloneElement, ReactElement } from "react";
export enum PlatformModel {
  DESIGN = "DESIGN",
  PRODUCTION = "PRODUCTION",
  PREVIEW = "PREVIEW",
  ALL = "ALL",
}

export type PlatformModelValue = keyof typeof PlatformModel;
export abstract class BasePlugin {
  /**
   * 销毁回调
   * @returns
   */
  destroy?: () => void | Promise<void>;
  /**
   * 优先级
   */
  priority: number = 0;
}

enum Placement {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  MAIN = "MAIN",
  TOP = "TOP",
}
/**
 * 插件位置
 */
export type UIPluginPlacement = Lowercase<keyof typeof Placement>;
export abstract class UIPlugin extends BasePlugin {
  /**
   * 插件名称
   */
  pluginName: string = "";
  /**
   * 位置
   */
  abstract placement: UIPluginPlacement;
  /**
   * 初始化方法
   * @returns
   */
  init?(): Promise<void> | void;

  /**
   * 内容
   */
  abstract component(props: Record<string, unknown>): ReactNode;

  /**
   * 分组序号
   */
  groupIndex: number = 0;
}
export class LogicPlugin extends BasePlugin {
  /**
   * 事件名称
   */
  uniqueName: string = "";
  /**
   * 执行方法
   */
  exec!: (...args: unknown[]) => Promise<unknown> | unknown;
  /**
   * 是否并行
   */
  // isParallel: boolean = false
  /**
   * 模式
   */
  model?: PlatformModelValue = "ALL";
}

export type PluginOptions = {
  allowOverride: boolean;
};

/**
 * 渲染插件
 */
@Widget
export class PluginRender extends Component<{ placement: UIPluginPlacement; props?: Record<string, unknown> }> {
  render(): ReactNode {
    const { placement, props = {} } = this.props;
    const uiPlugins = globalState.plugin.uiPlugins;
    const pluginGroup = globalState.plugin.getUiPluginsByPlacement(placement, uiPlugins!);
    return pluginGroup.map(({ groupCode, plugins }) => {
      const className = `${globalState.environment.$project_name}-${placement}-${groupCode}`;
      return (
        <div className={className} key={className}>
          {plugins.map((plugin) => {
            const key = `${placement}-plugin-${plugin.pluginName}`;
            return cloneElement(plugin.component(props) as ReactElement, { key });
          })}
        </div>
      );
    });
  }
}
