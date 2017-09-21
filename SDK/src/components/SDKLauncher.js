// @flow
/** @jsx h */
import {h, Component} from 'preact';
import ToggleChatButton from './ToggleChatButton';
import SDKChatContainer from './SDKChatContainer';
import NonChat from './NonChat';
import {isStorageEnabled, isSupportedBrowser} from 'Common/Utils';
import {getQuiqOptions} from 'Globals';
import * as Postmaster from 'Postmaster';
import {handleLaunchButtonClick} from 'managers/ButtonManager';
import {eventTypes} from 'Common/Constants';

export type SDKLauncherProps = {};
type SDKLauncherState = {
  launcherVisible: boolean,
  containerVisible: boolean,
};

export class SDKLauncher extends Component<SDKLauncherProps> {
  props: SDKLauncherProps;
  state: SDKLauncherState = {
    launcherVisible: false,
    containerVisible: false,
  };

  componentWillMount() {
    // When standalone is opened, we want to set buttons to have non-visible state.
    Postmaster.registerEventHandler(eventTypes._standaloneOpen, () =>
      this.handleChatVisibilityChange({visible: true}),
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

  handleChatVisibilityChange = (e: {visible: boolean}) =>
    this.setState({containerVisible: e.visible});

  handleLaunchButtonVisibilityChange = (e: {visible: boolean}) =>
    this.setState({launcherVisible: e.visible});

  render() {
    return (
      <div className="SDKLauncher">
        {getQuiqOptions().customLaunchButtons.length === 0 &&
        this.state.launcherVisible && (
          <ToggleChatButton open={this.state.containerVisible} onClick={handleLaunchButtonClick} />
        )}
        <SDKChatContainer />
      </div>
    );
  }
}

export default SDKLauncher;
