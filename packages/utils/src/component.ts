import { ComponentType } from "react";
/**
 * 组件元数据
 */
export class ComponentMeta {
  // 组件名
  componentName: string;
  // 组件展示名称
  label: string;
  // 组件描述
  description?: string;
  // 图标
  icon?: string;
  // 分组
  group?: string;
  // 组件优先级
  order?: number = 0;
  // 包名
  packageName: string;
  // 包版本
  packageVersion: string;
  // 是否隐藏
  hidden?: boolean;
}

export class DesignComponent extends ComponentMeta {
  // 唯一标识
  id?: string;
  // dom
  element?: HTMLElement;
  // 子组件
  children?: DesignComponent[];
  // 属性
  // properties?:
}

// 属性编辑器
export type EditorMeta = {
  // 所在分区
  block: string;
  // 所在分组
  group: string;
  // 中文名称
  label: string;
  // // 展示类型
  // display: 'block' | 'popup' | 'entry';
  // 组件
  component: ComponentType;
  // 是否隐藏
  condition?: (values: unknown) => boolean;
  // 默认值
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: unknown;
  // 序号
  order?: number;
  // 属性名称
  propName: string;
  // onChange 事件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // onChange?: (value: any, field: any) => void;
};

/**
 * 设备类型
 */
export enum DeviceType {
  PC = "PC",
  MOBILE = "MOBILE",
  TABLET = "TABLET",
  ALL = "ALL",
}

export type DeviceTypeValue = keyof typeof DeviceType;
/**
 * 场景
 */
export enum Scenario {
  WEB = "WEB",
  NATIVE = "NATIVE",
  MICRO_APP = "MICRO_APP",
  PWA = "PWA",
  ALL = "ALL",
}

export type ScenarioValue = keyof typeof Scenario;

type NPMContributor = {
  email?: string;
  name?: string;
  url?: string;
};

export interface PackageCoreInfo {
  /** 包名 */
  name: string;
  /** 展示名 */
  displayName: string;
  /** 组件库描述 */
  description?: string;
  /** 版本号 */
  version: string;
  /**挂载到 window 下的名称*/
  library: string;
  /** 设备类型 */
  device: DeviceTypeValue;
  /** 使用场景 */
  scenario: ScenarioValue;
  /** 文档中心 */
  homepage?: string;
  /** 仓库地址 */
  repository?: string;
}

/** package.json 对象 */
export interface Package extends PackageCoreInfo {
  /** 主文件 */
  main: string;
  /** 类型主文件 */
  types: string;
  /** 外部依赖的组件库 */
  peerDependencies: { [name: string]: string };
  /** 开发依赖 */
  devDependencies?: { [name: string]: string };
  /** 搜索关键字 */
  keywords?: string[];
  /** 作者信息 */
  author: string | NPMContributor;
  /** 协议 */
  license: string;
  /** 贡献者 */
  contributors?: NPMContributor[] | string[][];
  /** 打包时需要自动复制的文件 */
  include?: string | string[];
  /** 打包时需要排除的类 */
  excludesClass?: string[];
}

/**
 * 组件分组信息
 */
export interface ComponentGroup extends PackageCoreInfo {
  /** 序号 */
  order: string;
  /** 具体组件信息 */
  components: ComponentMeta[];
}
