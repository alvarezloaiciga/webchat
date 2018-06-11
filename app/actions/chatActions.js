import {reduxActionTypes as actionTypes} from 'Common/Constants';
import type {
  ChatInitializedStateType,
  Message,
  ChatMetadata,
  AttachmentError,
  QuiqObject,
} from 'types';
import type {PersistentData, Author} from 'quiq-chat/src/types';

export const setChatContainerHidden = (chatContainerHidden: boolean) => ({
  type: 'CHAT_CONTAINER_HIDDEN',
  chatContainerHidden,
});

export const setChatRegistrationField = (fieldId: string, fieldValue: any) => ({
  type: 'CHAT_REGISTRATION_FIELD_SET',
  fieldId,
  fieldValue,
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

export const setTypingAuthorData = (author: Author | null) => ({
  type: 'UPDATE_TYPING_AUTHOR',
  author,
});

export const setMessageFieldFocused = (messageFieldFocused: boolean) => ({
  type: 'MESSAGE_FIELD_FOCUSED',
  messageFieldFocused,
});

export const updateChatConfigurationFromMetadata = (metadata: ChatMetadata) => ({
  type: 'UPDATE_CHAT_CONFIGURATION',
  configuration: {
    enableChatEmailTranscript:
      metadata.configs.CHAT_EMAIL_TRANSCRIPT && metadata.configs.CHAT_EMAIL_TRANSCRIPT.enabled,
    enableChatFileAttachments:
      metadata.configs.CHAT_FILE_ATTACHMENTS && metadata.configs.CHAT_FILE_ATTACHMENTS.enabled,
    enableManualConvoStart: metadata.configs.CHAT_MANUAL_START_CONVO_MODE,
    enableMobileChat: metadata.configs.CHAT_ALLOW_MOBILE,
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
    registrationFormVersionId: metadata.registrationFormVersionId,
    menuOptions: metadata.configs.CHAT_MENU_OPTIONS,
    whitelistedDomains:
      metadata.configs.CHAT_WHITELISTED_DOMAINS &&
      metadata.configs.CHAT_WHITELISTED_DOMAINS.domains,
  },
});

export const updateChatConfigurationFromQuiqOptions = (quiqOptions: QuiqObject) => ({
  type: 'UPDATE_CHAT_CONFIGURATION',
  configuration: quiqOptions,
});

export const updatePersistentData = (persistentData: PersistentData) => ({
  type: 'CHAT_UPDATE_PERSISTENT_DATA',
  persistentData,
});

export const updatePlatformEvents = (platformEvents: Array<Event>) => ({
  type: 'UPDATE_PLATFORM_EVENTS',
  platformEvents,
});

export const updateTranscript = (transcript: Array<Message>) => ({
  type: 'UPDATE_TRANSCRIPT',
  transcript,
});

export const removeMessage = (messageId: string) => ({
  type: actionTypes.removeMessage,
  messageId,
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

export const addAttachmentError = (attachmentError: AttachmentError) => ({
  type: actionTypes.addAttachmentError,
  attachmentError,
});

export const markSendFailure = (messageId: string, reason: string) => ({
  type: actionTypes.markSendFailure,
  messageId,
  reason,
});

export const addPendingAttachmentMessage = (
  tempId: string,
  contentType: string,
  blobUrl: string,
  fromCustomer: boolean,
) => {
  return {
    type: actionTypes.addPendingMessage,
    message: {
      id: tempId,
      localBlobUrl: blobUrl,
      localKey: tempId,
      type: 'Attachment',
      timestamp: Date.now(),
      authorType: fromCustomer ? 'Customer' : 'User',
      status: 'pending',
      contentType,
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

export const setWindowScrollLockEnabled = (enabled: boolean) => ({
  type: 'SET_WINDOW_SCROLL_LOCK_ENABLED',
  enabled,
});

export const reloadApp = () => {
  // Reload the react app
};
