// @flow
import React from 'react';
import {getQuiqOptions, setChatWindow, getChatWindow} from 'Globals';
import {webchatPath, eventTypes, actionTypes} from 'Common/Constants';
import {setup, registerEventHandler, tellChat} from 'Postmaster';
import {isIFrame} from 'Common/Utils';
import {usingCustomLauncher} from 'Common/QuiqOptions';
import classnames from 'classnames';
import './styles/SDKChatContainer.scss';

export type SDKChatContainerProps = {};
type SDKChatContainerState = {
  containerVisible: boolean,
};

export class SDKChatContainer extends React.Component<
  SDKChatContainerProps,
  SDKChatContainerState,
> {
  props: SDKChatContainerProps;
  state: SDKChatContainerState = {
    containerVisible: false,
  };

  chatFrame: any;
  standaloneWindowTimer: number;

  componentWillMount() {
    registerEventHandler(eventTypes.chatVisibilityDidChange, this.handleChatVisibilityChange);
    registerEventHandler(eventTypes._standaloneOpen, this.handleStandaloneOpen);
  }

  updateChatWindow = (newWindow: Object) => {
    setChatWindow(newWindow);
    setup();
  };

  handleChatVisibilityChange = (e: {visible: boolean}) =>
    this.setState({containerVisible: e.visible});

  handleLoad = () => {
    const quiqOptions = getQuiqOptions();
    this.updateChatWindow(this.chatFrame);
    this.chatFrame.contentWindow.postMessage({quiqOptions, name: 'handshake'}, quiqOptions.host);
  };

  handleStandaloneOpen = (data: {localStorageKeys: ?{[string]: any}}) => {
    const quiqOptions = getQuiqOptions();
    const {host, width, height} = quiqOptions;

    // If we got an access token, append it to quiq Options
    if (data && data.localStorageKeys) {
      quiqOptions.localStorageKeys = data.localStorageKeys;
    }

    const popup = window.open(
      `${host}/${webchatPath}`,
      JSON.stringify(quiqOptions),
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, copyhistory=no, resizable=no, width=${width}, height=${height}, top=${screen.height /
        2 -
        height / 2}, left=${screen.width / 2 - width / 2}`,
    );

    if (isIFrame(getChatWindow())) {
      this.setState({containerVisible: false});
    }

    this.updateChatWindow(popup);
    popup.focus();

    clearInterval(this.standaloneWindowTimer);
    this.standaloneWindowTimer = setInterval(() => {
      if (popup.closed) {
        clearInterval(this.standaloneWindowTimer);
        this.updateChatWindow(this.chatFrame);
        tellChat(actionTypes.setChatVisibility, {visible: true});
      }
    }, 20);
  };

  render() {
    const {isStorageEnabled, isSupportedBrowser, width, host, height, position} = getQuiqOptions();

    if (!isStorageEnabled || !isSupportedBrowser) return null;
    const classNames = classnames('SDKChatContainer', {
      hasCustomLauncher: usingCustomLauncher(),
    });

    return (
      <iframe
        ref={r => {
          this.chatFrame = r;
        }}
        onLoad={this.handleLoad}
        width={width}
        style={{...position}}
        height={this.state.containerVisible ? height : 0}
        className={classNames}
        src={`${host}/${webchatPath}`}
      />
    );
  }
}

export default SDKChatContainer;
