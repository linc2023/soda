import { BaseComponent, Widget, reactive } from "@soda/core";

/**
 * 表示一个A
 * @label A
 * @icon ./button.svg
 * @hidden false
 */
@Widget
export class A extends BaseComponent {
  /**
   * @label 字符串
   */
  @reactive str = "初始值";

  test(str: string) {
    this.str = str;
  }
  render() {
    console.log(this.props);
    return <span>{this.str}</span>;
  }
}
