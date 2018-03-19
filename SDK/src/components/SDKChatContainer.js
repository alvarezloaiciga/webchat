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
import {setup, registerEventHandler, tellChat, askChat, loadChat} from 'Postmaster';
import {
  isIFrame,
  isStorageEnabled,
  isSupportedBrowser,
  openStandaloneWindow,
  loadStandaloneWindow,
  isMobile,
} from 'Common/Utils';
import classnames from 'classnames';
import SDKHeaderMenu from './SDKHeaderMenu';
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
      SDKChatContainer.handleStandaloneOpen();
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
    loadChat();

    // If we are NOT in undocked-only mode, set chat iframe visible. Otherwise, set chat visibility to hidden.
    const containerVisible = quiqOptions.displayMode !== displayModes.UNDOCKED;
    tellChat(actionTypes.setChatVisibility, {
      visible: containerVisible,
    });

    // Set docked container visibility
    SDKChatContainer.singletonInstance.setState({containerVisible});
  };

  static handleStandaloneOpen = async (data: ?{localStorageKeys: ?{[string]: any}}) => {
    const quiqOptions = getQuiqOptions();
    const {width, height} = quiqOptions;
    let popup = getChatWindow();

    // If the popup is already open, we only need to load chat, not open the window.
    // If not, open the standalone window now--this must be done prior to any asynchronous invocation so as not to break trusted event chain

    if (isIFrame(popup)) {
      popup = openStandaloneWindow(width, height, SDKChatContainer.handleStandaloneClose);
    }

    // Make sure we have an access token before opening standalone mode.
    // On browsers which sandbox localStorage, the parent page will never get a token that's created by the popup.
    // If there's going to be a new session, it needs to be create don parent page and force-fed to popup.
    let localStorageKeys = (data && data.localStorageKeys) || {};
    const quiqData = localStorageKeys[`quiq-data_${quiqOptions.contactPoint}`];
    if (!quiqData || !JSON.parse(quiqData).accessToken) {
      // This will generate an accessToken and store it persisted quiq-data
      await askChat(actionTypes.getHandle);
      // Grab newly updated persistent data
      ({localStorageKeys} = await askChat(actionTypes.getLocalStorage));
    }
    // Append local storage to quiq Options
    quiqOptions.localStorageKeys = localStorageKeys;

    // Unload chat in IFrame
    tellChat(actionTypes.unloadChat);

    // Load chat in popup
    loadStandaloneWindow(popup, quiqOptions);

    // Setup Postmaster with new window
    SDKChatContainer.updateChatWindow(popup);

    popup.focus();

    SDKChatContainer.singletonInstance.setState({containerVisible: false});
  };

  handleChatVisibilityChange = (e: {visible: boolean}) =>
    this.setState({containerVisible: e.visible});

  handleLoad = () => {
    const quiqOptions = getQuiqOptions();
    SDKChatContainer.updateChatWindow(SDKChatContainer.chatFrame);

    // Handshake--thi bootstraps app in Iframe
    SDKChatContainer.chatFrame.contentWindow.postMessage(
      {quiqOptions, name: 'handshake'},
      quiqOptions.host,
    );
  };

  render() {
    const {width, host, height, position, showDefaultLaunchButton, colors} = getQuiqOptions();

    if (!isStorageEnabled() || !isSupportedBrowser()) return null;
    const containerClassNames = classnames('SDKChatContainer', {
      hidden: !isIFrame(getChatWindow()) || !this.state.containerVisible,
      hasCustomLauncher: showDefaultLaunchButton,
    });

    return (
      <div
        className={containerClassNames}
        style={{
          height,
          width,
          boxShadow: colors.shadow ? `0 3px 10px ${colors.shadow}` : null,
          ...position,
        }}
      >
        <SDKHeaderMenu />
        <iframe
          className="ChatFrame"
          ref={r => {
            SDKChatContainer.chatFrame = r;
          }}
          onLoad={this.handleLoad}
          width={width}
          style={{...position}}
          height={isIFrame(getChatWindow()) && this.state.containerVisible ? height : 0}
          src={`${host}/${webchatPath}`}
        />
      </div>
    );
  }
}

export default SDKChatContainer;
