import React from 'react';
import LogMonitor from 'redux-devtools-log-monitor';
import {createDevTools} from 'redux-devtools';
import ReduxExporter from './ReduxExporter';

export const MonitorTools = createDevTools(<LogMonitor />);
export default createDevTools(<ReduxExporter />);
