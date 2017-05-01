import {defineMessages} from 'react-intl';

export default defineMessages({
  send: {
    id: 'send',
    description: 'Generic send message',
    defaultMessage: 'Send',
  },
  sendUsAMessage: {
    id: 'sendUsAMessage',
    description: 'Generic Send us a message',
    defaultMessage: 'Send us a message...',
  },
  reconnecting: {
    id: 'reconnecting',
    description: 'Reconnecting to websocket',
    defaultMessage: 'Reconnecting...',
  },
  connecting: {
    id: 'connecting',
    description: 'Connecting to websocket',
    defaultMessage: 'Connecting...',
  },
  errorState: {
    id: 'errorState',
    description: 'Generic Error Message',
    defaultMessage: "We're having trouble connecting. Try refreshing the page.",
  },
  agentIsTyping: {
    id: 'agentIsTyping',
    description: 'Message to display when the agent is typing',
    defaultMessage: 'Agent is typing',
  },
});
