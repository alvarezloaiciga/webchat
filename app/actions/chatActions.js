import {actionTypes} from 'Common/Constants';
import type {ChatInitializedStateType, Message, ChatMetadata} from 'types';

export const setChatContainerHidden = (chatContainerHidden: boolean) => ({
  type: 'CHAT_CONTAINER_HIDDEN',
  chatContainerHidden,
});

export const setChatLauncherHidden = (chatLauncherHidden: boolean) => ({
  type: 'CHAT_LAUNCHER_HIDDEN',
  chatLauncherHidden,
});

export const setAgentsAvailable = (agentsAvailable: boolean) => ({
  type: 'AGENTS_AVAILABLE',
  agentsAvailable,
});

export const setIsAgentAssigned = (isAgentAssigned: boolean) => ({
  type: 'AGENT_ASSIGNED',
  isAgentAssigned,
});

export const setChatInitialized = (initializedState: ChatInitializedStateType) => ({
  type: 'CHAT_INITIALIZED_STATE',
  initializedState,
});

export const setAgentTyping = (agentTyping: boolean) => ({
  type: 'AGENT_TYPING',
  agentTyping,
});

export const setMuteSounds = (muteSounds: boolean) => ({
  type: 'MUTE_SOUNDS',
  muteSounds,
});

export const setMessageFieldFocused = (messageFieldFocused: boolean) => ({
  type: 'MESSAGE_FIELD_FOCUSED',
  messageFieldFocused,
});

export const setChatConfiguration = (metadata: ChatMetadata) => ({
  type: 'CHAT_CONFIGURATION_LOADED',
  configuration: {
    enableChatEmailTranscript:
      metadata.configs.CHAT_EMAIL_TRANSCRIPT && metadata.configs.CHAT_EMAIL_TRANSCRIPT.enabled,
    enableChatFileAttachments:
      metadata.configs.CHAT_FILE_ATTACHMENTS && metadata.configs.CHAT_FILE_ATTACHMENTS.enabled,
    supportedAttachmentTypes:
      metadata.configs.ALLOWED_CONTENT_TYPES && metadata.configs.ALLOWED_CONTENT_TYPES.contentTypes,
    enableEmojis: metadata.configs.ENABLE_EMOJIS && metadata.configs.ENABLE_EMOJIS.enabled,
    playSoundOnNewMessage:
      metadata.configs.PLAY_SOUND_ON_NEW_MESSAGE &&
      metadata.configs.PLAY_SOUND_ON_NEW_MESSAGE.enabled,
    flashNotificationOnNewMessage:
      metadata.configs.FLASH_NOTIFICATION_ON_NEW_MESSAGE &&
      metadata.configs.FLASH_NOTIFICATION_ON_NEW_MESSAGE.enabled,
    registrationForm: metadata.registrationForm,
  },
});

export const updatePlatformEvents = (events: Array<Event>) => ({
  type: 'UPDATE_PLATFORM_EVENTS',
  events,
});

export const updateTranscript = (transcript: Array<Message>) => ({
  type: 'UPDATE_TRANSCRIPT',
  transcript,
});

export const removeMessage = (id: string) => ({
  type: actionTypes.removeMessage,
  id,
});

export const setWelcomeFormRegistered = () => ({
  type: 'WELCOME_FORM_REGISTERED',
});

export const newWebchatSession = () => ({
  type: 'NEW_WEBCHAT_SESSION',
});

export const setUploadProgress = (messageId: string, progress: number) => ({
  type: actionTypes.uploadProgress,
  messageId,
  progress,
});

export const addPendingAttachmentMessage = (
  tempId: string,
  contentType: string,
  url: string,
  fromCustomer: boolean,
) => {
  return {
    type: actionTypes.addPendingMessage,
    message: {
      id: tempId,
      localKey: tempId,
      type: 'Attachment',
      timestamp: Date.now(),
      authorType: fromCustomer ? 'Customer' : 'User',
      status: 'pending',
      contentType,
      url,
    },
  };
};

export const updatePendingAttachmentId = (tempId: string, newId: string) => ({
  type: actionTypes.updatePendingMessageId,
  tempId,
  newId,
});

export const setInputtingEmail = (inputtingEmail: boolean) => ({
  type: 'SET_INPUTTING_EMAIL',
  inputtingEmail,
});
