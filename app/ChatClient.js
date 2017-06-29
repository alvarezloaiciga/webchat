// @flow

import QuiqChatClient from 'quiq-chat';

// Singleton chat client

let chatClient;

export const registerChatClient = (c: QuiqChatClient): void => {
  chatClient = c;
};

export const getChatClient = (): QuiqChatClient => {
  return chatClient;
};
