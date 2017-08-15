// @flow
import React from 'react';
import QUIQ, {validateWelcomeFormDefinition, getStyle, getMessage} from 'utils/quiq';
import {inStandaloneMode} from 'utils/utils';
import classnames from 'classnames';
import WelcomeForm from 'WelcomeForm';
import MessageForm from 'MessageForm';
import Debugger from './Debugger/Debugger';
import HeaderMenu from 'HeaderMenu';
import Transcript from 'Transcript';
import {getChatClient} from '../ChatClient';
import Spinner from 'Spinner';
import {connect} from 'react-redux';
import {ChatInitializedState, messageTypes} from 'appConstants';
import './styles/ChatContainer.scss';
import type {ChatState, ChatInitializedStateType} from 'types';

export type ChatContainerProps = {
  chatContainerHidden: boolean,
  welcomeFormRegistered: boolean,
  initializedState: ChatInitializedStateType,
};

export class ChatContainer extends React.Component {
  props: ChatContainerProps;

  componentDidMount() {
    if (!this.props.welcomeFormRegistered) validateWelcomeFormDefinition();
  }

  renderBanner = () => {
    const {COLORS, STYLES, FONT_FAMILY} = QUIQ;

    const bannerStyle = getStyle(STYLES.HeaderBanner, {
      backgroundColor: COLORS.primary,
      fontFamily: FONT_FAMILY,
    });

    const errorBannerStyle = getStyle(STYLES.ErrorBanner, {fontFamily: FONT_FAMILY});

    switch (this.props.initializedState) {
      case ChatInitializedState.INITIALIZED:
      case ChatInitializedState.LOADING:
      case ChatInitializedState.UNINITIALIZED:
        return (
          <div className="banner" style={bannerStyle}>
            {getMessage(messageTypes.headerText)}
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

    const {POSITION} = QUIQ;

    const classNames = classnames(`ChatContainer ${this.props.initializedState}`, {
      standaloneMode: inStandaloneMode(),
      hasCustomLauncher: !inStandaloneMode() && QUIQ.CUSTOM_LAUNCH_BUTTONS.length > 0,
    });

    if (
      this.props.initializedState === ChatInitializedState.INITIALIZED &&
      !this.props.welcomeFormRegistered &&
      !getChatClient().isRegistered()
    ) {
      return (
        <div
          className={classNames}
          style={{width: QUIQ.WIDTH, maxHeight: QUIQ.HEIGHT, ...POSITION}}
        >
          <WelcomeForm />
        </div>
      );
    }

    return (
      <div className={classNames} style={{width: QUIQ.WIDTH, maxHeight: QUIQ.HEIGHT, ...POSITION}}>
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
