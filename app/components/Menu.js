// @flow
import React from 'react';
import {css} from 'emotion';
import styled from 'react-emotion';

type MenuItemType = {
  onClick: () => void,
  label: string,
  title?: string,
  id: string,
  icon?: {
    name: string,
    style?: Object,
  },
  style?: Object,
};

export type MenuProps = {
  items: Array<MenuItemType>,
  className?: string,
  containerStyle?: Object,
};

const hoverBackground = (
  normalBg: string,
  hoverBg: string,
  activeBg: string,
  selectedBg?: string,
  selected?: boolean,
) => css`
  transition: 0.15s ease-in-out all;
  background: ${selected ? selectedBg : normalBg};

  &:hover {
    background: ${selected ? selectedBg : hoverBg};
  }

  &:active {
    background: ${selected ? selectedBg : activeBg};
  }
`;

const MenuContainer = styled.div`
  @keyframes dropDownOpen {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  flex: 0 0 auto;
  z-index: 10;
  background: #fff;
  border: 1px solid #e2e3e5;
  color: darkgery;
  font-size: 15px;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.2);
  animation: dropDownOpen 0.3s 1;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.div`
  transition: 0.15s ease-in-out all;
  padding: 5px;
  flex: 0 0 auto;
  display: flex;

  ${hoverBackground('transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.25)')};
`;

const Icon = styled.i`margin-right: 5px;`;

const Text = styled.div``;

const Menu = (props: MenuProps) => {
  return (
    <MenuContainer className={props.className || ''} style={props.containerStyle}>
      {props.items.map(i => (
        <MenuItem onClick={i.onClick} key={i.id} title={i.title || i.label} style={i.style}>
          {i.icon && <Icon style={i.icon.style} className={`fa fa-fw fa-${i.icon.name}`} />}
          <Text>{i.label}</Text>
        </MenuItem>
      ))}
    </MenuContainer>
  );
};

export default Menu;
