// @flow
/** @jsx h */
import {Component, h} from 'preact';
import {eventTypes} from 'Common/Constants';
import ChatBubbleIcon from './ChatBubbleIcon';
import {getStyle, usingCustomLauncher} from 'Common/QuiqOptions';
import {getQuiqOptions} from 'Globals';
import * as Postmaster from 'Postmaster';
import {handleLaunchButtonClick} from 'managers/ButtonManager';
import './styles/ToggleChatButton.scss';

export type ToggleChatButtonProps = {};
type ToggleChatButtonState = {
  launcherVisible: boolean,
  containerVisible: boolean,
};
export class ToggleChatButton extends Component<ToggleChatButtonProps, ToggleChatButtonState> {
  props: ToggleChatButtonProps;
  state: ToggleChatButtonState = {
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
    const {colors, styles, isStorageEnabled, isSupportedBrowser} = getQuiqOptions();
    if (
      !isStorageEnabled ||
      !isSupportedBrowser ||
      usingCustomLauncher() ||
      !this.state.launcherVisible
    )
      return null;

    return (
      <button
        style={getStyle(styles.ToggleChatButton, {backgroundColor: colors.primary})}
        onClick={handleLaunchButtonClick}
        className="ToggleChatButton"
      >
        <ChatBubbleIcon visible={this.state.containerVisible} />
      </button>
    );
  }
}

export default ToggleChatButton;
