// @flow
/** @jsx h */
import {h} from 'preact';
import ToggleChatButton from './ToggleChatButton';
import SDKChatContainer from './SDKChatContainer';
import {getQuiqOptions} from 'Globals';

const SDKLauncher = () => (
  <div>
    {getQuiqOptions().customLaunchButtons.length === 0 && <ToggleChatButton />}
    <SDKChatContainer />
  </div>
);

export default SDKLauncher;
