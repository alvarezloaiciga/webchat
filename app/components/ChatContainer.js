// @flow
import React from 'react';
import quiqOptions, {validateWelcomeFormDefinition, getStyle, getMessage} from 'Common/QuiqOptions';
import {inStandaloneMode, isStorageEnabled, isSupportedBrowser, uuidv4} from 'Common/Utils';
import classnames from 'classnames';
import WelcomeForm from 'WelcomeForm';
import MessageForm from 'MessageForm';
import Debugger from './Debugger/Debugger';
import HeaderMenu from 'HeaderMenu';
import Transcript from 'Transcript';
import QuiqChatClient from 'quiq-chat';
import Spinner from 'Spinner';
import {connect} from 'react-redux';
import {ChatInitializedState, messageTypes} from 'Common/Constants';
import Dropzone from 'react-dropzone';
import * as ChatActions from 'actions/chatActions';
import './styles/ChatContainer.scss';
import type {ChatState, ChatInitializedStateType} from 'Common/types';

export type ChatContainerProps = {
  chatContainerHidden: boolean,
  welcomeFormRegistered: boolean,
  initializedState: ChatInitializedStateType,
  setUploadProgress: (messageId: string, progress: number) => void,
  updatePendingAttachmentId: (tempId: string, newId: string) => void,
  addPendingAttachmentMessage: (
    tempId: string,
    contentType: string,
    url: string,
    fromCustomer: boolean,
  ) => void,
};

export type ChatContainerState = {
  bannerMessage?: string,
};

export class ChatContainer extends React.Component<ChatContainerProps, ChatContainerState> {
  props: ChatContainerProps;
  state: ChatContainerState = {};
  dropzone: ?Dropzone;

  componentDidMount() {
    if (!this.props.welcomeFormRegistered) validateWelcomeFormDefinition();
  }

  handleAttachments = (accepted: Array<File>, rejected: Array<File>) => {
    if (rejected.length > 0) {
      this.setState({
        bannerMessage: getMessage(messageTypes.invalidAttachmentMessage),
      });
      // Hide the error in 10 seconds
      setTimeout(() => this.setState({bannerMessage: undefined}), 10 * 1000);
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
      ).then(id => {
        this.props.updatePendingAttachmentId(tempId, id);
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
    switch (this.props.initializedState) {
      case ChatInitializedState.INITIALIZED:
        /*return (
          <Dropzone
            ref={d => {
              this.dropzone = d;
            }}
            className="chatContainerBody"
            accept={acceptedAttachmentTypes}
            disablePreview={true}
            disableClick={true}
            maxSize={maxAttachmentSize}
            onDrop={this.handleAttachments}
          >
              <Transcript />
              <MessageForm openFileBrowser={this.openFileBrowser} />
          </Dropzone>
        );*/
        return (
          <div className="chatContainerBody">
            <Transcript />
            <MessageForm openFileBrowser={this.openFileBrowser} />
          </div>
        );
      case ChatInitializedState.UNINITIALIZED:
      case ChatInitializedState.LOADING:
        return (
          <div className="chatContainerBody">
            <Spinner />
          </div>
        );
      case ChatInitializedState.DISCONNECTED:
      case ChatInitializedState.ERROR:
      case ChatInitializedState.INACTIVE:
      case ChatInitializedState.BURNED:
      default:
        return (
          <div className="chatContainerBody">
            <Transcript />
          </div>
        );
    }
  };

  render() {
    if (this.props.chatContainerHidden || !isSupportedBrowser() || !isStorageEnabled()) return null;

    const classNames = classnames(`ChatContainer ${this.props.initializedState}`, {
      standaloneMode: inStandaloneMode(),
      hasCustomLauncher: !inStandaloneMode() && quiqOptions.customLaunchButtons.length > 0,
    });

    if (
      this.props.initializedState === ChatInitializedState.INITIALIZED &&
      !this.props.welcomeFormRegistered &&
      !QuiqChatClient.isRegistered()
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
});

const mapDispatchToProps = {
  setUploadProgress: ChatActions.setUploadProgress,
  updatePendingAttachmentId: ChatActions.updatePendingAttachmentId,
  addPendingAttachmentMessage: ChatActions.addPendingAttachmentMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);
