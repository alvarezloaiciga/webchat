// @flow
import React from 'react';
import {inStandaloneMode} from 'Common/Utils';
import quiqOptions, {openStandaloneMode, getStyle, getMessage} from 'utils/quiq';
import {messageTypes, ChatInitializedState} from 'Common/Constants';
import {setChatContainerHidden, setChatInitialized} from 'actions/chatActions';
import {connect} from 'react-redux';
import QuiqChatClient from 'quiq-chat';
import {standaloneOpen} from 'services/MalfunctionJunction';
import type {ChatState, ChatInitializedStateType} from 'types';
import './styles/HeaderMenu.scss';

export type HeaderMenuProps = {
  initializedState: ChatInitializedStateType,
  setChatInitialized: (initializedState: ChatInitializedStateType) => void,
  setChatContainerHidden: (chatContainerHidden: boolean) => void, // eslint-disable-line react/no-unused-prop-types
};

export const HeaderMenu = (props: HeaderMenuProps) => {
  const minimize = () => {
    props.setChatContainerHidden(true);
    QuiqChatClient.leaveChat();
  };

  const popChat = () => {
    getChatClient().stop();
    props.setChatInitialized(ChatInitializedState.SLEEPING);
    standaloneOpen();
  };

  const {colors, styles} = quiqOptions;

  const headerStyle = getStyle(styles.HeaderMenu, {backgroundColor: colors.primary});

  return (
    <div className="HeaderMenu" style={headerStyle}>
      <div className="buttons">
        <i
          className={`fa fa-window-minimize icon`}
          title={getMessage(messageTypes.minimizeWindowTooltip)}
          onClick={inStandaloneMode() ? window.close : minimize}
        />
        {false &&
          props.initializedState !== ChatInitializedState.BURNED &&
          <i
            className={`fa fa-${inStandaloneMode() ? 'window-restore' : 'window-maximize'} icon`}
            title={getMessage(
              inStandaloneMode()
                ? messageTypes.dockWindowTooltip
                : messageTypes.openInNewWindowTooltip,
            )}
            onClick={inStandaloneMode() ? window.close : popChat}
          />}
        <i
          className={`fa fa-times icon`}
          title={getMessage(messageTypes.closeWindowTooltip)}
          onClick={inStandaloneMode() ? window.close : minimize}
        />
      </div>
    </div>
  );
};

export default connect(
  (state: ChatState) => ({
    initializedState: state.initializedState,
  }),
  {setChatContainerHidden, setChatInitialized},
)(HeaderMenu);
