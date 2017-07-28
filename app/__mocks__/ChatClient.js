export const registerChatClient = jest.fn();
export const getChatClient = jest.fn().mockReturnValue({
  onNewMessages: jest.fn().mockReturnThis(),
  onRegistration: jest.fn().mockReturnThis(),
  onAgentTyping: jest.fn().mockReturnThis(),
  onError: jest.fn().mockReturnThis(),
  onErrorResolved: jest.fn().mockReturnThis(),
  onConnectionStatusChange: jest.fn().mockReturnThis(),
  onNewSession: jest.fn().mockReturnThis(),
  onBurn: jest.fn().mockReturnThis(),
  start: jest.fn(),
  stop: jest.fn(),
  getMessages: jest.fn(),
  joinChat: jest.fn(),
  leaveChat: jest.fn(),
  sendMessage: jest.fn(),
  updateMessagePreview: jest.fn(),
  sendRegistration: jest.fn(),
  checkForAgents: jest.fn(),
  hasTakenMeaningfulAction: jest.fn(),
  getLastUserEvent: jest.fn(),
  isRegistered: jest.fn().mockReturnValue(false),
  isChatVisible: jest.fn(),
});
