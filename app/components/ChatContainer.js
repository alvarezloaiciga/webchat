// @flow
import React from 'react';
import quiqOptions, {validateWelcomeFormDefinition, getStyle, getMessage} from 'Common/QuiqOptions';
import {inStandaloneMode} from 'Common/Utils';
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
import './styles/ChatContainer.scss';
import type {ChatState, ChatInitializedStateType} from 'Common/types';

export type ChatContainerProps = {
  chatContainerHidden: boolean,
  welcomeFormRegistered: boolean,
  initializedState: ChatInitializedStateType,
};

export class ChatContainer extends React.Component<ChatContainerProps> {
  props: ChatContainerProps;

  componentDidMount() {
    if (!this.props.welcomeFormRegistered) validateWelcomeFormDefinition();
  }

  renderBanner = () => {
    const {colors, styles, fontFamily} = quiqOptions;

    const bannerStyle = getStyle(styles.HeaderBanner, {
      backgroundColor: colors.primary,
      fontFamily: fontFamily,
    });

    const errorBannerStyle = getStyle(styles.ErrorBanner, {fontFamily: fontFamily});

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
        return (
          <div className="chatContainerBody">
            <Transcript />
            <MessageForm />
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
    if (this.props.chatContainerHidden) return null;

    const {position} = quiqOptions;

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
        <div
          className={classNames}
          style={{width: quiqOptions.width, maxHeight: quiqOptions.height, ...position}}
        >
          <WelcomeForm />
        </div>
      );
    }

    return (
      <div
        className={classNames}
        style={{width: quiqOptions.width, maxHeight: quiqOptions.height, ...position}}
      >
        <HeaderMenu />
        {this.renderBanner()}
        <Debugger />
        {this.renderContent()}
      </div>
    );
  }
}

export default connect((state: ChatState) => ({
  chatContainerHidden: state.chatContainerHidden,
  initializedState: state.initializedState,
  welcomeFormRegistered: state.welcomeFormRegistered,
}))(ChatContainer);
