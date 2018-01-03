// @flow
import React from 'react';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import {
  inStandaloneMode,
  isStorageEnabled,
  isSupportedBrowser,
  uuidv4,
  convertToExtensionMessages,
  isIPhone,
} from 'Common/Utils';
import {createGuid} from 'core-ui/utils/stringUtils';
import WelcomeForm from 'WelcomeForm';
import MessageForm from 'MessageForm';
import Debugger from './Debugger/Debugger';
import HeaderMenu from 'HeaderMenu';
import QuiqChatClient from 'quiq-chat';
import Transcript from 'Transcript';
import Spinner from 'Spinner';
import {connect} from 'react-redux';
import {
  ChatInitializedState,
  intlMessageTypes,
  maxAttachmentSize,
  ExtensionSdkEventTypes,
  AttachmentErrorTypes,
} from 'Common/Constants';
import Dropzone from 'react-dropzone';
import * as ChatActions from 'actions/chatActions';
import type {
  ChatState,
  ChatInitializedStateType,
  ChatConfiguration,
  Message as MessageType,
  AttachmentError,
} from 'Common/types';
import {registerExtension, postExtensionEvent} from 'services/Extensions';
import {getTranscript, getIsAgentAssigned, getAgentEndedLatestConversation} from 'reducers/chat';
import styled, {css} from 'react-emotion';

export const getHeight = (originalHeight: string): string => {
  let height = originalHeight;

  if (isIPhone()) {
    height = `${window.innerHeight}px`;
  }

  return height;
};

export const ChatContainerStyle = styled.div`
  width: 99vw !important;
  height: ${getHeight('98vh')} !important;
  max-width: none !important;
  max-height: none !important;
  margin: auto !important;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.117647);
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f4f4f8;

  ${props =>
    props.standaloneMode &&
    css`
      width: 100vw !important;
      height: ${getHeight('100vh')} !important;
      position: initial;
      right: 0;
      bottom: 0;
      border: none;
      border-radius: 0;
      animation: none;
    `};
`;

export const ChatContainerBody = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export const Banner = styled.div`
  flex: 0 0 auto;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: 300;
  font-size: 14px;
  padding: 0 30px;
  align-items: stretch;
  text-align: center;
  background: #59ad5d;
  height: 60px;
`;

export const ErrorBanner = styled.div`
  flex: 0 0 auto;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: 300;
  font-size: 14px;
  padding: 0 30px;
  align-items: stretch;
  text-align: center;
  background: #ad2215;
  height: 50px;
`;

/* eslint-disable no-confusing-arrow */
export const TranscriptArea = styled(Dropzone)`
  display: flex;
  flex: ${props => (!props.hasWaitScreen ? 1 : 0)} 1 auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  white-space: pre-wrap;
`;
/* eslint-disable no-confusing-arrow */

export const WaitScreenScrollWrapper = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  // IMPORTANT: This property is needed to allow for scrolling within the iFrame
  // on mobile devices. If you remove, be sure to test those scenarios.
  -webkit-overflow-scrolling: touch;
`;

export const WaitScreen = styled.iframe`
  flex: 1 1 auto;
  height: 100%;
  border-width: 0;
  width: 100%;
