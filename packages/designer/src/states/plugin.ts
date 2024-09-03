import { makeObservable, action } from "mobx";
import { reactive } from "@soda/core";
import { PluginOptions, UIPlugin, UIPluginPlacement } from "../plugin";

type UIPluginType = {
  /**
   * 插件名称
   */
  pluginName?: string;
  name?: string;
  /**
   * 分组序号
   */
  groupIndex?: number;

  /**
   * 优先级
   */
  priority?: number;

  /**
   * 位置
   */
  placement?: UIPluginPlacement;
} & typeof UIPlugin;

export default class PluginState {
  constructor() {
    makeObservable(this);
  }
  /**
   * UI 插件
   */
  @reactive uiPlugins: { [key: string]: (() => UIPluginType)[] } = {};
  /**
   * UI 插件是否已排序
   */
  private uiPluginSorted = false;
  /**
   * 注册插件
   * @param plugin 插件
   * @param options 附加配置
   */
  @action async register(plugin: UIPluginType | UIPluginType[], pluginName: string, options: PluginOptions = { allowOverride: false }) {
    const register = async (plugin: UIPluginType, options: PluginOptions) => {
      plugin.pluginName = pluginName;
      const { placement } = plugin;
      const { allowOverride } = options;
      const { uiPlugins } = this;
      this.uiPluginSorted = false;
      if (!uiPlugins[placement]) {
        uiPlugins[placement] = [];
      }
      const pluginIndex = uiPlugins[placement].findIndex((p) => p().pluginName === plugin.pluginName);
      if (pluginIndex >= 0) {
        if (!allowOverride) {
          throw new Error(`UIPlugin with name ${pluginName} exists`);
        }
        uiPlugins[placement][pluginIndex] = () => plugin;
        return;
      }
      uiPlugins[placement].push(() => plugin);
    };
    if (!Array.isArray(plugin)) {
      register(plugin, options);
    } else {
      for (const i of plugin) {
        register(i, options);
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
        uiPlugins[key].sort((f1, f2) => {
          const { groupIndex: groupIndex1, priority: priority1 } = f1();
          const { groupIndex: groupIndex2, priority: priority2 } = f2();
          if (groupIndex1 !== groupIndex2) {
            return groupIndex1 - groupIndex2;
          }
          return priority1 - priority2;
        });
      }
    }
    const group: { [key: string]: (() => UIPluginType)[] } = {};
    uiPlugins[placement]?.forEach((plugin) => {
      const { groupIndex = 0 } = plugin();
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
