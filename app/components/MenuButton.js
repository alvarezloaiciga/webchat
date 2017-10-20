// @flow
import React from 'react';
import styled from 'react-emotion';
import {getDisplayString} from 'Common/i18n';
import {defineMessages} from 'react-intl';
import {css} from 'emotion'; // eslint-disable-line no-unused-vars
import ClickOutside from 'react-click-outside-component';
import type {IntlMessage} from 'types';

export type MenuButtonProps = {
  children: any,
  buttonStyles?: {[key: string]: string},
  iconStyles?: {[key: string]: string},
  buttonText?: string | IntlMessage,
  title: string | IntlMessage,
  icon: string,
  menuPosition: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left',
  className: string,
  offset: {
    vertical: string, // eslint-disable-line react/no-unused-prop-types
    horizontal: string, // eslint-disable-line react/no-unused-prop-types
  },
};

const MenuButtonContainer = css`
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
  cursor: pointer;
`;

const MenuButtonIcon = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 5px 12px;
`;

/* eslint-disable no-confusing-arrow */
const PrimaryMenuContainer = styled.div`
  position: absolute;
  ${props =>
    props.position.includes('top') ? `bottom: ${props.offset.vertical}` : 'bottom: auto'};
  ${props => (props.position.includes('bottom') ? `top: ${props.offset.vertical}` : 'top: auto')};
  ${props =>
    props.position.includes('right') ? `left: ${props.offset.horizontal}` : 'left: auto'};
  ${props =>
    props.position.includes('left') ? `right: ${props.offset.horizontal}` : 'right: auto'};
`;
/* eslint-disable no-confusing-arrow */

const ButtonText = styled.div`margin-right: 10px;`;

type MenuButtonState = {
  menuVisible: boolean,
};

const messages = defineMessages({
  buttonTitle: {
    id: 'buttonTitle',
    description: 'Message to display when user hovers over the Menu Button',
    defaultMessage: 'Open Menu',
  },
});

export class MenuButton extends React.Component<MenuButtonProps, MenuButtonState> {
  props: MenuButtonProps;
  state: MenuButtonState = {
    menuVisible: false,
  };
  static defaultProps = {
    title: messages.buttonTitle,
    menuPosition: 'top-right',
    icon: 'plus',
    className: '',
    offset: {
      vertical: '40px',
      horizontal: '15px',
    },
  };
  menuButton: any;

  toggleMenu = () => {
    this.setState((prevState: MenuButtonState) => ({menuVisible: !prevState.menuVisible}));
  };

  handleClickOutside = (e: SyntheticMouseEvent<*>) => {
    if (this.menuButton && this.menuButton.contains(e.target)) {
      return;
    }

    this.toggleMenu();
  };

  render() {
    return (
      <div
        style={this.props.buttonStyles}
        className={`${this.props.className} MenuButton ${MenuButtonContainer}`}
      >
        {this.state.menuVisible && (
          <ClickOutside onClickOutside={this.handleClickOutside}>
            <PrimaryMenuContainer offset={this.props.offset} position={this.props.menuPosition}>
              {this.props.children}
            </PrimaryMenuContainer>
          </ClickOutside>
        )}
        <MenuButtonIcon
          innerRef={r => {
            this.menuButton = r;
          }}
          onClick={this.toggleMenu}
          title={getDisplayString(this.props.title)}
        >
          {this.props.buttonText && (
            <ButtonText>{getDisplayString(this.props.buttonText)}</ButtonText>
          )}
          <i style={this.props.iconStyles} className={`fa fa-${this.props.icon} openIcon`} />
        </MenuButtonIcon>
      </div>
    );
  }
}

export default MenuButton;
