import { Component, Widget, reactive } from "@soda/core";

/**
 * 表示一个A
 * @label A
 * @icon ./button.svg
 * @hidden false
 */
@Widget
export class A extends Component {
  /**
   * @label 字符串
   */
  @reactive str = "初始值";

  test(str: string) {
    this.str = str;
  }
  render() {
    return <span>{this.str}</span>;
  }
}
