// @flow
import React from 'react';
import {connect} from 'react-redux';
import styled from 'react-emotion';
import {css} from 'emotion';
import {getStyle} from 'Common/QuiqOptions';
import {isValidEmail} from 'Common/Utils';
import QuiqChatClient from 'quiq-chat';
import {darken} from 'polished';
import {getConfiguration, getMessage} from 'reducers/chat';
import {setWindowScrollLockEnabled} from 'actions/chatActions';
import Input from 'components/Input';
import Icon from 'core-ui/components/Icon';
import {times, check} from 'Icons';
import {UserEmailKey, intlMessageTypes} from 'Common/Constants';
import type {ChatConfiguration, ChatState} from 'Common/types';

const EmailInputContainer = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: auto;
  background: #fff;
`;

const ErrorStyle = css`
  -webkit-appearance: none;
  box-shadow: inset 0px 0px 7px red;
`;

const InputStyle = error => css`
  display: flex;
  flex: 1 1 auto;

  & input {
    height: 100%;
    flex: 1 0 auto;
    border: 2px solid transparent;
    padding: 10px;
    border: none;
    font-size: 14px;
    line-height: 1.3em;
    margin-right: 10px;
    outline: none;
    ${error ? ErrorStyle : ''};
  }
`;

const IconCSS = (color: string) => css`
  flex: 0 0 auto;
  transition: 0.15s ease-in-out all;
  margin-right: 5px;
  cursor: pointer;

  &:hover {
    color: ${darken(0.15, color)};
  }
`;

export type EmailInputProps = {
  onCancel: () => void,
  onSubmit: () => void, // eslint-disable-line react/no-unused-prop-types
  configuration: ChatConfiguration,
  setWindowScrollLockEnabled: (enabled: boolean) => void,
};

type EmailInputState = {
  error: boolean,
};

export class EmailInput extends React.Component<EmailInputProps, EmailInputState> {
  props: EmailInputProps;
  state: EmailInputState = {
    error: false,
  };
  input: any;

  getInitialValue = () => {
    try {
      return atob(
        localStorage.getItem(`${UserEmailKey}_${this.props.configuration.contactPoint}`) || '',
      );
    } catch (e) {
      return '';
    }
  };

  submit = () => {
    const value = this.input.getValue();
    let timezone;
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {} // eslint-disable-line no-empty

    if (isValidEmail(value)) {
      QuiqChatClient.emailTranscript({
        email: value.trim(),
        originUrl: this.props.configuration.host,
        timezone,
      });
      this.props.onSubmit();
    } else {
      this.setState({error: true});
    }
  };

  render() {
    return (
      <EmailInputContainer
        style={getStyle(this.props.configuration.styles.EmailTranscriptInputContainer)}
        className="EmailInput"
      >
        <Input
          ref={r => {
            this.input = r;
          }}
          initialValue={this.getInitialValue()}
          className={InputStyle(this.state.error)}
          onSubmit={this.submit}
          onFocus={() => this.props.setWindowScrollLockEnabled(false)}
          onBlur={() => this.props.setWindowScrollLockEnabled(true)}
          placeholder={getMessage(intlMessageTypes.emailTranscriptInputPlaceholder)}
          style={getStyle(this.props.configuration.styles.EmailTranscriptInput, {
            fontFamily: this.props.configuration.fontFamily,
          })}
          value={null}
          autoFocus
        />
        <Icon
          className={IconCSS('red')}
          style={getStyle(this.props.configuration.styles.EmailTranscriptInputCancelButton)}
          title={getMessage(intlMessageTypes.emailTranscriptInputCancelTooltip)}
          onClick={this.props.onCancel}
          color="red"
          icon={times}
        />
        <Icon
          className={IconCSS('green')}
          style={getStyle(this.props.configuration.styles.EmailTranscriptInputSubmitButton)}
          title={getMessage(intlMessageTypes.emailTranscriptInputSubmitTooltip)}
          onClick={this.submit}
          data-test="submitButton"
          color="green"
          icon={check}
        />
      </EmailInputContainer>
    );
  }
}

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {setWindowScrollLockEnabled},
)(EmailInput);
