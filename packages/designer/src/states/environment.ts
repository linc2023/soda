import { makeObservable, computed, action } from "mobx";
import { reactive } from "@soda/core";
import { DeviceTypeValue, PlatformModeValue, ScenarioValue } from "@soda/utils";

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
  @reactive mode: PlatformModeValue = "DESIGN";
  /**
   * 类名前缀
   */
  @reactive $project_name = "soda";
  /**
   * 是否是设计态
   */
  @computed get designMode() {
    return this.mode === "DESIGN";
  }
  /**
   * 环境初始化
   * @param opts
   */
  @action async init(opts: { device?: DeviceTypeValue; scenario?: ScenarioValue; mode?: PlatformModeValue }) {
    this.device = opts.device ?? "PC";
    this.mode = opts.mode ?? "DESIGN";
    this.scenario = opts.scenario ?? "WEB";
  }
}
