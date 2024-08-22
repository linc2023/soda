import { makeObservable, computed, action } from "mobx";
import { reactive } from "@soda/core";
import { PlatformModelValue } from "../plugin";
import { DeviceTypeValue, ScenarioValue } from "@soda/utils";

export default class EnvironmentState {
  constructor() {
    makeObservable(this);
  }
  /**
   * 设备
   */
  @reactive device: DeviceTypeValue = "PC";
  /**
   * 场景
   */
  @reactive scenario: ScenarioValue = "WEB";
  /**
   * 环境
   */
  @reactive model: PlatformModelValue = "DESIGN";
  /**
   * 类名前缀
   */
  @reactive $project_name = "soda";
  /**
   * 是否是设计态
   */
  @computed get designMode() {
    return this.model === "DESIGN";
  }
  /**
   * 环境初始化
   * @param opts
   */
  @action async init(
    opts: {
      device: DeviceTypeValue;
      scenario: ScenarioValue;
      model: PlatformModelValue;
    } = {
      device: "PC",
      model: "DESIGN",
      scenario: "WEB",
    }
  ) {
    this.device = opts.device;
    this.model = opts.model;
    this.scenario = opts.scenario;
  }
}
