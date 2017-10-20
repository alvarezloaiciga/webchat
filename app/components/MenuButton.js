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
  disabled?: boolean,
  menuPosition: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left',
  className: string,
  offset: {
    vertical: string, // eslint-disable-line react/no-unused-prop-types
    horizontal: string, // eslint-disable-line react/no-unused-prop-types
  },
  closeOnChildClick: boolean,
  keepChildrenMounted: boolean,
};

const MenuButtonContainer = css`
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  align-items: center;
  position: relative;
  outline: none;
  user-select: none;
`;

const MenuButtonIcon = styled.div`
  ${({disabled}) => (disabled ? 'cursor: default' : 'cursor: pointer')};
  ${({disabled}) => (disabled ? 'opacity: .5' : 'opacity: 1')};
  flex: 1 0 auto;
  max-width: 100%; // Hack for IE
  padding: 5px 12px;
`;

/* eslint-disable no-confusing-arrow */
const PrimaryMenuContainer = styled.div`
  position: absolute;
  ${props => (props.visible ? 'display: flex' : 'display: none')};
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
    icon: 'bars',
    className: '',
    offset: {
      vertical: '40px',
      horizontal: '15px',
    },
    closeOnChildClick: true,
    keepChildrenMounted: false,
  };
  menuButton: any;

  toggleMenu = () => {
    if (!this.state.menuVisible && this.props.disabled) return;

    this.setState((prevState: MenuButtonState) => ({menuVisible: !prevState.menuVisible}));
  };

  handleClickOutside = (e: SyntheticMouseEvent<*>) => {
    if (this.menuButton && this.menuButton.contains(e.target)) {
      return;
    }

    this.toggleMenu();
  };

  handleChildClick = () => {
    if (this.props.closeOnChildClick) this.toggleMenu();
  };

  render() {
    return (
      <div
        style={this.props.buttonStyles}
        className={`${this.props.className} MenuButton ${MenuButtonContainer}`}
      >
        {(this.state.menuVisible || this.props.keepChildrenMounted) && (
          <ClickOutside onClickOutside={this.handleClickOutside}>
            <PrimaryMenuContainer
              onClick={this.handleChildClick}
              offset={this.props.offset}
              position={this.props.menuPosition}
              visible={this.state.menuVisible}
            >
              {this.props.children}
            </PrimaryMenuContainer>
          </ClickOutside>
        )}
        <MenuButtonIcon
          disabled={this.props.disabled}
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
