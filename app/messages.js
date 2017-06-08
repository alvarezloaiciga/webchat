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
  required: {
    id: 'required',
    description: 'Required',
    defaultMessage: 'Required',
  },
  referrer: {
    id: 'referrer',
    description: 'Message to append to welcome form telling agent what web page the customer is on',
    defaultMessage: 'Referrer: {location}',
  },
  cannotFindScript: {
    id: 'cannotFindScript',
    description: "Error to display when we can't find the script that loaded webchat",
    defaultMessage: 'Cannot find script that loaded Webchat. Please contact your administrator.',
  },
  standaloneFatalError: {
    id: 'standaloneFatalError',
    description:
      'Error to display when we load the QUIQ object from query params in standalone mode',
    defaultMessage: 'Error loading standalone mode. Are the query params properly formatted?',
  },
  errorParsingStandaloneObject: {
    id: 'errorParsingStandaloneObject',
    description:
      "Error to display when we found the QUIQ query param but weren't able to parse it into a valid QUIQ object",
    defaultMessage: 'Error while trying to parse the standalone QUIQ query object',
  },
  cannotDetermineHost: {
    id: 'cannotDetermineHost',
    description:
      "Error to display when we can't determine the hostid from the script src attribute",
    defaultMessage: 'Cannot determine host from script url. Please contact your administrator',
  },
  quiqFatalError: {
    id: 'quiqFatalError',
    description: 'Message to show a quiq fatal error',
    defaultMessage: 'QUIQ FATAL ERROR',
  },
  hereToHelp: {
    id: 'hereToHelp',
    description: 'Welcome message to display at top of webchat',
    defaultMessage: "We're here to help if you have any questions!",
  },
  openInNewWindow: {
    id: 'openInNewWindow',
    description: 'Message to display on open in new window icon',
    defaultMessage: 'Open chat in new window',
  },
  welcomeFormUniqueIdentifier: {
    id: 'wecomeFormUniqueIdentifier',
    description:
      'Unique identifier to key off of as identifying a message as the welcome form customer submission.',
    defaultMessage: 'Quiq Welcome Form Customer Submission',
  },
});
