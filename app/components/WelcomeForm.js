// @flow
import React, {Component} from 'react';
import update from 'react-addons-update';
import {messageTypes} from 'appConstants';
import QUIQ, {getMessage} from 'utils/quiq';
import HeaderMenu from 'HeaderMenu';
import {supportsFlexbox} from 'utils/utils';
import {setWelcomeFormSubmitted} from 'actions/chatActions';
import type {WelcomeFormField} from 'types';
import {getChatClient} from '../ChatClient';
import './styles/WelcomeForm.scss';
import {map} from 'lodash';
import Textarea from 'react-textarea-autosize';

export type WelcomeFormProps = {};

export type WelcomeFormState = {
  formValidationError: boolean,
  inputFields: {
    [string]: {
      value: string,
      label: string,
      required: boolean,
    },
  },
  submitting: boolean,
};

export class WelcomeForm extends Component {
  props: WelcomeFormProps;
  state: WelcomeFormState = {
    formValidationError: false,
    inputFields: {},
    submitting: false,
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
            <span className="required" title={getMessage(messageTypes.REQUIRED_FIELD_ARIA_LABEL)}>
              {' '}*
            </span>}
        </label>
        {field.type === 'textarea'
          ? <Textarea
              value={this.state.inputFields[field.id].value}
              onChange={this.handleFieldInput}
              name={field.id}
              required={field.required}
              style={{fontFamily: FONT_FAMILY}}
              maxLength={1000}
              maxRows={field.rows || 5}
              minRows={supportsFlexbox() ? 1 : field.rows || 5}
            />
          : <input
              value={this.state.inputFields[field.id].value}
              onChange={this.handleFieldInput}
              type={field.type}
              name={field.id}
              required={field.required}
              style={{fontFamily: FONT_FAMILY}}
              maxLength={1000}
            />}
      </div>
    );
  };

  submitForm = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (this.state.submitting) return;

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

    this.setState({submitting: true});
    await getChatClient().sendRegistration(fields);
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

    if (!WELCOME_FORM) return null;

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
            {getMessage(messageTypes.WELCOME_FORM_VALIDATION_ERROR_MESSAGE)}
          </span>}
        <div className="fields">
          {WELCOME_FORM.fields.map(this.renderField)}
        </div>
        <button
          className="submit"
          disabled={this.state.submitting}
          style={{background: COLORS.primary, fontFamily: FONT_FAMILY}}
          onClick={this.submitForm}
        >
          {this.state.submitting
            ? getMessage(messageTypes.WELCOME_FORM_SUBMITTING_BUTTON_LABEL)
            : getMessage(messageTypes.WELCOME_FORM_SUBMIT_BUTTON_LABEL)}
        </button>
      </form>
    );
  };
}

export default WelcomeForm;
