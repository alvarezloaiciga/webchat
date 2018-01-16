// @flow
import React from 'react';
import {connect} from 'react-redux';
import styled from 'react-emotion';
import moment from 'moment-timezone';
import {css} from 'emotion';
import {getStyle} from 'Common/QuiqOptions';
import {isValidEmail} from 'Common/Utils';
import QuiqChatClient from 'quiq-chat';
import {darken} from 'polished';
import {getConfiguration, getMessage} from 'reducers/chat';
import {setWindowScrollLockEnabled} from 'actions/chatActions';
import Input from 'core-ui/components/Input';
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
  margin-right: 10px;
  color: ${color};
  cursor: pointer;

  &:hover {
    color: ${darken(0.15, color)};
  }
`;

const CancelButton = styled.i`
  ${IconCSS('red')};
`;

const SubmitButton = styled.i`
  ${IconCSS('green')};
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
    if (isValidEmail(value)) {
      QuiqChatClient.emailTranscript({
        email: value.trim(),
        originUrl: this.props.configuration.host,
        timezone: moment.tz.guess(),
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
        <CancelButton
          style={getStyle(this.props.configuration.styles.EmailTranscriptInputCancelButton)}
          title={getMessage(intlMessageTypes.emailTranscriptInputCancelTooltip)}
          onClick={this.props.onCancel}
          className={`fa fa-times`}
        />
        <SubmitButton
          style={getStyle(this.props.configuration.styles.EmailTranscriptInputSubmitButton)}
          title={getMessage(intlMessageTypes.emailTranscriptInputSubmitTooltip)}
          onClick={this.submit}
          data-test="submitButton"
          className={`fa fa-check`}
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
