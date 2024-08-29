import { LogicPlugin, PluginOptions } from "../plugin";

export default class EventState {
  logicPluginMap: { [key: string]: LogicPlugin[] } = {};

  /**
   * 事件监听
   * @param eventName 事件名称
   * @param plugin 插件
   * @param options 额外信息
   */
  on(eventName: string | string[], plugin: LogicPlugin | ((...args: unknown[]) => Promise<unknown> | unknown), options: PluginOptions = { allowOverride: false }) {
    const register = (event: string, plugin: LogicPlugin) => {
      if (typeof plugin === "function") {
        const tmp = new LogicPlugin();
        tmp.exec = plugin;
        tmp.uniqueName = eventName as string;
        plugin = tmp;
      }
      const { logicPluginMap } = this;
      if (!logicPluginMap[event]) {
        logicPluginMap[event] = [];
      }
      const uniqueName = plugin.uniqueName ?? eventName;
      const pluginIndex = logicPluginMap[event].findIndex((i) => {
        if (uniqueName?.length > 0) {
          return i.uniqueName === uniqueName || i.exec === plugin.exec;
        }
        return i.exec === plugin.exec;
      });
      if (pluginIndex >= 0) {
        if (!options.allowOverride) {
          console.warn(`LogicPlugin with name ${uniqueName} exist`);
        }
        logicPluginMap[event][pluginIndex] = plugin;
        return;
      }
      logicPluginMap[event].push(plugin);
      logicPluginMap[event].sort((i1, i2) => i1.priority - i2.priority);
    };
    if (Array.isArray(eventName)) {
      eventName.forEach((i) => {
        register(i, plugin);
      });
    } else {
      register(eventName, plugin);
    }
  }
  /**
   * 注销事件
   * @param eventName
   * @param plugin
   */
  async off(eventName: string, plugin: LogicPlugin) {
    const { logicPluginMap } = this;
    const pluginIndex = logicPluginMap[eventName].findIndex((i) => i === plugin);
    if (pluginIndex >= 0) {
      const plugin = logicPluginMap[eventName][pluginIndex];
      await plugin.destroy?.();
      logicPluginMap[eventName].splice(pluginIndex, 1);
    }
  }
  /**
   * 发射事件
   * @param eventName
   * @param props
   * @returns
   */
  async emit(eventName: string | string[], ...props: unknown[]) {
    if (!eventName || eventName.length === 0) {
      return;
    }
    const exec = async (event: string) => {
      for (const plugin of this.logicPluginMap[event] ?? []) {
        await plugin.exec(...(props ?? []));
      }
    };
    if (Array.isArray(eventName)) {
      for (const event of eventName) {
        await exec(event);
      }
    } else {
      await exec(eventName);
    }
  }
}
