// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import update from 'react-addons-update';
import {intlMessageTypes, UserEmailKey} from 'Common/Constants';
import {getStyle} from 'Common/QuiqOptions';
import {getConfiguration, getMessage} from 'reducers/chat';
import {setWelcomeFormRegistered, setWindowScrollLockEnabled} from 'actions/chatActions';
import Debugger from './Debugger/Debugger';
import {isValidEmail} from 'Common/Utils';
import QuiqChatClient from 'quiq-chat';
import type {
  WelcomeFormField,
  WelcomeForm as WelcomeFormType,
  ChatState,
  ChatConfiguration,
} from 'Common/types';
import './styles/WelcomeForm.scss';
import map from 'lodash/map';
import find from 'lodash/find';

const ValidationErrors = {
  REQUIRED: 'REQUIRED',
  INVALID_EMAIL: 'INVALID_EMAIL',
};

export type WelcomeFormProps = {
  setWelcomeFormRegistered: () => void, // eslint-disable-line react/no-unused-prop-types
  welcomeFormRegistered: boolean,
  registrationForm?: WelcomeFormType | null,
  registrationFormVersionId?: string,
  configuration: ChatConfiguration,
  setWindowScrollLockEnabled: (enabled: boolean) => void,
};

export type WelcomeFormState = {
  formValidationError?: string,
  inputFields: {
    [string]: {
      value: string,
      label: string,
      required: boolean,
      isInitialMessage: boolean,
      options: [{value: string, label: string}],
      id: string,
      type?: string,
    },
  },
  submitting: boolean,
  form?: WelcomeFormType,
};

export class WelcomeForm extends Component<WelcomeFormProps, WelcomeFormState> {
  props: WelcomeFormProps;
  state: WelcomeFormState = {
    inputFields: {},
    submitting: false,
  };

  componentWillMount() {
    this.processWelcomeForm();
    this.props.setWindowScrollLockEnabled(false);
  }

  componentWillUnmount() {
    window.scrollTo(0, 0);
    this.props.setWindowScrollLockEnabled(true);
  }

  processWelcomeForm = () => {
    const processForm = (form: WelcomeFormType) => {
      const inputFields = {};
      form.fields.forEach(field => {
        inputFields[field.id] = {
          value: '',
          label: field.label,
          id: field.id,
          required: Boolean(field.required),
          isInitialMessage: field.additionalProperties
            ? Boolean(field.additionalProperties.isInitialMessage)
            : Boolean(field.isInitialMessage),
          options:
            field.additionalProperties && field.additionalProperties.options
              ? JSON.parse(field.additionalProperties.options)
              : field.options,
          type: field.type,
        };
      });

      this.setState({inputFields, form});
    };

    if (this.props.configuration.demoMode && this.props.configuration.welcomeForm) {
      processForm(this.props.configuration.welcomeForm);
      return;
    }

    const form = this.props.registrationForm || this.props.configuration.welcomeForm;
    if (!form || (!this.props.registrationForm && this.props.registrationFormVersionId)) {
      this.props.setWelcomeFormRegistered();
      return;
    }

    processForm(form);
  };

