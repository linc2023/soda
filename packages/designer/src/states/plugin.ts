import { makeObservable, action } from "mobx";
import { reactive } from "@soda/core";
import { PluginOptions, UIPlugin, UIPluginPlacement } from "../plugin";

export default class PluginState {
  constructor() {
    makeObservable(this);
  }
  /**
   * UI 插件
   */
  @reactive uiPlugins: { [key: string]: UIPlugin[] } = {};
  /**
   * UI 插件是否已排序
   */
  private uiPluginSorted = false;
  /**
   * 注册插件
   * @param plugin 插件
   * @param options 附加配置
   */
  @action async register(plugin: UIPlugin | UIPlugin[], options: PluginOptions = { allowOverride: false }) {
    const register = async (plugin: UIPlugin, options: PluginOptions) => {
      if (!plugin.pluginName) {
        plugin.pluginName = plugin.constructor.name;
      }
      const { pluginName, placement } = plugin;
      const { allowOverride } = options;
      const { uiPlugins } = this;
      this.uiPluginSorted = false;
      if (!uiPlugins[placement]) {
        uiPlugins[placement] = [];
      }
      const pluginIndex = uiPlugins[placement].findIndex((p) => p.pluginName === plugin.pluginName);
      if (pluginIndex >= 0) {
        if (!allowOverride) {
          throw new Error(`UIPlugin with name ${pluginName} exists`);
        }
        const oldPlugin = uiPlugins[placement][pluginIndex];
        uiPlugins[placement][pluginIndex] = plugin as UIPlugin;
        await oldPlugin.destroy?.();
        return;
      }
      uiPlugins[placement].push(plugin);
    };
    if (!Array.isArray(plugin)) {
      await register(plugin, options);
    } else {
      for (const i of plugin) {
        await register(i, options);
      }
    }
  }
  /**
   * 获取某个位置的插件
   * @param placement
   * @param uiPlugins
   * @returns
   */
  @action getUiPluginsByPlacement(placement: UIPluginPlacement, uiPlugins: typeof this.uiPlugins) {
    if (!this.uiPluginSorted) {
      for (const key in uiPlugins) {
        uiPlugins[key].sort(({ groupIndex: groupIndex1, priority: priority1 }, { groupIndex: groupIndex2, priority: priority2 }) => {
          if (groupIndex1 !== groupIndex2) {
            return groupIndex1 - groupIndex2;
          }
          return priority1 - priority2;
        });
      }
    }
    const group: { [key: string]: UIPlugin[] } = {};
    uiPlugins[placement]?.forEach((plugin) => {
      const { groupIndex = 0 } = plugin;
      if (!group[groupIndex]) {
        group[groupIndex] = [];
      }
      group[groupIndex].push(plugin);
    });
    return Object.keys(group)
      .sort((s1, s2) => Number(s1) - Number(s2))
      .map((key) => ({
        groupCode: "group-" + key,
        plugins: group[key],
      }));
  }
}
