// @flow
import React from 'react';
import styled from 'react-emotion';

export type PrimaryMenuProps = {};

const PrimaryMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
`;

const PrimaryMenu = () => (
  <PrimaryMenuContainer className="PrimaryMenu">PrimaryMenu</PrimaryMenuContainer>
);

export default PrimaryMenu;
