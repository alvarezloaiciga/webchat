// @flow
/** @jsx h */

import {h} from 'preact';
import styled from 'preact-emotion';

const InvitationBlurbContainer = styled.div`
  background-color: ${props => props.style.backgroundColor};
  color: #555;
  max-width: 300px;
  border-radius: 5px;
  box-shadow: 0 0 6px ${props => props.style.shadowColor};
  display: inline-block;
  padding: 10px 18px;
  position: relative;
  vertical-align: top;
  margin: 5px 20px 5px 45px;
  animation: 0.5s pop-in;

  &:before {
    background-color: ${props => props.style.backgroundColor};
    content: '\\00a0';
    display: block;
    height: 16px;
    position: absolute;
    bottom: 11px;
    width: 20px;
    transform: rotate(29deg) skew(-35deg);
    box-shadow: 2px -2px 2px 0 ${props => props.style.shadowColor};
    right: -9px;
  }

  @keyframes pop-in {
    0% {
      opacity: 0;
    }

    1% {
      opacity: 0;
      transform: scale(0.9) translateY(10px);
    }

    50% {
      opacity: 0.7;
      transform: scale(1.1) translateY(0px);
    }

    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

export type MessageBlurbProps = {
  text: string,
  style?: Object,
  className?: string,
};

export const InvitationBlurb = ({text, style, className}: MessageBlurbProps) => (
  <InvitationBlurbContainer className={`InvitationBlurb ${className || ''}`} style={style}>
    {text}
  </InvitationBlurbContainer>
);

export default InvitationBlurb;
