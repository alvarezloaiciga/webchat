// @flow
import React from 'react';
import {inStandaloneMode, isIEorSafari} from 'utils/utils';
import {formatMessage} from 'utils/i18n';
import QUIQ, {openStandaloneMode} from 'utils/quiq';
import messages from 'messages';
import {setChatHidden, setChatPopped} from 'actions/chatActions';
import {connect} from 'react-redux';
import {getChatClient} from '../ChatClient';
import './styles/HeaderMenu.scss';

export type HeaderMenuProps = {
  setChatHidden: (hidden: boolean) => void, // eslint-disable-line react/no-unused-prop-types
  setChatPopped: (popped: boolean) => void, // eslint-disable-line react/no-unused-prop-types
};

export const HeaderMenu = (props: HeaderMenuProps) => {
  const minimize = () => {
    props.setChatHidden(true);
    getChatClient().leaveChat();
  };

  const popChat = () => {
    openStandaloneMode({
      onPop: () => {
        props.setChatPopped(true);
      },
      onFocus: () => {
        props.setChatPopped(true);
      },
      onDock: () => {
        props.setChatPopped(false);
      },
    });
  };

  return (
    <div className="HeaderMenu" style={{backgroundColor: QUIQ.COLOR}}>
      <div className="buttons">
        {!isIEorSafari() &&
          <i
            className={`fa fa-window-minimize icon`}
            title={formatMessage(messages.minimizeWindow)}
            onClick={inStandaloneMode() ? window.close : minimize}
          />}
        {!isIEorSafari() &&
          <i
            className={`fa fa-${inStandaloneMode() ? 'window-restore' : 'window-maximize'} icon`}
            title={formatMessage(
              inStandaloneMode() ? messages.dockWindow : messages.openInNewWindow,
            )}
            onClick={inStandaloneMode() ? window.close : popChat}
          />}
        <svg
          className="icon"
          height="12"
          width="12"
          onClick={inStandaloneMode() ? window.close : minimize}
          title={formatMessage(messages.closeWindow)}
        >
          <line className="cross" x1="1" y1="1" x2="11" y2="11" strokeWidth="2" stroke="white" />
          <line className="cross" x1="11" y1="1" x2="1" y2="11" strokeWidth="2" stroke="white" />
          X
        </svg>
      </div>
    </div>
  );
};

export default connect(null, {setChatHidden, setChatPopped})(HeaderMenu);
