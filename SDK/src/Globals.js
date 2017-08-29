let quiqOptions, chatWindow, usingDefaultLaunchButton;
import type {QuiqObject} from 'types';

// Getters and setters
export const getQuiqOptions = (): QuiqObject => quiqOptions;
export const setQuiqOptions = (newQuiqOptions: QuiqObject) => {
  quiqOptions = newQuiqOptions;
};

export const getChatWindow = () => chatWindow;
export const setChatWindow = newChatWindow => {
  chatWindow = newChatWindow;
};

export const getUsingDefaultLaunchButton = (): boolean => usingDefaultLaunchButton;
export const setUsingDefaultLaunchButton = (using: boolean) => {
  usingDefaultLaunchButton = using;
};
