// @flow
import React from 'react';
import styled from 'react-emotion';
import moment from 'moment-timezone';
import {css} from 'emotion';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import QuiqChatClient from 'quiq-chat';
import {darken} from 'polished';
import {UserEmailKey, messageTypes} from 'Common/Constants';

const EmailInputContainer = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: auto;
  background: #fff;
`;

const ErrorStyle = css`
  border: 2px solid red;
  outline: thick none;
`;

const Input = styled.input`
  flex: 1 1 auto;
  border: 2px solid transparent;
  padding: 10px;
  border: none;
  font-size: 14px;
  line-height: 1.3em;
  margin-right: 10px;
  outline: none;
  user-select: none;
  ${props => (props.error ? ErrorStyle : '')};
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

const CancelButton = styled.i`${IconCSS('red')};`;

const SubmitButton = styled.i`${IconCSS('green')};`;

// Taken from http://emailregex.com/ - RFC-5322 compliant. 99.99% accurate
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const {fontFamily, styles, host} = quiqOptions;

export type EmailInputProps = {
  onCancel: () => void,
  onSubmit: () => void, // eslint-disable-line react/no-unused-prop-types
};

type EmailInputState = {
  error: boolean,
  value: string,
};

const getInitialValue = () => {
  try {
    return atob(localStorage.getItem(UserEmailKey) || '');
  } catch (e) {
    return '';
  }
};

export class EmailInput extends React.Component<EmailInputProps, EmailInputState> {
  props: EmailInputProps;
  state: EmailInputState = {
    error: false,
    value: getInitialValue(),
  };
  input: any;

  componentDidMount() {
    // AutoFocus Input
    setTimeout(() => {
      if (this.input) this.input.focus();
      // Reset Input so cursor is at end of pre-populated input
      if (this.state.value) {
        const value = this.state.value;
        this.setState({value: ''}, () => {
          this.setState({value});
        });
      }
    }, 200);
  }

  submit = () => {
    if (emailRegex.test(this.state.value)) {
      QuiqChatClient.emailTranscript({
        email: this.state.value.trim(),
        originUrl: host,
        timezone: moment.tz.guess(),
      });
      this.props.onSubmit();
    } else {
      this.setState({error: true});
    }
  };

  handleKeyDown = (e: SyntheticInputEvent<>) => {
    if (e.keyCode === 13) {
      this.submit();
    }
  };

  handleInputChange = (e: SyntheticInputEvent<>) => {
    this.setState({value: e.target.value});
  };

  render() {
    return (
      <EmailInputContainer
        style={getStyle(styles.EmailTranscriptInputContainer)}
        className="EmailInput"
      >
        <Input
          innerRef={r => {
            this.input = r;
          }}
          value={this.state.value}
          error={this.state.error}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder={getMessage(messageTypes.emailTranscriptInputPlaceholder)}
          style={getStyle(styles.EmailTranscriptInput, {
            fontFamily,
          })}
        />
        <CancelButton
          style={getStyle(styles.EmailTranscriptInputCancelButton)}
          title={getMessage(messageTypes.emailTranscriptInputCancelTooltip)}
          onClick={this.props.onCancel}
          className={`fa fa-times`}
        />
        <SubmitButton
          style={getStyle(styles.EmailTranscriptInputSubmitButton)}
          title={getMessage(messageTypes.emailTranscriptInputSubmitTooltip)}
          onClick={this.submit}
          className={`fa fa-check`}
        />
      </EmailInputContainer>
    );
  }
}

export default EmailInput;
