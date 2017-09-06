// @flow
import React from 'react';
import {inStandaloneMode} from 'Common/Utils';
import quiqOptions, {getStyle, getMessage} from 'utils/quiq';
import {destructApp} from 'utils/domUtils';
import {messageTypes, ChatInitializedState} from 'Common/Constants';
import {setChatContainerHidden} from 'actions/chatActions';
import {connect} from 'react-redux';
import QuiqChatClient from 'quiq-chat';
import {standaloneOpen} from 'services/MalfunctionJunction';
import type {ChatState, ChatInitializedStateType} from 'types';
import './styles/HeaderMenu.scss';

export type HeaderMenuProps = {
  initializedState: ChatInitializedStateType,
  setChatContainerHidden: (chatContainerHidden: boolean) => void, // eslint-disable-line react/no-unused-prop-types
};

export const HeaderMenu = (props: HeaderMenuProps) => {
  const minimize = () => {
    props.setChatContainerHidden(true);
    QuiqChatClient.leaveChat();
  };

  const popChat = () => {
    standaloneOpen();
    destructApp();
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
        {props.initializedState !== ChatInitializedState.BURNED &&
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
  {setChatContainerHidden},
)(HeaderMenu);
