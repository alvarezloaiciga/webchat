// @flow
import React, {Component} from 'react';
import {getStyle} from 'Common/QuiqOptions';
import {intlMessageTypes, displayModes} from 'Common/Constants';
import {setChatContainerHidden} from 'actions/chatActions';
import {connect} from 'react-redux';
import {getMessage, getConfiguration} from 'reducers/chat';
import type {ChatState, ChatConfiguration} from 'types';
import './styles/PopupHeaderMenu.scss';

export type PopupHeaderMenuProps = {
  setChatContainerHidden: (chatContainerHidden: boolean) => void, // eslint-disable-line react/no-unused-prop-types
  configuration: ChatConfiguration,
};

export type PopupHeaderMenuState = {
  openingWindowExists?: boolean,
};

const windowClose = (
  <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
    <rect
      transform="translate(896.177670, 896.177670) rotate(315.000000) translate(-896.177670, -896.177670) "
      x="793.395924"
      y="-135.491124"
      width="205.563492"
      height="2063.33759"
      rx="35"
    />
    <rect
      transform="translate(896.177670, 896.177670) rotate(45.000000) translate(-896.177670, -896.177670) "
      x="793.395924"
      y="-135.491124"
      width="205.563492"
      height="2063.33759"
      rx="35"
    />
  </svg>
);

const windowRestore = (
  <svg viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M256 1536h768v-512h-768v512zm1024-512h512v-768h-768v256h96q66 0 113 47t47 113v352zm768-864v960q0 66-47 113t-113 47h-608v352q0 66-47 113t-113 47h-960q-66 0-113-47t-47-113v-960q0-66 47-113t113-47h608v-352q0-66 47-113t113-47h960q66 0 113 47t47 113z"
      fill="#fff"
    />
  </svg>
);

export class PopupHeaderMenu extends Component<PopupHeaderMenuProps, PopupHeaderMenuState> {
  props: PopupHeaderMenuProps;
  state: PopupHeaderMenuState = {
    openingWindowExists: true,
  };
  parentWindowExistenceCheckInterval: ?number;

  componentDidMount() {
    this.parentWindowExistenceCheckInterval = setInterval(this.updateParentWindowExistence, 100);
  }

  componentWillUnmount() {
    if (this.parentWindowExistenceCheckInterval) {
      clearInterval(this.parentWindowExistenceCheckInterval);
      this.parentWindowExistenceCheckInterval = null;
    }
  }

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
      {this.state.openingWindowExists &&
      this.props.configuration.displayMode !== displayModes.UNDOCKED ? (
        <button
          className="icon"
          data-test="closeChatButton"
          style={getStyle(this.props.configuration.styles.HeaderMenuIcons)}
          title={getMessage(intlMessageTypes.minimizeWindowTooltip)}
          onClick={window.close}
        >
          {windowRestore}
        </button>
      ) : (
        <button
          className="icon"
          data-test="closeChatButton"
          style={getStyle(this.props.configuration.styles.HeaderMenuIcons)}
          title={getMessage(intlMessageTypes.closeWindowTooltip)}
          onClick={window.close}
        >
          {windowClose}
        </button>
      )}
    </div>
  );

  render() {
    const {colors, styles, fontFamily} = this.props.configuration;

    const headerStyle = getStyle(styles.HeaderMenu, {backgroundColor: colors.primary});
    const titleTextStyle = getStyle(styles.TitleText, {fontFamily});

    return (
      <div className="PopupHeaderMenu" style={headerStyle}>
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
    configuration: getConfiguration(state),
  }),
  {setChatContainerHidden},
)(PopupHeaderMenu);
