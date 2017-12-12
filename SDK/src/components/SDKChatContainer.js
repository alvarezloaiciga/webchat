// @flow
/** @jsx h */
import {Component, h} from 'preact';
import {getQuiqOptions, setChatWindow, getChatWindow, getConfiguration} from 'Globals';
import {
  webchatPath,
  eventTypes,
  postmasterActionTypes as actionTypes,
  displayModes,
} from 'Common/Constants';
import {setup, registerEventHandler, tellChat, askChat} from 'Postmaster';
import {
  isIFrame,
  isStorageEnabled,
  isSupportedBrowser,
  openStandaloneWindow,
  loadStandaloneWindow,
  isMobile,
} from 'Common/Utils';
import classnames from 'classnames';
import './styles/SDKChatContainer.scss';

export type SDKChatContainerProps = {};
type SDKChatContainerState = {
  containerVisible: boolean,
};

export class SDKChatContainer extends Component<SDKChatContainerProps, SDKChatContainerState> {
  props: SDKChatContainerProps;
  state: SDKChatContainerState = {
    containerVisible: false,
  };

  static chatFrame: any;
  static singletonInstance: SDKChatContainer;

  constructor(props: SDKChatContainerProps) {
    super(props);
    SDKChatContainer.singletonInstance = this;
  }

  componentWillMount() {
    registerEventHandler(eventTypes.chatVisibilityDidChange, this.handleChatVisibilityChange);
    registerEventHandler(eventTypes._standaloneOpen, SDKChatContainer.handleStandaloneOpen);
  }

  static updateChatWindow = (newWindow: Object) => {
    setChatWindow(newWindow);
    setup();
  };

  static async setChatVisibility(_visible: ?boolean, mobileOverride: boolean = false) {
    const quiqOptions = getQuiqOptions();
    const configuration = getConfiguration();
    const enableMobileChat = configuration && configuration.enableMobileChat;

    let popup;

    // If chat is in its own window, focus that window, unless _visible is explicitly false, in which case close it
    if (!isIFrame(getChatWindow())) {
      if (_visible === false) {
        getChatWindow().close();
      } else {
        getChatWindow().focus();
      }
      return;
    }

    // If we're on mobile and mobile chat is not enabled, don't show chat.
    // Open SMS app if mobileNumber is defined.
    if (isMobile() && !enableMobileChat && !mobileOverride) {
      if (_visible !== false && quiqOptions.mobileNumber)
        window.location = `sms:${quiqOptions.mobileNumber}`;
      return;
    }

    if (quiqOptions.displayMode === displayModes.UNDOCKED) {
      // Open standalone window immediately--this must be done prior to any asynchronous invocation so as not to break trusted event chain
      const {width, height} = quiqOptions;
      popup = openStandaloneWindow(width, height, SDKChatContainer.handleStandaloneClose);

      // Unload chat in IFrame
      tellChat(actionTypes.unloadChat);

      setChatWindow(popup);

      const {localStorageKeys} = await askChat(actionTypes.getLocalStorage);
      SDKChatContainer.handleStandaloneOpen({localStorageKeys});
      return;
    }

    // If visibility was explicitly provided, use that value. Otherwise, "toggle" current visibility
    const visible =
      typeof _visible === 'boolean'
        ? _visible
        : !(await askChat(actionTypes.getChatVisibility)).visible;

    // Set visibility of container if chat is docked
    tellChat(actionTypes.setChatVisibility, {visible});
  }

  static handleStandaloneClose = () => {
    const quiqOptions = getQuiqOptions();

    SDKChatContainer.updateChatWindow(SDKChatContainer.chatFrame);

    // Load chat back up in the Iframe
    tellChat(actionTypes.loadChat);

    // If we are NOT in undocked-only mode, set chat iframe visible. Otherwise, set chat visibility to hidden.
    tellChat(actionTypes.setChatVisibility, {
      visible: quiqOptions.displayMode !== displayModes.UNDOCKED,
    });
  };

  static handleStandaloneOpen = (data: {localStorageKeys: ?{[string]: any}}) => {
    const quiqOptions = getQuiqOptions();
    const {width, height} = quiqOptions;

    // If we got an access token, append it to quiq Options
    if (data && data.localStorageKeys) {
      quiqOptions.localStorageKeys = data.localStorageKeys;
    }

    // If the popup is already open, we only need to load chat, not open the window.
    // When this function is triggered by event from iframe, window will not be open yet.
    // But when called explicitly by SDK, window will have already been opened.
    let popup;
    if (isIFrame(getChatWindow())) {
      popup = openStandaloneWindow(
        width,
        height,
        SDKChatContainer.handleStandaloneClose,
        quiqOptions,
      );
    } else {
      popup = getChatWindow();
      loadStandaloneWindow(popup, quiqOptions);
    }

    SDKChatContainer.updateChatWindow(popup);
    popup.focus();

    if (isIFrame(getChatWindow())) {
      SDKChatContainer.singletonInstance.setState({containerVisible: false});
    }
  };

  handleChatVisibilityChange = (e: {visible: boolean}) =>
    this.setState({containerVisible: e.visible});

  handleLoad = () => {
    const quiqOptions = getQuiqOptions();
    SDKChatContainer.updateChatWindow(SDKChatContainer.chatFrame);
    SDKChatContainer.chatFrame.contentWindow.postMessage(
      {quiqOptions, name: 'handshake'},
      quiqOptions.host,
    );
  };

  render() {
    const {width, host, height, position, showDefaultLaunchButton} = getQuiqOptions();

    if (!isStorageEnabled() || !isSupportedBrowser()) return null;
    const classNames = classnames('SDKChatContainer', {
      hasCustomLauncher: showDefaultLaunchButton,
    });

    return (
      <iframe
        ref={r => {
          SDKChatContainer.chatFrame = r;
        }}
        onLoad={this.handleLoad}
        width={width}
        style={{...position}}
        height={isIFrame(getChatWindow()) && this.state.containerVisible ? height : 0}
        className={classNames}
        src={`${host}/${webchatPath}`}
      />
    );
  }
}

export default SDKChatContainer;
