import PackageState from "./package";
import PluginState from "./plugin";
import EnvironmentState from "./environment";
import EventState from "./event";
import PageState from "./page";

export const globalState = {
  package: new PackageState(),
  plugin: new PluginState(),
  environment: new EnvironmentState(),
  event: new EventState(),
  page: new PageState(),
};

export type GlobalStateProps = {
  store?: {
    package: PackageState;
    plugin: PluginState;
    environment: EnvironmentState;
    event: EventState;
    page: PageState;
  };
};
