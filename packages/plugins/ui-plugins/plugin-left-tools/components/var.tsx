import { UIPlugin, globalState } from "@soda/designer";

export class VariablePanel extends UIPlugin {
  render() {
    return <div className={`${globalState.environment.$project_name}-variablePanel`}>变量</div>;
  }
}
