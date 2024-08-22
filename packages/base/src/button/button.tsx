import { Component, reactive, Widget } from "@soda/core";
import "./button.scss";

/**
 * 表示一个按钮
 * @label 按钮
 * @icon ./button.svg
 * @order 12
 */
@Widget
export class Button extends Component {
  /**
   * @label 属性/字符串1
   */
  str1 = "初始值";
  /**
   * @label 属性/字符串2
   */
  str2: string;
  /**
   * @label 属性/数字
   */
  @reactive num: number = 2;
  /**
   * @label 属性/对象
   */
  obj: Omit<{ x: 12; y: string; xy: { x: number; y: string } }, "x">;

  /**
   * @label 属性/密码框
   */
  password: Password;

  /**
   * @label 属性/布尔
   */
  @reactive bool = true;

  /**
   * @label 属性/文本框
   */
  multiLine: MultiLineText;

  /**
   * @label 样式/颜色
   */
  color: Color = "#409eff";

  /**
   * @label 属性/文件
   */
  url: Image = "http://127.0.0.1:8080/img.png";

  /**
   * @label 属性/下拉框
   */
  select: OneOf<[{ label: "xxx"; value: "x3x" }]> = "x3x";

  /**
   * @label 属性/枚举
   */
  radio: "large" | "medium" | "small";

  /**
   * @label 属性/元组
   */
  tuple: [string, number] = ["初始值", 123];

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
  editor = "";

  /**
   * @label 单击
   */
  onClick: () => void;

  /**
   * @label 设置按钮内容
   * @param str 文本
   */
  setText(str: string) {
    this.str1 = str;
  }
  /**
   * @label 获取按钮内容
   * @returns 文本
   */
  getText = () => {
    return this.str1;
  };

  render() {
    return <div className="button"></div>;
  }
}
