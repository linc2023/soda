
declare module "base" {
	export * from "base/button/button";
	export * from "base/button/a";
	export * from "base/span";
	export const a = 1;
	export function add(num1: number, num2: number): number;
}
declare module "base/button/button" {
	import { Component } from "@soda/core";
	/**
	 * 表示一个按钮
	 * @label 按钮
	 * @icon ./button.svg
	 * @order 12
	 */
	export class Button extends Component {
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
	import { Component } from "@soda/core";
	/**
	 * 表示一个按钮
	 * @label 按钮
	 * @icon ./button.svg
	 * @hidden false
	 */
	export class A extends Component {
	    /**
	     * @label 字符串
	     */
	    str1: string;
	    render(): number;
	}
}
declare module "base/span" {
	import { Component } from "@soda/core";
	/**
	 * 表示一个按钮
	 * @label 按钮
	 * @icon ./span.svg
	 * @order 12
	 */
	export class Span extends Component {
	    /**
	     * @label 属性/字符串1
	     */
	    str: string;
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