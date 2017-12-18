// @flow
import React, {Component} from 'react';
import {inStandaloneMode} from 'Common/Utils';
import {getStyle} from 'Common/QuiqOptions';
import {destructApp} from 'utils/domUtils';
import {intlMessageTypes, ChatInitializedState, displayModes} from 'Common/Constants';
import {setChatContainerHidden} from 'actions/chatActions';
import {connect} from 'react-redux';
import {standaloneOpen} from 'services/Postmaster';
import {getMessage, getConfiguration} from 'reducers/chat';
import type {ChatState, ChatInitializedStateType, ChatConfiguration} from 'types';
import './styles/HeaderMenu.scss';

export type HeaderMenuProps = {
  initializedState: ChatInitializedStateType,
  setChatContainerHidden: (chatContainerHidden: boolean) => void, // eslint-disable-line react/no-unused-prop-types
  configuration: ChatConfiguration,
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

  renderButtons = () => (
    <div className="buttons">
      {(!inStandaloneMode() || this.state.openingWindowExists) &&
        this.props.configuration.displayMode !== displayModes.UNDOCKED && (
          <i
            className={`fa fa-window-minimize icon`}
            title={getMessage(intlMessageTypes.minimizeWindowTooltip)}
            onClick={inStandaloneMode() ? window.close : this.minimize}
          />
        )}

      {this.props.initializedState !== ChatInitializedState.BURNED &&
        (!inStandaloneMode() || this.state.openingWindowExists) &&
        this.props.configuration.displayMode === displayModes.EITHER && (
          <i
            className={`fa fa-${inStandaloneMode() ? 'window-restore' : 'window-maximize'} icon`}
            title={getMessage(
              inStandaloneMode()
                ? intlMessageTypes.dockWindowTooltip
                : intlMessageTypes.openInNewWindowTooltip,
            )}
            onClick={inStandaloneMode() ? window.close : this.popChat}
          />
        )}
      <i
        className={`fa fa-times icon`}
        title={getMessage(intlMessageTypes.closeWindowTooltip)}
        onClick={inStandaloneMode() ? window.close : this.minimize}
      />
    </div>
  );

  render() {
    const {colors, styles, fontFamily} = this.props.configuration;

    const headerStyle = getStyle(styles.HeaderMenu, {backgroundColor: colors.primary});
    const titleTextStyle = getStyle(styles.TitleText, {fontFamily});

    return (
      <div className="HeaderMenu" style={headerStyle}>
        <div className="title">
          <span style={titleTextStyle}>{getMessage(intlMessageTypes.titleText)}</span>
        </div>
        {!this.props.configuration.demoMode && this.renderButtons()}
      </div>
    );
  }
}

export default connect(
  (state: ChatState) => ({
    initializedState: state.initializedState,
    configuration: getConfiguration(state),
  }),
  {setChatContainerHidden},
)(HeaderMenu);
