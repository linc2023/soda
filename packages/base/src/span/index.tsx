import { Widget, Component } from "@soda/core";
import "./span.scss";

/**
 * 表示一个按钮
 * @label 按钮
 * @icon ./span.svg
 * @order 12
 */
@Widget
export class Span extends Component {
  /**
   * @label 属性/字符串1
   */
  str = "初始值";

  /**
   * @label 设置按钮内容
   * @param str 文本
   */
  setText(str: string) {
    this.str = str;
  }
  /**
   * @label 获取按钮内容
   * @returns 文本
   */
  getText = () => {
    return this.str;
  };

  render() {
    return <div className="button"></div>;
  }
}