`;

export type ChatContainerProps = {
  chatContainerHidden: boolean,
  configuration: ChatConfiguration,
  welcomeFormRegistered: boolean,
  initializedState: ChatInitializedStateType,
  isAgentAssigned: boolean,
  transcript: Array<MessageType>,
  agentEndedConversation: boolean,
  agentsAvailable: boolean,
  setUploadProgress: (messageId: string, progress: number) => void,
  updatePendingAttachmentId: (tempId: string, newId: string) => void,
  addPendingAttachmentMessage: (
    tempId: string,
    contentType: string,
    url: string,
    fromCustomer: boolean,
  ) => void,
  addAttachmentError: (attachmentError: AttachmentError) => void,
  removeMessage: (id: string) => void,
};

export type ChatContainerState = {
  bannerMessage?: string,
};

export class ChatContainer extends React.Component<ChatContainerProps, ChatContainerState> {
  props: ChatContainerProps;
  state: ChatContainerState = {};
  dropzone: ?Dropzone;
  bannerMessageTimeout: ?number;
  extensionFrame: any;

  componentWillMount() {
    // Set custom window title
    document.title = getMessage(intlMessageTypes.pageTitle);
  }

  displayTemporaryError = (text: string, duration: number) => {
    // Clear any pending timeout
    if (this.bannerMessageTimeout) {
      clearTimeout(this.bannerMessageTimeout);
    }

    this.setState({
      bannerMessage: text,
    });

    // Hide the error in <duration> milliseconds
    this.bannerMessageTimeout = setTimeout(
      () => this.setState({bannerMessage: undefined}),
      duration,
    );
  };

  handleAttachments = (accepted: Array<File>, rejected: Array<File>) => {
    rejected.forEach(f => {
      this.props.addAttachmentError({
        timestamp: Date.now(),
        id: createGuid(),
        type:
          f.size > maxAttachmentSize
            ? AttachmentErrorTypes.TOO_LARGE
            : AttachmentErrorTypes.UNSUPPORTED_TYPE,
        payload: f.name,
      });
    });

    if (rejected.length > 0) return;

    // Clear any attachment error
    this.setState({bannerMessage: undefined});

    accepted.forEach(file => {
      const tempId = `temp_${uuidv4()}`;
      const dataUrl = window.URL.createObjectURL(file);
      this.props.addPendingAttachmentMessage(tempId, file.type, dataUrl, true);
      QuiqChatClient.sendAttachmentMessage(file, (progress: number) =>
        this.props.setUploadProgress(tempId, progress),
      )
        .then(id => {
          this.props.updatePendingAttachmentId(tempId, id);
        })
        .catch(() => {
          this.props.addAttachmentError({
            timestamp: Date.now(),
            id: createGuid(),
            type: AttachmentErrorTypes.UPLOAD_ERROR,
            payload: file.name,
          });
          this.props.removeMessage(tempId);
        });
    });
  };

  openFileBrowser = () => {
    if (this.dropzone) {
      this.dropzone.open();
    }
  };

  renderBanner = () => {
    const {colors, styles, fontFamily} = quiqOptions;

    const bannerStyle = getStyle(styles.HeaderBanner, {
      backgroundColor: colors.primary,
      fontFamily,
    });

    const errorBannerStyle = getStyle(styles.ErrorBanner, {fontFamily});

    // If state indicates a warning message, use that
    if (this.state.bannerMessage) {
      return <ErrorBanner style={errorBannerStyle}>{this.state.bannerMessage}</ErrorBanner>;
    }

    switch (this.props.initializedState) {
      case ChatInitializedState.INITIALIZED:
      case ChatInitializedState.LOADING:
      case ChatInitializedState.UNINITIALIZED:
        return <Banner style={bannerStyle}>{getMessage(intlMessageTypes.headerText)}</Banner>;
      case ChatInitializedState.INACTIVE:
        return (
          <ErrorBanner style={errorBannerStyle}>
            {getMessage(intlMessageTypes.inactiveMessage)}
          </ErrorBanner>
        );
      case ChatInitializedState.DISCONNECTED:
        return (
          <ErrorBanner style={errorBannerStyle}>
            {getMessage(intlMessageTypes.reconnectingMessage)}
          </ErrorBanner>
        );
      case ChatInitializedState.ERROR:
      case ChatInitializedState.BURNED:
      default:
        return (
          <ErrorBanner style={errorBannerStyle}>
            {getMessage(intlMessageTypes.errorMessage)}
          </ErrorBanner>
        );
    }
  };

  renderContent = () => {
    const chatContainerStyle = {backgroundColor: quiqOptions.colors.transcriptBackground};
    switch (this.props.initializedState) {
      case ChatInitializedState.INITIALIZED:
        return (
          <ChatContainerBody style={chatContainerStyle}>
            {this.isUsingWaitScreen() && (
              // IMPORTANT: This wrapper is needed to get scrolling and the flex resizing to
              // working correctly on mobile devices. If you remove, be sure to test those
              // scenarios.
              <WaitScreenScrollWrapper
                style={{
                  minHeight: this.getWaitScreenMinHeight(),
                  height: this.getWaitScreenHeight(),
                  borderWidth: 0,
                  flexGrow: this.getWaitScreenFlexGrow(),
                  width: '100%',
                }}
              >
                <WaitScreen
                  innerRef={r => {
                    this.extensionFrame = r;
                  }}
                  style={{
                    minHeight: this.getWaitScreenMinHeight(),
                  }}
                  onLoad={this.handleIFrameLoad}
                  sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-same-origin allow-orientation-lock"
                  src={
                    quiqOptions.customScreens && quiqOptions.customScreens.waitScreen
                      ? quiqOptions.customScreens.waitScreen.url
                      : ''
                  }
                />
              </WaitScreenScrollWrapper>
            )}
            <TranscriptArea
              innerRef={d => {
                this.dropzone = d;
              }}
              hasWaitScreen={this.isUsingWaitScreen()}
              disabled={
                !this.props.agentsAvailable ||
                !this.props.configuration.enableChatFileAttachments ||
                (this.props.configuration.enableManualConvoStart &&
                  this.props.agentEndedConversation)
              }
              accept={this.props.configuration.supportedAttachmentTypes.join(',')}
              disablePreview={true}
              disableClick={true}
              maxSize={maxAttachmentSize}
              onDrop={this.handleAttachments}
              style={{
                // This is to ensure that the size of this renders in a way that allows us to at least scroll in IE 10
                minHeight: this.props.transcript.length > 0 ? '75px' : '0px',
              }}
              id="TranscriptArea"
            >
              <Transcript />
              <MessageForm openFileBrowser={this.openFileBrowser} />
            </TranscriptArea>
          </ChatContainerBody>
        );
      case ChatInitializedState.UNINITIALIZED:
      case ChatInitializedState.LOADING:
        return (
          <ChatContainerBody style={chatContainerStyle}>
            <Spinner />
          </ChatContainerBody>
        );
      case ChatInitializedState.DISCONNECTED:
      case ChatInitializedState.ERROR:
      case ChatInitializedState.INACTIVE:
      case ChatInitializedState.BURNED:
      default:
        return (
          <ChatContainerBody style={chatContainerStyle}>
            <Transcript />
          </ChatContainerBody>
        );
    }
  };

  isUsingWaitScreen = () => {
    return (
      quiqOptions.customScreens &&
      quiqOptions.customScreens.waitScreen &&
      !this.props.isAgentAssigned &&
      !this.props.agentEndedConversation
    );
  };

  handleIFrameLoad = () => {
    // $FlowIssue - Null check is done upstream of this call
    registerExtension(quiqOptions.customScreens.waitScreen.url, this.extensionFrame.contentWindow);

    postExtensionEvent({
      eventType: 'transcriptChanged',
      data: {messages: convertToExtensionMessages(this.props.transcript)},
    });

    postExtensionEvent({
      eventType: ExtensionSdkEventTypes.ESTIMATED_WAIT_TIME_CHANGED,
      data: {estimatedWaitTime: QuiqChatClient.getEstimatedWaitTime()},
    });

    QuiqChatClient.onEstimatedWaitTimeChanged((estimatedWaitTime?: number) => {
      if (this.extensionFrame && this.extensionFrame.contentWindow) {
        postExtensionEvent({
          eventType: ExtensionSdkEventTypes.ESTIMATED_WAIT_TIME_CHANGED,
          data: {estimatedWaitTime},
        });
      }
    });
  };

  getWaitScreenHeight = () => {
    // $FlowIssue - Null check is done upstream of this call
    return quiqOptions.customScreens.waitScreen.height
      ? quiqOptions.customScreens.waitScreen.height
      : '100%';
  };

  getWaitScreenFlexGrow = () => {
    // $FlowIssue - Null check is done upstream of this call
    return quiqOptions.customScreens.waitScreen.height ? 0 : 1;
  };

  getWaitScreenMinHeight = () => {
    // $FlowIssue - Null check is done upstream of this call
    return quiqOptions.customScreens.waitScreen.minHeight
      ? quiqOptions.customScreens.waitScreen.minHeight
      : 100;
  };

  render() {
    if (this.props.chatContainerHidden || !isSupportedBrowser() || !isStorageEnabled()) return null;

    if (
      quiqOptions.demoMode ||
      (this.props.initializedState === ChatInitializedState.INITIALIZED &&
        !this.props.welcomeFormRegistered)
    ) {
      return (
        <ChatContainerStyle standaloneMode={inStandaloneMode()}>
          <WelcomeForm />
        </ChatContainerStyle>
      );
    }

    return (
      <ChatContainerStyle standaloneMode={inStandaloneMode()}>
        <HeaderMenu />
        {this.renderBanner()}
        <Debugger />
        {this.renderContent()}
      </ChatContainerStyle>
    );
  }
}

const mapStateToProps = (state: ChatState) => ({
  chatContainerHidden: state.chatContainerHidden,
  initializedState: state.initializedState,
  welcomeFormRegistered: state.welcomeFormRegistered,
  configuration: state.configuration,
  isAgentAssigned: getIsAgentAssigned(state),
  transcript: getTranscript(state),
  agentEndedConversation: getAgentEndedLatestConversation(state),
  agentsAvailable: state.agentsAvailable || QuiqChatClient.isUserSubscribed(),
});

const mapDispatchToProps = {
  setUploadProgress: ChatActions.setUploadProgress,
  updatePendingAttachmentId: ChatActions.updatePendingAttachmentId,
  addPendingAttachmentMessage: ChatActions.addPendingAttachmentMessage,
  addAttachmentError: ChatActions.addAttachmentError,
  removeMessage: ChatActions.removeMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);
