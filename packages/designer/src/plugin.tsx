import { Component, Widget } from "@soda/core";
import { globalState } from "./states";
import { ReactNode } from "react";
import { PlatformModeValue } from "@soda/utils";

export class Event {
  /**
   * 发射事件
   * @param eventName
   * @param plugin
   * @param options
   */
  static $on?(eventName: string | string[], plugin: LogicPlugin | ((...args: unknown[]) => Promise<unknown> | unknown), options: PluginOptions = { allowOverride: true }) {
    globalState.event.on(eventName, plugin, options);
  }
  /**
   * 监听事件
   * @param eventName
   * @param props
   */
  static $emit?(eventName: string | string[], ...props: unknown[]) {
    globalState.event.emit(eventName, ...props);
  }
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
export class UIPlugin extends Component {
  render(): ReactNode {
    throw new Error("Method not implemented.");
  }
  /**
   * 插件名称
   */
  pluginName: string = "";
  /**
   * 位置
   */
  placement?: UIPluginPlacement;
  /**
   * 分组序号
   */
  groupIndex: number = 0;

  /**
   * 优先级
   */
  priority?: number = 0;

  /**
   * 发射事件
   * @param eventName
   * @param plugin
   * @param options
   */
  $on?(eventName: string | string[], plugin: LogicPlugin | ((...args: unknown[]) => Promise<unknown> | unknown), options: PluginOptions = { allowOverride: true }) {
    Event.$on(eventName, plugin, options);
  }
  /**
   * 监听事件
   * @param eventName
   * @param props
   */
  $emit?(eventName: string | string[], ...props: unknown[]) {
    Event.$emit(eventName, ...props);
  }
}
export class LogicPlugin {
  /**
   * 销毁回调
   * @returns
   */
  destroy?: () => void | Promise<void>;
  /**
   * 优先级
   */
  priority?: number = 0;
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
  mode?: PlatformModeValue = "ALL";
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
      return (
        <div key={groupCode} style={{ width: "100%", height: "100%" }}>
          {plugins.map((fn: () => any) => {
            const Plugin = fn();
            const key = `${placement}-plugin-${Plugin.pluginName}`;
            return <Plugin {...props} key={key} />;
          })}
        </div>
      );
    });
  }
}
