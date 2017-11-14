// @flow
import React from 'react';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import {inStandaloneMode, isStorageEnabled, isSupportedBrowser, uuidv4} from 'Common/Utils';
import classnames from 'classnames';
import WelcomeForm from 'WelcomeForm';
import MessageForm from 'MessageForm';
import Debugger from './Debugger/Debugger';
import HeaderMenu from 'HeaderMenu';
import QuiqChatClient from 'quiq-chat';
import Transcript from 'Transcript';
import Spinner from 'Spinner';
import {connect} from 'react-redux';
import {ChatInitializedState, messageTypes, maxAttachmentSize} from 'Common/Constants';
import Dropzone from 'react-dropzone';
import * as ChatActions from 'actions/chatActions';
import './styles/ChatContainer.scss';
import type {
  ChatState,
  ChatInitializedStateType,
  ChatConfiguration,
  Message as MessageType,
} from 'Common/types';
import {registerExtension, postExtensionEvent} from 'services/Extensions';
import {getTranscript, getIsAgentAssigned} from 'reducers/chat';

export type ChatContainerProps = {
  chatContainerHidden: boolean,
  configuration: ChatConfiguration,
  welcomeFormRegistered: boolean,
  initializedState: ChatInitializedStateType,
  isAgentAssigned: boolean,
  transcript: Array<MessageType>,
  setUploadProgress: (messageId: string, progress: number) => void,
  updatePendingAttachmentId: (tempId: string, newId: string) => void,
  addPendingAttachmentMessage: (
    tempId: string,
    contentType: string,
    url: string,
    fromCustomer: boolean,
  ) => void,
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
    document.title = getMessage(messageTypes.pageTitle);
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
    if (rejected.length > 0) {
      this.displayTemporaryError(getMessage(messageTypes.invalidAttachmentMessage), 10 * 1000);
      return;
    }

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
          this.displayTemporaryError(getMessage(messageTypes.attachmentUploadError), 10 * 1000);
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
      return (
        <div className="errorBanner" style={errorBannerStyle}>
          {this.state.bannerMessage}
        </div>
      );
    }

    switch (this.props.initializedState) {
      case ChatInitializedState.INITIALIZED:
      case ChatInitializedState.LOADING:
      case ChatInitializedState.UNINITIALIZED:
        return (
          <div className="banner" style={bannerStyle}>
            {getMessage(messageTypes.headerText)}
          </div>
        );
      case ChatInitializedState.INACTIVE:
        return (
          <div className="errorBanner" style={errorBannerStyle}>
            {getMessage(messageTypes.inactiveMessage)}
          </div>
        );
      case ChatInitializedState.DISCONNECTED:
        return (
          <div className="errorBanner" style={errorBannerStyle}>
            {getMessage(messageTypes.reconnectingMessage)}
          </div>
        );
      case ChatInitializedState.ERROR:
      case ChatInitializedState.BURNED:
      default:
        return (
          <div className="errorBanner" style={errorBannerStyle}>
            {getMessage(messageTypes.errorMessage)}
          </div>
        );
    }
  };

  renderContent = () => {
    const chatContainerStyle = {backgroundColor: quiqOptions.colors.transcriptBackground};
    switch (this.props.initializedState) {
      case ChatInitializedState.INITIALIZED:
        return (
          <div className="chatContainerBody" style={chatContainerStyle}>
            {this.isUsingWaitScreen() && (
              <iframe
                ref={r => {
                  this.extensionFrame = r;
                }}
                className="waitScreen"
                onLoad={this.handleIFrameLoad}
                style={{
                  minHeight: this.getWaitScreenMinHeight(),
                  height: this.getWaitScreenHeight(),
                  borderWidth: 0,
                  flexGrow: this.getWaitScreenFlexGrow(),
                  width: '100%',
                }}
                sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-same-origin allow-orientation-lock"
                // $FlowIssue - null check is in isUsingWaitScreen
                src={quiqOptions.customScreens.waitScreen.url}
              />
            )}
            <Dropzone
              ref={d => {
                this.dropzone = d;
              }}
              className={
                this.isUsingWaitScreen() ? 'transcriptAreaWithWaitScreen' : 'transcriptArea'
              }
              disabled={!this.props.configuration.enableChatFileAttachments}
              accept={this.props.configuration.supportedAttachmentTypes.join(',')}
              disablePreview={true}
              disableClick={true}
              maxSize={maxAttachmentSize}
              onDrop={this.handleAttachments}
              style={{
                // This is to ensure that the size of this renders in a way that allows us to at least scroll in IE 10
                minHeight: this.props.transcript.length > 0 ? '75px' : '0px',
              }}
            >
              <Transcript />
              <MessageForm openFileBrowser={this.openFileBrowser} />
            </Dropzone>
          </div>
        );
      case ChatInitializedState.UNINITIALIZED:
      case ChatInitializedState.LOADING:
        return (
          <div className="chatContainerBody" style={chatContainerStyle}>
            <Spinner />
          </div>
        );
      case ChatInitializedState.DISCONNECTED:
      case ChatInitializedState.ERROR:
      case ChatInitializedState.INACTIVE:
      case ChatInitializedState.BURNED:
      default:
        return (
          <div className="chatContainerBody" style={chatContainerStyle}>
            <Transcript />
          </div>
        );
    }
  };

  isUsingWaitScreen = () => {
    return (
      quiqOptions.customScreens &&
      quiqOptions.customScreens.waitScreen &&
      !this.props.isAgentAssigned
    );
  };

  handleIFrameLoad = () => {
    // $FlowIssue - Null check is done upstream of this call
    registerExtension(quiqOptions.customScreens.waitScreen.url, this.extensionFrame.contentWindow);

    setInterval(() => {
      postExtensionEvent({
        eventType: 'estimatedWaitTimeChanged',
        data: {estimatedWaitTime: new Date().getTime()},
      });
    }, 1000);
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

    const classNames = classnames(`ChatContainer ${this.props.initializedState}`, {
      standaloneMode: inStandaloneMode(),
      hasCustomLauncher: !inStandaloneMode() && quiqOptions.customLaunchButtons.length > 0,
    });

    if (
      this.props.initializedState === ChatInitializedState.INITIALIZED &&
      !this.props.welcomeFormRegistered
    ) {
      return (
        <div className={classNames}>
          <WelcomeForm />
        </div>
      );
    }

    return (
      <div className={classNames}>
        <HeaderMenu />
        {this.renderBanner()}
        <Debugger />
        {this.renderContent()}
      </div>
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
});

const mapDispatchToProps = {
  setUploadProgress: ChatActions.setUploadProgress,
  updatePendingAttachmentId: ChatActions.updatePendingAttachmentId,
  addPendingAttachmentMessage: ChatActions.addPendingAttachmentMessage,
  removeMessage: ChatActions.removeMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);
