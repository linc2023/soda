import { Widget, reactive, Component } from "@soda/core";
import "./span.scss";
import { ReactNode } from "react";

class A extends Component {
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
 * @label 文本
 * @icon ./span.svg
 * @order 12
 */
@Widget
export class Span extends Component {
  /**
   * @label 属性/字符串
   */
  @reactive num = 1;

  render() {
    console.log(this.props);
    return (
      <div>
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
