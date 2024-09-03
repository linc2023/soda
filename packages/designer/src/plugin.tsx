import { Component } from "@soda/core";
import { globalState } from "./states";
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

export function pluginRunder(placement: UIPluginPlacement, props: Record<string, unknown> = {}): any[] {
  const uiPlugins = globalState.plugin.uiPlugins;
  const pluginGroup = globalState.plugin.getUiPluginsByPlacement(placement, uiPlugins!);
  return pluginGroup.map(({ plugins }) => {
    return plugins.map((fn: any, index) => {
      const Plugin = fn();
      const key = `${placement}-plugin-${Plugin.pluginName}-${index}`;
      return <Plugin {...props} key={key} />;
    });
  });
}
