// @flow
/** @jsx h */
import {h} from 'preact';
import {getStyle} from 'Common/QuiqOptions';
import {getQuiqOptions} from 'Globals';
import {displayModes} from 'Common/Constants';
import InvitationBlurb from './InvitationBlurb';
import styled, {css} from 'preact-emotion';

export type ToggleChatButtonProps = {
  onClick: () => void,
  open: boolean,
  invitationBlurbText: string,
};

const StyledInvitationBubble = styled(InvitationBlurb)`
  position: fixed;
  right: 90px;
  bottom: 20px;
`;

const ToggleChatButtonStyle = css`
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  box-sizing: border-box;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 100%;
  color: #fff;
  fill: #fff;
  cursor: pointer;
  transition: 0.15s ease-in-out all;
  box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;

  // Leave these in, some customer sites have default stylings for buttons that try to override these
  margin: 0;
  padding: 0;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px;
  }

  &:focus {
    outline: none;
  }

  svg {
    fill: #fff;
    flex: 1 1 auto;
  }
`;

const ToggleChatButton = ({onClick, open, invitationBlurbText}: ToggleChatButtonProps) => {
  const {styles, colors, displayMode} = getQuiqOptions();

  return (
    <div>
      <button
        className={`ToggleChatButton ${ToggleChatButtonStyle}`}
        onClick={onClick}
        style={getStyle(styles.ToggleChatButton, {backgroundColor: colors.primary})}
      >
        <svg
          style={getStyle(styles.ToggleChatButtonIcon)}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          {open && displayMode !== displayModes.UNDOCKED ? (
            <path d="M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z" />
          ) : (
            <path d="M12 1c-6.628 0-12 4.573-12 10.213 0 2.39.932 4.591 2.427 6.164l-2.427 5.623 7.563-2.26c9.495 2.598 16.437-3.251 16.437-9.527 0-5.64-5.372-10.213-12-10.213z" />
          )}
        </svg>
      </button>
      {invitationBlurbText && (
        <StyledInvitationBubble
          text={invitationBlurbText}
          style={getStyle(styles.InvitationBlurb, {
            backgroundColor: 'white',
            shadowColor: '#B2B2B2',
          })}
        />
      )}
    </div>
  );
};

export default ToggleChatButton;
