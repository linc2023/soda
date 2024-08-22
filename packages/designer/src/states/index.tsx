import ComponentState from "./component"
import PluginState from "./plugin"
import EnvironmentState from "./environment"
import EventState from './event'

export const globalState = {
    component: new ComponentState(),
    plugin: new PluginState(),
    environment: new EnvironmentState(),
    event: new EventState()
}

export type GlobalStateProps = {
    store?: {
        component: ComponentState;
        plugin: PluginState,
        environment: EnvironmentState,
        event: EventState
    }
}
