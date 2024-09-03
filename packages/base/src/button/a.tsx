import { BaseComponent, reactive } from "@soda/core";

class B extends BaseComponent {
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

/**
 * 表示一个A
 * @label 继承测试
 * @icon ./button.svg
 * @hidden false
 */
export class A extends B {
  /**
   * @label 字符串
   */
  override str = "初始值";
  /**
   *  @label 样式/str2
   */
  @reactive str2 = "xx";

  test(str: string) {
    this.str = str;
  }
  render() {
    console.log(this.props, 111);
    return <span>继承测试：{this.str + "___" + this.str2}</span>;
  }
}
