import { UIPlugin, globalState } from "@soda/designer";

export class LogicPanel extends UIPlugin {
  render() {
    return <div className={`${globalState.environment.$project_name}-logicPanel`}>逻辑编排</div>;
  }
}
