import { Widget, BaseComponent } from "@soda/core";

type User = { name: string; age: string };
type Params = { total: number; list: User[] };
type Handler = (data: number) => void;

/**
 * 表示一个事件测试
 * @label 事件测试
 */
@Widget
export class EventTest extends BaseComponent {
  /**
   * @label 只有声明
   */
  onClick: () => void;
  /**
   * @label 类型声明
   */
  onSearch: Handler;
  /**
   * @label 默认事件
   * @param res
   */
  onSuccess(res: Params) {
    console.log(res);
  }
  /**
   * 属性声明
   * @param error
   */
  onError = (error = { message: "服务端异常" }) => {
    console.log(error);
  };

  render() {
    return <div>事件测试</div>;
  }
}
