import {createStore} from 'redux';
import {MonitorTools} from 'Debugger/DevTools';

/* eslint-disable */
export const configureStore = (rootReducer, initialState) =>
  createStore(
    rootReducer,
    initialState,
    window.devToolsExtension ? window.devToolsExtension() : MonitorTools.instrument({maxAge: 50}),
  );
