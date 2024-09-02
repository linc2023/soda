
declare module "core" {
	export * from "core/lib/component";
	export * from "core/lib/dev";
	export * from "core/lib/mobx";
	export * from "core/lib/request";
	export * from "core/lib/renders";
	export * from "core/lib/propertyEditor";
	module "react" {
	    interface CSSProperties {
	        [key: `--${string}`]: string | number;
	    }
	}
}
declare module "core/lib/component" {
	import { CSSProperties, ErrorInfo, Component as ReactComponent, ReactNode } from "react";
	import { ComponentMeta, PageSchema, PlatformModeValue } from "@soda/utils";
	export class Component<P = any> extends ReactComponent<P, any, any> {
	    state: Readonly<P>;
	    setState(): void;
	    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
	    render(): ReactNode;
	}
	export class BaseComponent<P = any> extends Component<P> {
	    /** @hidden */
	    get __mode(): any;
	    /** 组件标识 */
	    static __sodaComponent: boolean;
	    a: number;
	    /**
	     * 是否锁定
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
	    components: {
	        [key: string]: {
	            version: string;
	            [key: string]: object | string;
	        }[];
	    };
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
	    }): JSX.Element[];
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