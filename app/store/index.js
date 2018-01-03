import {inNonProductionCluster, inLocalDevelopment} from 'Common/Utils';
import * as dev from './configureStore.dev';
import * as prod from './configureStore.prod';
import type {ReduxStore} from 'Common/types';

let store: ReduxStore;

export const configureStore = (rootReducer, initialState) => {
  if (inNonProductionCluster() || inLocalDevelopment()) {
    store = dev.configureStore(rootReducer, initialState);
  } else {
    store = prod.configureStore(rootReducer, initialState);
  }

  return store;
};

export const getStore = () => store;

export const getState = () => {
  if (!store) return;
  return store.getState.apply(this, arguments);
};

export const dispatch = () => {
  if (!store) return;
  return store.dispatch.apply(this, arguments);
};
