import {createStore} from 'redux';

/* eslint-disable */
export const configureStore = (rootReducer, initialState) =>
  createStore(
    rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  );
