// @flow
import React, {Component} from 'react';
import QUIQ from 'utils/quiq';
import HeaderMenu from 'HeaderMenu';
import {getDisplayString, formatMessage} from 'utils/i18n';
import type {WelcomeFormField, ApiError} from 'types';
import messages from 'messages';
import {getChatClient} from '../ChatClient';
import './styles/WelcomeForm.scss';
import {map} from 'lodash';

export type WelcomeFormProps = {
  onFormSubmit: (formattedString: string) => void,
  onPop: (fireEvent: boolean) => void,
  onDock: (fireEvent: boolean) => void,
  onMinimize: (fireEvent: boolean) => void,
  onApiError: (err: ApiError, func: (any) => any) => void, // eslint-disable-line react/no-unused-prop-types
};

export type WelcomeFormState = {
  formValidationError: boolean,
};

class WelcomeForm extends Component {
  inputFields: {[string]: any} = {};
  props: WelcomeFormProps;
  state: WelcomeFormState = {
    formValidationError: false,
  };

  renderField = (field: WelcomeFormField) => {
    const {FONT_FAMILY} = QUIQ;

    return (
      <div className="field" key={field.id}>
        <label htmlFor={field.label} style={{fontFamily: FONT_FAMILY}}>
          {field.label}
          {field.required &&
            <span className="required" title={getDisplayString(messages.required)}>
              {' '}*
            </span>}
        </label>
        <input
          ref={n => (this.inputFields[field.id] = n)}
          type={field.type}
          name={field.id}
          required={field.required}
          style={{fontFamily: FONT_FAMILY}}
          maxLength={1000}
        />
      </div>
    );
  };

  submitForm = (e: SyntheticEvent) => {
    e.preventDefault();

    const {HREF} = QUIQ;

    const chatClient = getChatClient();
    const fields: {[string]: string} = {};
    let validationError = false;

    map(this.inputFields, (field, key) => {
      if (field.required && !field.value) validationError = true;

      // Only include field if it was filled out
      // TODO: Should API allow empty strings? Currently does not.
      if (field.value) fields[key] = field.value;
    });

    // Append field containing referrer (host)
    fields.Referrer = HREF;

    if (validationError) {
      this.setState({formValidationError: true});
      return;
    }

    chatClient
      .sendRegistration(fields)
      .then(this.props.onFormSubmit)
      .catch((err: ApiError) => this.props.onApiError(err, this.submitForm));
  };

  render = () => {
    const {WELCOME_FORM, FONT_FAMILY, COLORS} = QUIQ;

    // We shouldn't be rendering this component if we didn't find a WELCOME_FORM in the QUIQ object.
    // But just in case, pass it through so we don't block webchat.
    if (!WELCOME_FORM) {
      this.props.onFormSubmit('');
      return null;
    }

    return (
      <form className="WelcomeForm" style={{backgroundColor: COLORS.transcriptBackground}}>
        <HeaderMenu
          onPop={this.props.onPop}
          onDock={this.props.onDock}
          onMinimize={this.props.onMinimize}
        />
        <div className="welcomeFormBanner" style={{backgroundColor: COLORS.primary}}>
          <span style={{fontFamily: FONT_FAMILY}}>
            {WELCOME_FORM.headerText}
          </span>
        </div>
        {this.state.formValidationError &&
          <span className="formValidationError">
            {formatMessage(messages.welcomeFormValidationError)}
          </span>}
        <div className="fields">
          {WELCOME_FORM.fields.map(this.renderField)}
        </div>
        <button
          className="submit"
          style={{background: COLORS.primary, fontFamily: FONT_FAMILY}}
          onClick={this.submitForm}
        >
          {formatMessage(messages.submitWelcomeForm)}
        </button>
      </form>
    );
  };
}

export default WelcomeForm;
