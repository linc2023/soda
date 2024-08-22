
declare module "core" {
	export * from "core/lib/component";
	export * from "core/lib/dev";
	export * from "core/lib/mobx";
	export * from "core/lib/request";
	module "react" {
	    interface CSSProperties {
	        [key: `--${string}`]: string | number;
	    }
	}
}
declare module "core/lib/component" {
	import { CSSProperties, ErrorInfo, Component as ReactComponent, ReactNode, RefObject } from "react";
	import { ComponentMeta, DesignComponent } from "@soda/utils";
	export abstract class Component<P = object> extends ReactComponent<P, any, any> {
	    abstract render(): ReactNode;
	    state: Readonly<P>;
	    /**
	     *  @deprecated
	     */
	    setState(): void;
	    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
	}
	export type ContainerProps = {
	    className?: string;
	    placeholder?: string;
	    style?: CSSProperties;
	    dropDisabled?: boolean;
	    childrenDragDisabled?: boolean;
	    getWhiteList?: (meta: ComponentMeta) => boolean;
	};
	/**
	 * 容器
	 */
	export class Container extends Component<ContainerProps> {
	    /**
	     * 组件列表
	     */
	    children: DesignComponent[];
	    /**
	     * 拖到开始 x 坐标
	     */
	    private dragStartX;
	    /**
	     * 拖到开始 y 坐标
	     */
	    private dragStartY;
	    current: DesignComponent;
	    componentRefMap: {
	        [key: string]: RefObject<any>;
	    };
	    onDrop: (ev: any) => void;
	    onDragOver: (ev: any) => void;
	    initDesignComponent: (node: any) => void;
	    onPointerDown: (ev: any) => void;
	    onPointerUp: (ev: any) => void;
	    onPointerMove: (ev: any) => void;
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
	    constructor(baseUrl?: string, responseHandler?: (res: AxiosResponse) => Promise<object>);
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
	export function createRequest(baseUrl?: string, responseHandler?: (res: AxiosResponse) => Promise<object>): Http;
	export {};
}