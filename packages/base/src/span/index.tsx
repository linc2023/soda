import { reactive, BaseComponent } from "@soda/core";
import "./span.scss";
import { ReactNode } from "react";

class A extends BaseComponent {
  render(): ReactNode {
    return (
      <div>
        <div>sadsddd</div> {this.props.children}
      </div>
    );
  }
}

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
  @reactive num = 1;
  /**
   * @label 样式/字符串
   */
  @reactive num2 = 1;

  render() {
    console.log(this.props);
    return (
      <div>
        组件选中测试
        <button
          className="button"
          onClick={() => {
            this.num++;
          }}
        >
          aaa
        </button>
        <A>
          <span>sssss</span>
        </A>
      </div>
    );
  }
}
