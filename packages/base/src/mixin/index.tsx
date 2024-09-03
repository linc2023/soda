import { BaseComponent, Mixin, reactive } from "@soda/core";

/**
 * 表示一个mixin测试
 * @label mixin测试
 */
export class MixinTest extends BaseComponent {
  /**
   * @label 属性/A
   */
  @reactive a: Mixin<[string, number, boolean]> = 9998;

  render() {
    return <div>mixin测试</div>;
  }
}
