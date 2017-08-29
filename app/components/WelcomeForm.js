// @flow
import React, {Component} from 'react';
import update from 'react-addons-update';
import {messageTypes} from 'appConstants';
import QUIQ, {getStyle, getMessage} from 'utils/quiq';
import HeaderMenu from 'HeaderMenu';
import Debugger from './Debugger/Debugger';
import {supportsFlexbox} from 'utils/utils';
import type {WelcomeFormField} from 'types';
import QuiqChatClient from 'quiq-chat';
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
      isInitialMessage: boolean,
    },
  },
  submitting: boolean,
};

export class WelcomeForm extends Component<WelcomeFormProps, WelcomeFormState> {
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
          isInitialMessage: Boolean(field.isInitialMessage),
        };
      });
    }
  }

  renderField = (field: WelcomeFormField) => {
    const {FONT_FAMILY, STYLES} = QUIQ;

    const labelStyle = getStyle(STYLES.WelcomeFormFieldLabel, {fontFamily: FONT_FAMILY});
    const inputStyle = getStyle(STYLES.WelcomeFormFieldInput, {fontFamily: FONT_FAMILY});
    const textareaStyle = getStyle(STYLES.WelcomeFormFieldTextarea, {fontFamily: FONT_FAMILY});

    return (
      <div className="field" key={field.id} style={getStyle(STYLES.WelcomeFormField)}>
        <label htmlFor={field.label} style={labelStyle}>
          {field.label}
          {field.required &&
            <span className="required" title={getMessage(messageTypes.requiredFieldAriaLabel)}>
              {' '}*
            </span>}
        </label>
        {field.type === 'textarea'
          ? <Textarea
              value={this.state.inputFields[field.id].value}
              onChange={this.handleFieldInput}
              onBlur={this.handleTrimFieldInput}
              name={field.id}
              required={field.required}
              style={textareaStyle}
              maxLength={1000}
              maxRows={field.rows || 5}
              minRows={supportsFlexbox() ? 1 : field.rows || 5}
            />
          : <input
              value={this.state.inputFields[field.id].value}
              onChange={this.handleFieldInput}
              onBlur={this.handleTrimFieldInput}
              type={field.type}
              name={field.id}
              required={field.required}
              style={inputStyle}
              maxLength={1000}
            />}
      </div>
    );
  };

  sendInitialMessage = () => {
    map(this.state.inputFields, field => {
      // Only include field if it was filled out and marked as an initial field
      if (field.value.length && field.isInitialMessage) {
        QuiqChatClient.sendMessage(field.value);
      }
    });
  };

  submitForm = async (e: SyntheticEvent<*>) => {
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
    await QuiqChatClient.sendRegistration(fields);
    this.sendInitialMessage();
  };

  handleTrimFieldInput = (e: SyntheticInputEvent<*>) => {
    const fieldId = e.target.name;
    const value = e.target.value;

    if (value) {
      const newState = update(this.state, {
        inputFields: {
          [fieldId]: {
            value: {
              $set: value.trim(),
            },
          },
        },
      });

      this.setState(newState, () => {
        // If we have a validation error, check to see if it can be cleared
        if (this.state.formValidationError) this.validateFormInput();
      });
    }
  };

  handleFieldInput = (e: SyntheticInputEvent<*>) => {
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
    const {WELCOME_FORM, FONT_FAMILY, COLORS, STYLES} = QUIQ;

    if (!WELCOME_FORM) return null;

    const bannerStyle = getStyle(STYLES.WelcomeFormBanner, {
      backgroundColor: COLORS.primary,
      fontFamily: FONT_FAMILY,
    });

    const submitButtonStyle = getStyle(STYLES.WelcomeFormSubmitButton, {
      backgroundColor: COLORS.primary,
      fontFamily: FONT_FAMILY,
    });

    return (
      <form className="WelcomeForm" style={{backgroundColor: COLORS.transcriptBackground}}>
        <HeaderMenu />
        <div className="welcomeFormBanner" style={bannerStyle}>
          {WELCOME_FORM.headerText}
        </div>
        <Debugger />
        {this.state.formValidationError &&
          <span className="formValidationError">
            {getMessage(messageTypes.welcomeFormValidationErrorMessage)}
          </span>}
        <div className="fields">
          {WELCOME_FORM.fields.map(this.renderField)}
        </div>
        <button
          className="submit"
          disabled={this.state.submitting}
          style={submitButtonStyle}
          onClick={this.submitForm}
        >
          {this.state.submitting
            ? getMessage(messageTypes.welcomeFormSubmittingButtonLabel)
            : getMessage(messageTypes.welcomeFormSubmitButtonLabel)}
        </button>
      </form>
    );
  };
}

export default WelcomeForm;
