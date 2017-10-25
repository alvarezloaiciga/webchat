// @flow
import React from 'react';
import styled from 'react-emotion';
import moment from 'moment-timezone';
import {css} from 'emotion';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import {isValidEmail} from 'Common/Utils';
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

const ErrorStyle = css`box-shadow: inset 0px 0px 7px red;`;

const Input = styled.input`
  height: 100%;
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

const {fontFamily, styles, host, contactPoint} = quiqOptions;

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
    return atob(localStorage.getItem(`${UserEmailKey}_${contactPoint}`) || '');
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
    if (isValidEmail(this.state.value)) {
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
          data-test="submitButton"
          className={`fa fa-check`}
        />
      </EmailInputContainer>
    );
  }
}

export default EmailInput;
