// @flow
import React from 'react';
import styled from 'react-emotion';
import * as colors from 'colors';

export type PrimaryMenuProps = {};

const PrimaryMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
`;

const LineItem = styled.div``;

export class PrimaryMenu extends React.Component<PrimaryMenuProps> {
  props: PrimaryMenuProps;

  render() {
    return (
      <PrimaryMenuContainer className="PrimaryMenu">
        <LineItem />
      </PrimaryMenuContainer>
    );
  }
}

export default PrimaryMenu;