  renderInputField = (field: WelcomeFormField) => {
    const {fontFamily, styles} = this.props.configuration;
    const inputStyle = getStyle(styles.WelcomeFormFieldInput, {fontFamily});
    const selectStyle = getStyle(styles.WelcomeFormFieldSelect, {fontFamily});
    const optionStyle = getStyle(styles.WelcomeFormFieldOption, {fontFamily});
    const textareaStyle = getStyle(styles.WelcomeFormFieldTextarea, {fontFamily});

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={this.state.inputFields[field.id].value}
            onChange={this.handleFieldInput}
            onBlur={this.handleTrimFieldInput}
            name={field.id}
            required={field.required}
            style={textareaStyle}
            maxLength={1000}
            rows={field.rows || 3}
            resize="vertical"
          />
        );
      case 'select':
        return (
          <select
            value={this.state.inputFields[field.id].value}
            onChange={this.handleFieldInput}
            onBlur={this.handleTrimFieldInput}
            name={field.id}
            required={field.required}
            style={selectStyle}
          >
            {this.state.inputFields[field.id].options &&
              this.state.inputFields[field.id].options
                // visible is a prop added recently, if it isn't present, assume it's true
                .filter(o => typeof o.visible === 'undefined' || o.visible)
                .map(value => (
                  <option
                    style={optionStyle}
                    key={`${value.label}${value.value}`}
                    value={value.value}
                  >
                    {value.label}
                  </option>
                ))}
          </select>
        );
      default:
        return (
          <input
            value={this.state.inputFields[field.id].value}
            onChange={this.handleFieldInput}
            onBlur={this.handleTrimFieldInput}
            type={field.type}
            name={field.id}
            required={field.required}
            style={inputStyle}
            maxLength={1000}
          />
        );
    }
  };

  renderField = (field: WelcomeFormField) => {
    const {fontFamily, styles} = this.props.configuration;

    const labelStyle = getStyle(styles.WelcomeFormFieldLabel, {fontFamily});

    return (
      <div className="field" key={field.id} style={getStyle(styles.WelcomeFormField)}>
        <label htmlFor={field.label} style={labelStyle}>
          {field.label}
          {field.required && (
            <span className="required" title={getMessage(intlMessageTypes.requiredFieldAriaLabel)}>
              {' '}
              *
            </span>
          )}
        </label>
        {this.renderInputField(field)}
      </div>
    );
  };

  sendInitialMessage = async () => {
    await map(this.state.inputFields, async field => {
      // Only include field if it was filled out and marked as an initial field
      if (field.value.length && field.isInitialMessage) {
        await QuiqChatClient.sendTextMessage(field.value);
      }
    });
  };

  storeEmail = () => {
    const emailField = find(this.state.inputFields, f => f.type === 'email' || f.id === 'email');
    if (!emailField) return;

    try {
      localStorage.setItem(
        `${UserEmailKey}_${this.props.configuration.contactPoint}`,
        btoa(emailField.value),
      );
    } catch (ex) {} // eslint-disable-line no-empty
  };

  submitForm = async (e: SyntheticEvent<*>) => {
    e.preventDefault();
    if (this.state.submitting) return;

    const {href, demoMode} = this.props.configuration;
    const fields: {[string]: string} = {};

    if (!this.validateFormInput()) return;

    if (demoMode) return;

    map(this.state.inputFields, (field, key) => {
      // Only include field if it was filled out
      // TODO: API should allow empty strings. Send all fields when this is fixed.
      if (field.value.length) fields[key] = field.value;
    });

    // Save e-mail to prepopulate email transcript input
    this.storeEmail();

    // Append field containing referrer (host)
    fields.Referrer = href;

    this.setState({submitting: true});
    await QuiqChatClient.sendRegistration(
      fields,
      this.props.configuration.registrationFormVersionId,
    );
    await this.sendInitialMessage();
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
    let validationError;

    Object.values(this.state.inputFields).forEach(field => {
      // $FlowIssue - flow doesn't do well with Object.values
      if (field.required && !field.value.length) validationError = ValidationErrors.REQUIRED;
      // $FlowIssue - flow doesn't do well with Object.values
      if (field.type === 'email' && field.value && !isValidEmail(field.value))
        validationError = ValidationErrors.INVALID_EMAIL;
    });

    this.setState({formValidationError: validationError});

    return !validationError;
  };

  renderValidationError = () => {
    switch (this.state.formValidationError) {
      case ValidationErrors.INVALID_EMAIL:
        return (
          <span className="formValidationError">
            {getMessage(intlMessageTypes.invalidEmailErrorMessage)}
          </span>
        );
      case ValidationErrors.REQUIRED:
      default:
        return (
          <span className="formValidationError">
            {getMessage(intlMessageTypes.welcomeFormValidationErrorMessage)}
          </span>
        );
    }
  };

  render = () => {
    const {fontFamily, colors, styles, demoMode} = this.props.configuration;
    const welcomeForm = this.state.form;
    if (!demoMode && this.props.welcomeFormRegistered) return null;

    const bannerStyle = getStyle(styles.WelcomeFormBanner, {
      backgroundColor: colors.primary,
      fontFamily,
    });

    const submitButtonStyle = getStyle(styles.WelcomeFormSubmitButton, {
      backgroundColor: colors.primary,
      fontFamily,
    });

    return (
      <form className="WelcomeForm" style={{backgroundColor: colors.transcriptBackground}}>
        <div className="welcomeFormBanner" style={bannerStyle}>
          {welcomeForm && welcomeForm.headerText}
        </div>
        <Debugger />
        {this.state.formValidationError && this.renderValidationError()}
        <div className="fields">{welcomeForm && welcomeForm.fields.map(this.renderField)}</div>
        <button
          className="submit"
          disabled={this.state.submitting}
          style={submitButtonStyle}
          onClick={this.submitForm}
        >
          {this.state.submitting
            ? getMessage(intlMessageTypes.welcomeFormSubmittingButtonLabel)
            : getMessage(intlMessageTypes.welcomeFormSubmitButtonLabel)}
        </button>
      </form>
    );
  };
}

export default connect(
  (state: ChatState) => ({
    welcomeFormRegistered: state.welcomeFormRegistered,
    registrationForm: state.configuration.registrationForm,
    registrationFormVersionId: state.configuration.registrationFormVersionId,
    configuration: getConfiguration(state),
  }),
  {
    setWelcomeFormRegistered,
    setWindowScrollLockEnabled,
  },
)(WelcomeForm);
