
declare module "base" {
	export * from "base/button/button";
	export * from "base/button/a";
	export * from "base/span";
	export const a = 1;
	export * from "base/event";
	export function add(num1: number, num2: number): number;
}
declare module "base/button/button" {
	import { BaseComponent } from "@soda/core";
	/**
	 * 表示一个按钮
	 * @label 按钮
	 * @icon ./button.svg
	 * @order 12
	 */
	export class Button extends BaseComponent {
	    /**
	     * @label 属性/字符串1
	     */
	    str1: string;
	    /**
	     * @label 属性/字符串2
	     */
	    str2: string;
	    /**
	     * @label 属性/数字
	     */
	    num: number;
	    /**
	     * @label 属性/对象
	     */
	    obj: Omit<{
	        x: 12;
	        y: string;
	        xy: {
	            x: number;
	            y: string;
	        };
	    }, "x">;
	    /**
	     * @label 属性/密码框
	     */
	    password: Password;
	    /**
	     * @label 属性/布尔
	     */
	    bool: boolean;
	    /**
	     * @label 属性/文本框
	     */
	    multiLine: MultiLineText;
	    /**
	     * @label 样式/颜色
	     */
	    color: Color;
	    /**
	     * @label 属性/文件
	     */
	    url: Image;
	    /**
	     * @label 属性/下拉框
	     */
	    select: OneOf<[{
	        label: "xxx";
	        value: "x3x";
	    }]>;
	    /**
	     * @label 属性/枚举
	     */
	    radio: "large" | "medium" | "small";
	    /**
	     * @label 属性/元组
	     */
	    tuple: [string, number];
	    /**
	     * @label 属性/标签元组
	     */
	    tupleWithLabel: [元素1: string, 元素2: number];
	    /**
	     * @label 属性/数组
	     */
	    arr: string[];
	    /**
	     * @label 属性/editor
	     * @editor StringEditor
	     */
	    editor: string;
	    /**
	     * @label 单击
	     */
	    onClick: () => void;
	    /**
	     * @label 设置按钮内容
	     * @param str 文本
	     */
	    setText(str: string): void;
	    /**
	     * @label 获取按钮内容
	     * @returns 文本
	     */
	    getText: () => string;
	    render(): JSX.Element;
	}
}
declare module "base/button/a" {
	import { BaseComponent } from "@soda/core";
	/**
	 * 表示一个A
	 * @label A
	 * @icon ./button.svg
	 * @hidden false
	 */
	export class A extends BaseComponent {
	    /**
	     * @label 字符串
	     */
	    str: string;
	    test(str: string): void;
	    render(): JSX.Element;
	}
}
declare module "base/span" {
	import { BaseComponent } from "@soda/core";
	/**
	 * 表示一个文本组件
	 * @label 文本
	 * @icon ./span.svg
	 * @order 12
	 */
	export class Span extends BaseComponent {
	    /**
	     * @label 属性/字符串
	     */
	    num: number;
	    render(): JSX.Element;
	}
}
declare module "base/event" {
	import { BaseComponent } from "@soda/core";
	type User = {
	    name: string;
	    age: string;
	};
	type Params = {
	    total: number;
	    list: User[];
	};
	type Handler = (data: number) => void;
	/**
	 * 表示一个事件测试
	 * @label 事件测试
	 */
	export class EventTest extends BaseComponent {
	    /**
	     * @label 只有声明
	     */
	    onClick: () => void;
	    /**
	     * @label 类型声明
	     */
	    onSearch: Handler;
	    /**
	     * @label 默认事件
	     * @param res
	     */
	    onSuccess(res: Params): void;
	    /**
	     * 属性声明
	     * @param error
	     */
	    onError: (error?: {
	        message: string;
	    }) => void;
	    render(): JSX.Element;
	}
	export {};
}