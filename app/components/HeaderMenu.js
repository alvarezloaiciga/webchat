// @flow
import React, {Component} from 'react';
import {inStandaloneMode} from 'Common/Utils';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import {destructApp} from 'utils/domUtils';
import {messageTypes, ChatInitializedState} from 'Common/Constants';
import {setChatContainerHidden} from 'actions/chatActions';
import {connect} from 'react-redux';
import {standaloneOpen} from 'services/Postmaster';
import type {ChatState, ChatInitializedStateType} from 'types';
import './styles/HeaderMenu.scss';

export type HeaderMenuProps = {
  initializedState: ChatInitializedStateType,
  setChatContainerHidden: (chatContainerHidden: boolean) => void, // eslint-disable-line react/no-unused-prop-types
};

export type HeaderMenuState = {
  openingWindowExists?: boolean,
};

export class HeaderMenu extends Component<HeaderMenuProps, HeaderMenuState> {
  props: HeaderMenuProps;
  state: HeaderMenuState = {
    openingWindowExists: true,
  };
  parentWindowExistenceCheckInterval: ?number;

  componentDidMount() {
    if (inStandaloneMode()) {
      this.parentWindowExistenceCheckInterval = setInterval(this.updateParentWindowExistence, 100);
    }
  }

  componentWillUnmount() {
    if (this.parentWindowExistenceCheckInterval) {
      clearInterval(this.parentWindowExistenceCheckInterval);
      this.parentWindowExistenceCheckInterval = null;
    }
  }

  minimize = () => {
    this.props.setChatContainerHidden(true);
  };

  popChat = () => {
    standaloneOpen();
    destructApp();
  };

  updateParentWindowExistence = () => {
    if (!window.opener || window.opener.closed) {
      this.setState({openingWindowExists: false});
      if (this.parentWindowExistenceCheckInterval) {
        clearInterval(this.parentWindowExistenceCheckInterval);
        this.parentWindowExistenceCheckInterval = null;
      }
    }
  };

  render() {
    const {colors, styles, fontFamily} = quiqOptions;

    const headerStyle = getStyle(styles.HeaderMenu, {backgroundColor: colors.primary});
    const titleTextStyle = getStyle(styles.TitleText, {fontFamily});

    return (
      <div className="HeaderMenu" style={headerStyle}>
        <div className="title">
          <span style={titleTextStyle}>{getMessage(messageTypes.titleText)}</span>
        </div>
        <div className="buttons">
          {(this.state.openingWindowExists || !inStandaloneMode()) && (
            <i
              className={`fa fa-window-minimize icon`}
              title={getMessage(messageTypes.minimizeWindowTooltip)}
              onClick={inStandaloneMode() ? window.close : this.minimize}
            />
          )}
          {this.props.initializedState !== ChatInitializedState.BURNED &&
          (!inStandaloneMode() || this.state.openingWindowExists) && (
            <i
              className={`fa fa-${inStandaloneMode() ? 'window-restore' : 'window-maximize'} icon`}
              title={getMessage(
                inStandaloneMode()
                  ? messageTypes.dockWindowTooltip
                  : messageTypes.openInNewWindowTooltip,
              )}
              onClick={inStandaloneMode() ? window.close : this.popChat}
            />
          )}
          <i
            className={`fa fa-times icon`}
            title={getMessage(messageTypes.closeWindowTooltip)}
            onClick={inStandaloneMode() ? window.close : this.minimize}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  (state: ChatState) => ({
    initializedState: state.initializedState,
  }),
  {setChatContainerHidden},
)(HeaderMenu);
