// @flow
/** @jsx h */
import {h, Component} from 'preact';
import {isStorageEnabled, isSupportedBrowser} from 'Common/Utils';
import {getStyle} from 'Common/QuiqOptions';
import {getQuiqOptions} from 'Globals';
import {oldSchoolGetAgentsAvailable} from 'managers/ButtonManager';
import ToggleChatButton from './ToggleChatButton';
import {css} from 'preact-emotion';

export type NonChatProps = {};
type NonChatState = {
  buttonVisible: boolean,
  containerVisible: boolean,
};

const NonChatContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
  color: white;
  position: fixed;
  bottom: 90px;
  right: 25px;
  max-width: 300px;
  border-radius: 5px;
`;

export class NonChat extends Component<NonChatProps, NonChatState> {
  props: NonChatProps;
  state: NonChatState = {
    buttonVisible: false,
    containerVisible: false,
  };
  agentsAvailableInterval: IntervalID;

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
        className={`NonChatContainer ${NonChatContainerStyle}`}
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
      <div className="NonChat" id="quiqWebChat">
        {this.state.containerVisible && this.renderContainer()}
        <ToggleChatButton
          open={this.state.containerVisible}
          onClick={() =>
            this.setState((prevState: NonChatState) => ({
              containerVisible: !prevState.containerVisible,
            }))
          }
        />
      </div>
    );
  }
}

export default NonChat;
