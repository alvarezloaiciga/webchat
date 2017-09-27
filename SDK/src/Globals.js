// @flow

let quiqOptions, chatWindow;
import type {QuiqObject} from 'types';

// Getters and setters
export const getQuiqOptions = (): QuiqObject => quiqOptions;
export const setQuiqOptions = (newQuiqOptions: QuiqObject) => {
  quiqOptions = newQuiqOptions;
};

export const getChatWindow = (): Object => chatWindow;
export const setChatWindow = (newChatWindow: Object) => {
  chatWindow = newChatWindow;
};
