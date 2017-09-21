// @flow
/** @jsx h */
import {h, Component} from 'preact';
import {isStorageEnabled, isSupportedBrowser} from 'Common/Utils';
import {getStyle} from 'Common/QuiqOptions';
import {getQuiqOptions} from 'Globals';
import {oldSchoolGetAgentsAvailable} from 'managers/ButtonManager';
import ToggleChatButton from './ToggleChatButton';
import './styles/NonChat.scss';

export type NonChatProps = {};
type NonChatState = {
  buttonVisible: boolean,
  containerVisible: boolean,
};

export class NonChat extends Component<NonChatProps, NonChatState> {
  props: NonChatProps;
  state: NonChatState = {
    buttonVisible: false,
    containerVisible: false,
  };
  agentsAvailableInterval: number;

  componentWillMount() {
    oldSchoolGetAgentsAvailable(available => {
      this.setState({buttonVisible: available});
    });
  }

  componentWillUnmount() {
    clearInterval(this.agentsAvailableInterval);
  }

  renderUnsupportedBrowser = () => {
    const {messages} = getQuiqOptions();
    if (!messages.unsupportedBrowser) return null;

    return <div className="unsupportedBrowserMessage">{messages.unsupportedBrowser}</div>;
  };

  renderStorageDisabled = () => {
    const {messages} = getQuiqOptions();
    if (!messages.storageDisabled) return null;

    return <div className="storageDisabledMessage">{messages.storageDisabled}</div>;
  };

  renderContainer = () => {
    const {styles, colors, fontFamily, messages} = getQuiqOptions();
    let content = null;
    if (messages.storageDisabled && !isStorageEnabled()) content = this.renderStorageDisabled();
    if (messages.unsupportedBrowser && !isSupportedBrowser())
      content = this.renderUnsupportedBrowser();

    return (
      <div
        style={getStyle(styles.NonChat, {fontFamily, backgroundColor: colors.primary})}
        className="NonChatContainer"
      >
        {content}
      </div>
    );
  };

  shouldHide = () => {
    const {messages} = getQuiqOptions();

    if (!this.state.buttonVisible) return true;

    if (
      (messages.unsupportedBrowser && !isSupportedBrowser()) ||
      (messages.storageDisabled && !isStorageEnabled())
    )
      return false;

    return true;
  };

  render() {
    if (this.shouldHide()) return null;

    return (
      <div className="NonChat">
        {this.state.containerVisible && this.renderContainer()}
        <ToggleChatButton
          open={this.state.containerVisible}
          onClick={() =>
            this.setState((prevState: NonChatState) => ({
              containerVisible: !prevState.containerVisible,
            }))}
        />
      </div>
    );
  }
}

export default NonChat;
