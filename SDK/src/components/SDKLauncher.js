// @flow
/** @jsx h */
import {h, Component} from 'preact';
import ToggleChatButton from './ToggleChatButton';
import SDKChatContainer from './SDKChatContainer';
import {getQuiqOptions, getConfiguration, getChatWindow} from 'Globals';
import * as Postmaster from 'Postmaster';
import {isMobile, isIFrame} from 'Common/Utils';
import {eventTypes} from 'Common/Constants';
import {postmasterActionTypes as actionTypes} from '../../../Common/Constants';

export type SDKLauncherProps = {};
type SDKLauncherState = {
  launcherVisible: boolean,
  containerVisible: boolean,
  showInvitationBlurb: boolean,
};

export class SDKLauncher extends Component<SDKLauncherProps> {
  props: SDKLauncherProps;
  state: SDKLauncherState = {
    launcherVisible: false,
    containerVisible: false,
    showInvitationBlurb: false,
  };

  invitationBlurbTimer: ?TimeoutID;

  componentWillMount() {
    // When standalone is opened, we want to set buttons to have non-visible state.
    Postmaster.registerEventHandler(eventTypes._standaloneOpen, () =>
      this.handleChatVisibilityChange({visible: false}),
    );

    Postmaster.registerEventHandler(
      eventTypes._launchButtonVisibilityShouldChange,
      this.handleLaunchButtonVisibilityChange,
    );

    Postmaster.registerEventHandler(
      eventTypes.chatVisibilityDidChange,
      this.handleChatVisibilityChange,
    );
  }

  componentDidMount() {
    // If no trackingId exists, which means that the u{ser has not opened chat, show the invitation blurb after specified delay
    Postmaster.askChat(actionTypes.getHandle).then(({handle}) => {
      if (!handle) {
        this.invitationBlurbTimer = setTimeout(
          () => this.setState({showInvitationBlurb: true}),
          getQuiqOptions().invitationBlurb.delay || 0,
        );
      }
    });
  }

  handleChatVisibilityChange = (e: {visible: boolean}) => {
    this.setState(state => ({
      containerVisible: e.visible,
      showInvitationBlurb: !state.showInvitationBlurb ? state.showInvitationBlurb : !e.visible,
    }));

    if (e.visible && this.invitationBlurbTimer) {
      clearTimeout(this.invitationBlurbTimer);
      this.invitationBlurbTimer = null;
    }
  };

  handleLaunchButtonVisibilityChange = (e: {visible: boolean}) =>
    this.setState({launcherVisible: e.visible});

  render() {
    const quiqOptions = getQuiqOptions();
    const configuration = getConfiguration();
    const enableMobileChat = configuration && configuration.enableMobileChat;
    return (
      <div className="SDKLauncher">
        {(!isMobile() || enableMobileChat || !!quiqOptions.mobileNumber) &&
          quiqOptions.showDefaultLaunchButton &&
          this.state.launcherVisible && (
            <ToggleChatButton
              open={this.state.containerVisible || !isIFrame(getChatWindow())}
              onClick={() => SDKChatContainer.setChatVisibility()}
              invitationBlurbText={
                this.state.showInvitationBlurb && quiqOptions.invitationBlurb.text
                  ? quiqOptions.invitationBlurb.text
                  : ''
              }
            />
          )}
        <SDKChatContainer />
      </div>
    );
  }
}

export default SDKLauncher;
