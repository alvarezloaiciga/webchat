// @flow
declare var __DEV__: boolean;
import React from 'react';
import {isIE9, inStandaloneMode} from 'utils/utils';
import {formatMessage} from 'utils/i18n';
import QUIQ from 'utils/quiq';
import messages from 'messages';
import './styles/HeaderMenu.scss';

export type HeaderMenuProps = {
  onPop?: () => void,
  onMinimize?: () => void,
  /* eslint-disable react/no-unused-prop-types */
  onDock?: () => void,
  /* eslint-disable react/no-unused-prop-types */
};

let windowTimer: number;
// let windowHandle: ?
const HeaderMenu = (props: HeaderMenuProps) => {
  const openChatInNewWindow = () => {
    const width = 400;
    const height = 600;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;

    const standaloneWindow = window.open(
      `${__DEV__
        ? 'http://localhost:3000'
        : QUIQ.HOST}/app/webchat/standalone?QUIQ=${encodeURIComponent(JSON.stringify(QUIQ))}`,
      isIE9() ? '_blank' : 'quiq-standalone-webchat',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, copyhistory=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`,
    );
    standaloneWindow.focus();
    if (props.onPop) props.onPop();

    /*
     * Since we popped open webchat into a new window in standalone mode,
     * this instance now needs to start listening for if that new window closes.
     * If it does, we re-open this instance, since the user re-docked the standalone window
     */
    windowTimer = setInterval(() => {
      if (standaloneWindow.closed) {
        if (windowTimer) clearInterval(windowTimer);
        if (props.onDock) props.onDock();
      }
    }, 500);
  };

  return (
    <div className="HeaderMenu" style={{backgroundColor: QUIQ.COLOR}}>
      <div className="buttons">
        <i
          className={`fa fa-window-minimize icon`}
          title={formatMessage(messages.minimizeWindow)}
          onClick={inStandaloneMode() ? window.close : props.onMinimize}
        />
        <i
          className={`fa fa-${inStandaloneMode() ? 'window-restore' : 'window-maximize'} icon`}
          title={formatMessage(inStandaloneMode() ? messages.dockWindow : messages.openInNewWindow)}
          onClick={inStandaloneMode() ? window.close : openChatInNewWindow}
        />
        <svg
          className="icon"
          height="12"
          width="12"
          onClick={inStandaloneMode() ? window.close : props.onMinimize}
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

export default HeaderMenu;
