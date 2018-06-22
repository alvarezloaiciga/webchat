import {keyframes} from 'emotion';

export const chatDialogOpen = keyframes`
  0% {
    opacity: 0;
    max-height: 500px;
    transform: scale(0.9);
  }
  50% {
    opacity: 0.65;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    max-height: 600px;
    transform: scale(1);
  }
`;

export const messageEnter = keyframes`
  0% {
    opacity: 0;
    top: 5px;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    top: 0;
    transform: scale(1);
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
