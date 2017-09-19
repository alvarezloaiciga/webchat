// @flow
import React from 'react';
import ToggleChatButton from './ToggleChatButton';
import SDKChatContainer from './SDKChatContainer';
import {usingCustomLauncher} from 'Common/QuiqOptions';

const SDKLauncher = () => (
  <div>
    {!usingCustomLauncher() && <ToggleChatButton />}
    <SDKChatContainer />
  </div>
);

export default SDKLauncher;
