import { Component, Container } from "@soda/core";
import { ComponentType } from "react";

/**
 * 组件元数据
 */
export interface ComponentMeta {
  /** 组件名 */
  componentName: string;
  /** 组件展示名称 */
  displayName: string;
  /** 组件描述 */
  description?: string;
  /** 图标 */
  icon?: string;
  /** 分组 */
  group?: string;
  /** 组件优先级 */
  order?: number;
  /** 包名 */
  packageName: string;
  /** 包版本 */
  packageVersion: string;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 是否是容器 */
  isContainer: boolean;
}

/**
 * 节点信息
 */
export interface NodeSchema {
  componentName: string;
  id: string;
  props?: any;
  children?: NodeSchema[];
  advanced?: {
    loop?: string;
    isContainer?: boolean;
  };
}
/**
 * 页面 Schema
 */
export interface PageSchema {
  components: {
    package: string;
    version: string;
    componentName: string;
  }[];
  componentsTree: NodeSchema[];
}

export class DesignNode {
  /** 唯一标识 */
  id?: string;
  /** dom */
  element?: HTMLElement;
  /** 子组件 */
  children?: DesignNode[];
  /** 实例 */
  type?: Component | Container;
  /** 组件名称 */
  componentName?: string;
  /** 打包对象名 */
  libary?: string;
  /** 属性信息 */
  props?: PropDescriptor[];
}

export type ComponentSnippet = {
  /** 组件名 */
  componentName: string;
  /** 父节点 */
  parents?: ComponentSnippet[];
  /** dom */
  element?: HTMLElement;
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
/** 设备类型取值 */
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
/** 场景取值 */
export type ScenarioValue = keyof typeof Scenario;
/**
 * npm 贡献者信息
 */
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

/**
 * 模式
 */
export enum PlatformMode {
  DESIGN = "DESIGN",
  PRODUCTION = "PRODUCTION",
  PREVIEW = "PREVIEW",
  ALL = "ALL",
}
/**
 * 模式取值
 */
export type PlatformModeValue = keyof typeof PlatformMode;

/**
 * 属性编辑器信息
 */
export type EditorDescriptor = {
  /** 子属性 */
  children?: PropDescriptor[];
  /** 类型 */
  type?: EditorType;
};

export enum EditorType {
  Property,
  String,
  Number,
  Boolean,
  Color,
  Array,
  Tuple,
  Function,
  Method,
  Object,
}

/**
 * 属性信息
 */
export type PropDescriptor = {
  /** 是否隐藏 */
  hidden?: string;
  /** 描述 */
  description?: string;
  /** 是否展开分组 */
  expanded?: boolean;
  /** 默认属性编辑器 */
  defaultEditorType: EditorType;
  /** 组件信息 */
  editorsProps?: EditorDescriptor[];
  /** 子节点 */
  children: PropDescriptor[];

  /** 是否禁用 */
  disabled?: boolean;

  /** 默认值 */
  defaultValue?: any;

  /** 所在分区 */
  tab: string;
  /** 所在分组 */
  group: string;
  /** 中文名称 */
  label: string;
  /** 属性名称 */
  name: string;
  // // 展示类型
  // display: 'block' | 'popup' | 'entry';
  // 组件
  component: ComponentType;

  /** 序号 */
  order?: number;
};
