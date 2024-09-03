import { UIPlugin, globalState } from "@soda/designer";

export class DataSourcePanel extends UIPlugin {
  render() {
    return <div className={`${globalState.environment.$project_name}-dataSourcePanel`}>数据源</div>;
  }
}
