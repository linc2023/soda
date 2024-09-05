
declare module "base" {
	export * from "base/mixin";
	export * from "base/event";
	export * from "base/button/button";
	export * from "base/button/a";
	export * from "base/span";
}
declare module "base/mixin" {
	import { BaseComponent, Mixin } from "@soda/core";
	/**
	 * 表示一个mixin测试
	 * @label 多 setter 测试
	 */
	export class MixinTest extends BaseComponent {
	    /**
	     * @label 属性/A
	     */
	    a: Mixin<[string, number, boolean]>;
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
	type Handler<T> = (data: number, b: T) => T;
	/**
	 * 表示一个事件测试
	 * @label 事件、方法测试
	 */
	export class EventTest extends BaseComponent {
	    /**
	     * @label 交互/单击
	     */
	    onClick: () => void;
	    /**
	     * @label 交互/搜索
	     */
	    onSearch: Handler<string>;
	    /**
	     * @label 获取文本
	     * @param res
	     */
	    getText(res: Params): Params;
	    /**
	     * @label 设置文本
	     * @param error 属性
	     */
	    setText: (error?: {
	        message: string;
	    }) => void;
	    render(): JSX.Element;
	}
	export {};
}
declare module "base/button/button" {
	import { BaseComponent, Color, MultiLineText, OneOf, Password, Image } from "@soda/core";
	/**
	 * 表示一个按钮
	 * @label TODO：所有类型测试
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
	     * @label 交互/单击
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
	class B extends BaseComponent {
	    /**
	     * @label 属性/字符串1
	     */
	    str: string;
	    test(str: string): void;
	    render(): JSX.Element;
	}
	/**
	 * 表示一个A
	 * @label 继承测试
	 * @icon ./button.svg
	 * @hidden false
	 */
	export class A extends B {
	    /**
	     * @label 属性/字符串
	     */
	    str: string;
	    /**
	     *  @label 样式/str2
	     */
	    str2: string;
	    test(str: string): void;
	    render(): JSX.Element;
	}
	export {};
}
declare module "base/span" {
	import { BaseComponent } from "@soda/core";
	/**
	 * 表示一个文本组件
	 * @label 选中组件测试
	 * @icon ./span.svg
	 * @order 12
	 */
	export class Span extends BaseComponent {
	    /**
	     * @label 属性/字符串
	     */
	    num: number;
	    /**
	     * @label 样式/字符串
	     */
	    num2: number;
	    render(): JSX.Element;
	}
}