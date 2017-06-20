// @flow
import React from 'react';
import {inStandaloneMode, isIEorSafari} from 'utils/utils';
import {formatMessage} from 'utils/i18n';
import QUIQ, {openStandaloneMode} from 'utils/quiq';
import messages from 'messages';
import './styles/HeaderMenu.scss';

export type HeaderMenuProps = {
  onPop?: (fireEvent: boolean) => void,
  onMinimize?: (fireEvent: boolean) => void,
  /* eslint-disable react/no-unused-prop-types */
  onDock?: (fireEvent: boolean) => void,
  /* eslint-disable react/no-unused-prop-types */
};

const HeaderMenu = (props: HeaderMenuProps) => {
  const openChatInNewWindow = () => {
    openStandaloneMode(props.onPop, props.onDock);
  };

  return (
    <div className="HeaderMenu" style={{backgroundColor: QUIQ.COLOR}}>
      <div className="buttons">
        <i
          className={`fa fa-window-minimize icon`}
          title={formatMessage(messages.minimizeWindow)}
          onClick={inStandaloneMode() ? window.close : props.onMinimize}
        />
        {!isIEorSafari() &&
          <i
            className={`fa fa-${inStandaloneMode() ? 'window-restore' : 'window-maximize'} icon`}
            title={formatMessage(
              inStandaloneMode() ? messages.dockWindow : messages.openInNewWindow,
            )}
            onClick={inStandaloneMode() ? window.close : openChatInNewWindow}
          />}
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
