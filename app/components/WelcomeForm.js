// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import update from 'react-addons-update';
import {messageTypes, UserEmailKey} from 'Common/Constants';
import quiqOptions, {getStyle, getMessage} from 'Common/QuiqOptions';
import {setWelcomeFormRegistered} from 'actions/chatActions';
import HeaderMenu from 'HeaderMenu';
import Debugger from './Debugger/Debugger';
import QuiqChatClient from 'quiq-chat';
import type {WelcomeFormField, WelcomeForm as WelcomeFormType, ChatState} from 'Common/types';
import './styles/WelcomeForm.scss';
import map from 'lodash/map';

export type WelcomeFormProps = {
  setWelcomeFormRegistered: () => void, // eslint-disable-line react/no-unused-prop-types
  welcomeFormRegistered: boolean,
  registrationForm?: WelcomeFormType | null,
};

export type WelcomeFormState = {
  formValidationError: boolean,
  inputFields: {
    [string]: {
      value: string,
      label: string,
      required: boolean,
      isInitialMessage: boolean,
      options: [{value: string, label: string}],
    },
  },
  submitting: boolean,
  form?: WelcomeFormType,
};

export class WelcomeForm extends Component<WelcomeFormProps, WelcomeFormState> {
  props: WelcomeFormProps;
  state: WelcomeFormState = {
    formValidationError: false,
    inputFields: {},
    submitting: false,
  };

  componentWillMount() {
    this.processWelcomeForm();
  }

  processWelcomeForm = () => {
    const processForm = (form: WelcomeFormType) => {
      const inputFields = {};
      form.fields.forEach(field => {
        inputFields[field.id] = {
          value: '',
          label: field.label,
          required: Boolean(field.required),
          isInitialMessage: field.additionalProperties
            ? Boolean(field.additionalProperties.isInitialMessage)
            : Boolean(field.isInitialMessage),
          options:
            field.additionalProperties && field.additionalProperties.options
              ? JSON.parse(field.additionalProperties.options)
              : field.options,
        };
      });

      this.setState({inputFields, form});
    };

    if (quiqOptions.demoMode && quiqOptions.welcomeForm) {
      processForm(quiqOptions.welcomeForm);
      return;
    }

    const form = this.props.registrationForm || quiqOptions.welcomeForm;
    if (!form) {
      this.props.setWelcomeFormRegistered();
      return;
    }

    processForm(form);
  };

  renderInputField = (field: WelcomeFormField) => {
    const {fontFamily, styles} = quiqOptions;
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
              this.state.inputFields[field.id].options.map(value => (
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
    const {fontFamily, styles} = quiqOptions;

    const labelStyle = getStyle(styles.WelcomeFormFieldLabel, {fontFamily});

    return (
      <div className="field" key={field.id} style={getStyle(styles.WelcomeFormField)}>
        <label htmlFor={field.label} style={labelStyle}>
          {field.label}
          {field.required && (
            <span className="required" title={getMessage(messageTypes.requiredFieldAriaLabel)}>
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

  submitForm = async (e: SyntheticEvent<*>) => {
    e.preventDefault();
    if (this.state.submitting) return;

    const {href} = quiqOptions;
    const fields: {[string]: string} = {};

    if (!this.validateFormInput()) return;

    if (quiqOptions.demoMode) return;

    map(this.state.inputFields, (field, key) => {
      // Only include field if it was filled out
      // TODO: API should allow empty strings. Send all fields when this is fixed.
      if (field.value.length) fields[key] = field.value;
    });

    // Append field containing referrer (host)
    fields.Referrer = href;

    // We store the e-mail in localStorage if it is there so we can
    // prepopulate the e-mail transcript input later
    if (fields.email) {
      try {
        localStorage.setItem(`${UserEmailKey}_${quiqOptions.contactPoint}`, btoa(fields.email));
      } catch (ex) {} // eslint-disable-line no-empty
    }

    this.setState({submitting: true});
    await QuiqChatClient.sendRegistration(fields);
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
    let validationError = false;

    Object.values(this.state.inputFields).forEach(field => {
      // $FlowIssue - flow doesn't do well with Object.values
      if (field.required && !field.value.length) validationError = true;
    });

    this.setState({formValidationError: validationError});

    return !validationError;
  };

  render = () => {
    const {fontFamily, colors, styles} = quiqOptions;
    const welcomeForm = this.state.form;
    if (this.props.welcomeFormRegistered) return null;

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
        <HeaderMenu />
        <div className="welcomeFormBanner" style={bannerStyle}>
          {welcomeForm && welcomeForm.headerText}
        </div>
        <Debugger />
        {this.state.formValidationError && (
          <span className="formValidationError">
            {getMessage(messageTypes.welcomeFormValidationErrorMessage)}
          </span>
        )}
        <div className="fields">{welcomeForm && welcomeForm.fields.map(this.renderField)}</div>
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

export default connect(
  (state: ChatState) => ({
    welcomeFormRegistered: state.welcomeFormRegistered,
    registrationForm: state.configuration.registrationForm,
  }),
  {
    setWelcomeFormRegistered,
  },
)(WelcomeForm);
