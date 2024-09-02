import { BaseComponent, reactive } from "@soda/core";

/**
 * 表示一个A
 * @label A
 * @icon ./button.svg
 * @hidden false
 */
export class B extends BaseComponent {
  /**
   * @label 字符串1
   */
  @reactive str = "初始值";

  test(str: string) {
    this.str = str;
  }
  render() {
    return <span>{this.str}</span>;
  }
}

export class A extends B {
  /**
   * @label 字符串
   */
  override str = "初始值";
  /**
   *  @label str2
   */
  @reactive str2 = "xx";

  test(str: string) {
    this.str = str;
  }
  render() {
    console.log(this.props, 111);
    return <span>{this.str + "___" + this.str2}</span>;
  }
}
