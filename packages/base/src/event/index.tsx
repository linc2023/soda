import { BaseComponent } from "@soda/core";

type User = { name: string; age: string };
type Params = { total: number; list: User[] };
type Handler<T> = (data: number, b: T) => T;

/**
 * 表示一个事件测试
 * @label 事件、方法测试
 */
export class EventTest extends BaseComponent {
  /**
   * @label 交互/单击
   */
  onClick: () => void;
  /**
   * @label 交互/搜索
   */
  onSearch: Handler<string>;
  /**
   * @label 获取文本
   * @param res
   */
  getText(res: Params) {
    console.log(res);
    return "";
  }
  /**
   * @label 设置文本
   * @param error 属性
   */
  setText = (error = { message: "服务端异常" }) => {
    console.log(error);
  };

  render() {
    return <div>事件、方法测试</div>;
  }
}
