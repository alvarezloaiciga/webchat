// @flow
import React, {Component} from 'react';
import update from 'react-addons-update';
import QUIQ from 'utils/quiq';
import HeaderMenu from 'HeaderMenu';
import {connect} from 'react-redux';
import {setWelcomeFormSubmitted} from 'actions/chatActions';
import {getDisplayString, formatMessage} from 'utils/i18n';
import type {WelcomeFormField} from 'types';
import messages from 'messages';
import {getChatClient} from '../ChatClient';
import './styles/WelcomeForm.scss';
import {map} from 'lodash';

export type WelcomeFormProps = {
  setWelcomeFormSubmitted: (welcomeFormSubmitted: boolean) => void,
};

export type WelcomeFormState = {
  formValidationError: boolean,
  inputFields: {
    [string]: {
      value: string,
      label: string,
      required: boolean,
    },
  },
};

export class WelcomeForm extends Component {
  props: WelcomeFormProps;
  state: WelcomeFormState = {
    formValidationError: false,
    inputFields: {},
  };

  constructor(props: WelcomeFormProps) {
    super(props);

    const {WELCOME_FORM} = QUIQ;

    if (WELCOME_FORM) {
      WELCOME_FORM.fields.forEach(field => {
        this.state.inputFields[field.id] = {
          value: '',
          label: field.label,
          required: Boolean(field.required),
        };
      });
    }
  }

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
          value={this.state.inputFields[field.id].value}
          onChange={this.handleFieldInput}
          type={field.type}
          name={field.id}
          required={field.required}
          style={{fontFamily: FONT_FAMILY}}
          maxLength={1000}
        />
      </div>
    );
  };

  submitForm = async (e: SyntheticEvent) => {
    e.preventDefault();

    const {HREF} = QUIQ;
    const fields: {[string]: string} = {};

    if (!this.validateFormInput()) return;

    map(this.state.inputFields, (field, key) => {
      // Only include field if it was filled out
      // TODO: API should allow empty strings. Send all fields when this is fixed.
      if (field.value.length) fields[key] = field.value;
    });

    // Append field containing referrer (host)
    fields.Referrer = HREF;

    await getChatClient().sendRegistration(fields);
    this.props.setWelcomeFormSubmitted(true);
  };

  handleFieldInput = (e: SyntheticInputEvent) => {
    const fieldId = e.target.name;
    const value = e.target.value;
    const newState = update(this.state, {
      inputFields: {
        [fieldId]: {
          value: {
            $set: value,
          },
        },
      },
    });

    this.setState(newState, () => {
      // If we have a validation error, check to see if it can be cleared
      if (this.state.formValidationError) this.validateFormInput();
    });
  };

  validateFormInput = (): boolean => {
    let validationError = false;

    Object.values(this.state.inputFields).forEach(field => {
      // $FlowIssue - flow doesn't do well with Object.values
      if (field.required && !field.value.length) validationError = true;
    });

    this.setState({formValidationError: validationError});

    return !validationError;
  };

  render = () => {
    const {WELCOME_FORM, FONT_FAMILY, COLORS} = QUIQ;

    // We shouldn't be rendering this component if we didn't find a WELCOME_FORM in the QUIQ object.
    // But just in case, pass it through so we don't block webchat.
    if (!WELCOME_FORM) {
      this.props.setWelcomeFormSubmitted(true);
      return null;
    }

    return (
      <form className="WelcomeForm" style={{backgroundColor: COLORS.transcriptBackground}}>
        <HeaderMenu />
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

export default connect(null, {setWelcomeFormSubmitted})(WelcomeForm);
