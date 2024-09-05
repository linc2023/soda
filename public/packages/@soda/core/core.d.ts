
declare module "core" {
	export * from "core/lib/component";
	export * from "core/lib/dev";
	export * from "core/lib/mobx";
	export * from "core/lib/request";
	export * from "core/lib/renders";
	export * from "core/lib/propertyEditor";
	export * from "core/types";
	module "react" {
	    interface CSSProperties {
	        [key: `--${string}`]: string | number;
	    }
	}
}
declare module "core/lib/component" {
	import { CSSProperties, ErrorInfo, Component as ReactComponent, ReactNode } from "react";
	import { ComponentMeta, PageSchema, PlatformMode, PlatformModeValue } from "@soda/utils";
	export abstract class Component<P = any> extends ReactComponent<P & {
	    children?: ReactNode | ReactNode[];
	}, any, any> {
	    state: Readonly<P>;
	    setState(): void;
	    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
	}
	export class BaseComponent<P = object> extends Component<P & {
	    __mode?: PlatformMode;
	}> {
	    /** @hidden */
	    get __mode(): (P & {
	        __mode?: PlatformMode;
	    } & {
	        children?: ReactNode | ReactNode[];
	    })["__mode"];
	    /** 组件标识 */
	    static __sodaComponent: boolean;
	    /**
	     *  是否锁定
	     *  @hidden
	     */
	    lock: boolean;
	    render(): ReactNode;
	}
	export type ContainerProps = {
	    className?: string;
	    placeholder?: string;
	    style?: CSSProperties;
	    childrenDragDisabled?: boolean;
	    getWhiteList?: (meta: ComponentMeta) => boolean;
	    mode: PlatformModeValue;
	    chooseNode?: (selectedNode: PageSchema) => void;
	};
	/**
	 * 容器
	 */
	export class Container extends BaseComponent<ContainerProps> {
	    /** 容器组件标识 */
	    static __isContainer__: boolean;
	    /**
	     * 是否可设计
	     */
	    get canDesign(): boolean;
	    render(): ReactNode;
	}
}
declare module "core/lib/dev" {
	import { ReactNode } from "react";
	export interface Renderer {
	    render(): ReactNode;
	}
	export class ReactRenderer implements Renderer {
	    render(): ReactNode;
	}
}
declare module "core/lib/mobx" {
	export { makeObservable, action, computed } from "mobx";
	export { observable as reactive } from "mobx";
	export { Provider } from "mobx-react";
	export function Widget(target: any): never;
}
declare module "core/lib/request" {
	import { AxiosRequestConfig, AxiosResponse } from "axios";
	class Http {
	    private baseUrl;
	    private responseHandler;
	    private useProxy;
	    constructor(baseUrl?: string, responseHandler?: (res: AxiosResponse) => Promise<object>, useProxy?: boolean);
	    request<T>(url: string, args: object): Promise<T>;
	    get<T>(url: string, params?: object, config?: AxiosRequestConfig<object>): Promise<T>;
	    delete<T>(url: string, data?: object, config?: AxiosRequestConfig<object>): Promise<T>;
	    post<T>(url: string, data?: object, config?: AxiosRequestConfig<object>): Promise<T>;
	    put<T>(url: string, data?: object, config?: AxiosRequestConfig<object>): Promise<T>;
	    upload(url: string, formData?: object, config?: AxiosRequestConfig<object>): Promise<unknown>;
	}
	/**
	 * 创建 http 请求
	 * @param baseUrl   根路径
	 * @param responseHandler   异常处理
	 * @returns
	 */
	export function createRequest(baseUrl?: string, { responseHandler, useProxy }?: {
	    responseHandler?: (res: AxiosResponse) => Promise<object>;
	    useProxy?: boolean;
	}): Http;
	/**
	 * axios
	 */
	export const axios: import("axios").AxiosStatic;
	export {};
}
declare module "core/lib/renders" {
	import { ElementType, ReactNode } from "react";
	import { Component, Container } from "core/component";
	import { NodeSchema, PageSchema } from "@soda/utils";
	/**
	 * @container
	 */
	export class Page extends Container {
	    render(): JSX.Element;
	}
	type RenderType = {
	    schema: PageSchema;
	    componentMap: {
	        [key: string]: {
	            [key: string]: Component;
	        }[];
	    };
	};
	abstract class Render extends Component<RenderType> {
	    /** refs */
	    refsMap: {
	        [key: string]: any;
	    };
	    /**
	     * 所有 refs
	     */
	    get $refs(): {
	        [key: string]: any;
	    };
	    /**
	     * 查询组件
	     * @param componentName
	     * @param componentMap
	     * @returns
	     */
	    getComponent(componentName: string, componentMap: RenderType["componentMap"]): ElementType;
	    /**
	     * 通过组件 schema 渲染组件
	     * @param schemas
	     * @param componentMap
	     * @returns
	     */
	    schemasToComponent(schemas: NodeSchema[], componentMap?: {
	        [key: string]: {
	            [key: string]: Component<any>;
	        }[];
	    }): ReactNode[];
	    calcProps(props?: {}): {};
	}
	/**
	 * 渲染浏览器组件
	 */
	export class WebRender extends Render {
	    render(): ReactNode;
	    modifyNodeProps(nodeId: string, propKey: string, value: any): void;
	}
	export {};
}
declare module "core/lib/propertyEditor" {
	import { Component } from "core/component";
	export interface TypeEditorProps {
	    value: any;
	    onChange: (val: any) => void;
	}
	export abstract class TypeEditor extends Component<TypeEditorProps> {
	}
}
declare module "core/types" {
	export type Reserved<T> = T & {
	    __brand__?: never;
	};
	/**
	 *  密码
	 * @editor PasswordTypeEditor
	 */
	export type Password = Reserved<string>;
	/**
	 *  颜色
	 * @editor ColorTypeEditor
	 */
	export type Color = Reserved<string>;
	/**
	 * 多行文本
	 * @editor TextTypeEditor
	 */
	export type MultiLineText = string;
	/**
	 * 图片
	 * @editor FileTypeEditor
	 */
	export type Image = string;
	/**
	 * 文件
	 * @editor FileTypeEditor
	 */
	export type File = string;
	/**
	 * 合集
	 */
	export type Mixin<Types extends any[]> = Types[number];
	/**
	 * 下拉框
	 * @editor SelectTypeEditor
	 */
	export type OneOf<T extends {
	    label: string;
	    value: string | number | boolean;
	}[]> = T extends {
	    value: infer U;
	}[] ? U : never;
	export type A<T> = Reserved<T & string>;
}