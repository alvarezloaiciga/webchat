// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import update from 'react-addons-update';
import {intlMessageTypes} from 'Common/Constants';
import {getStyle} from 'Common/QuiqOptions';
import {getConfiguration, getMessage, getRegistrationFieldValues} from 'reducers/chat';
import {setWelcomeFormRegistered, setWindowScrollLockEnabled} from 'actions/chatActions';
import {isValidEmail} from 'Common/Utils';
import type {
  WelcomeFormField,
  ChatState,
  ChatConfiguration,
  RegistrationFields,
} from 'Common/types';
import {css} from 'react-emotion';

const ValidationErrors = {
  REQUIRED: 'REQUIRED',
  INVALID_EMAIL: 'INVALID_EMAIL',
};

const WelcomeFormStyle = css`
  min-height: 50px;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;

  .welcomeFormBanner {
    text-align: center;
    flex: 0 0 auto;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: 300;
    font-size: 14px;
    padding: 0 30px;
    background: #59ad5d;
    height: 80px;
    align-items: stretch;
    text-align: center;

    span {
      display: inline-block;
      width: 100%;
      line-height: 1.3;
    }
  }

  .formValidationError {
    margin: 20px;
    color: #c53431;
  }

  .fields {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 20px;
    overflow-y: auto;
  }

  .field,
  .submit {
    min-height: 30px;
  }

  .submit {
    flex: 0 0 auto;
    margin: 20px;
    width: 130px;
    align-self: flex-end;
    color: white;
    display: inline-block;
    vertical-align: middle;
    border: 1px solid transparent;
    font-size: 16px;
    text-transform: uppercase;
    line-height: 1;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
    padding: 8px;
    transition: all 0.15s ease-in-out;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    align-items: stretch;
    min-width: 99%;
    flex: 0 0 auto;
    margin: 5px 0;

    label {
      margin-bottom: 4px;
    }

    label .required {
      color: #c53431;
      flex: 0 0 auto;
    }

    input,
    select {
      height: 40px;
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
      border: 1px solid #cacaca;
      border-radius: 5px;
      background-color: #fefefe;
      box-shadow: inset 0 1px 2px hsla(0, 0%, 4%, 0.1);
      font-family: inherit;
      font-size: 16px;
      font-weight: 400;
      color: #0a0a0a;
      transition: box-shadow 0.5s, border-color 0.25s ease-in-out;
    }

    textarea {
      min-height: 40px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
`;

export type WelcomeFormProps = {
  setWelcomeFormRegistered: () => void, // eslint-disable-line react/no-unused-prop-types
  configuration: ChatConfiguration,
  setWindowScrollLockEnabled: (enabled: boolean) => void,
  registrationFieldValues: {[string]: any},
  welcomeFormRegistered: boolean,
  sendRegistrationForm: (?RegistrationFields) => void,
};

export type WelcomeFormState = {
  formValidationError?: string,
  inputFields: RegistrationFields,
  submitting: boolean,
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
    const inputFields = {};
    const {registrationForm} = this.props.configuration;

    // If no registration form is defined, there ar eno fields on that form, or all fields are hidden,
    // we have nothing to display
    if (
      !registrationForm ||
      !registrationForm.fields.length ||
      registrationForm.fields.every(
        field => field.additionalProperties && field.additionalProperties.isHidden,
      )
    ) {
      this.props.setWelcomeFormRegistered();
      return;
    }

    registrationForm.fields
      .filter(field => !field.additionalProperties || !field.additionalProperties.isHidden)
      .forEach(field => {
        const fieldValue = this.props.registrationFieldValues[field.id];

        inputFields[field.id] = {
          value:
            !fieldValue &&
            field.type === 'select' &&
            field.additionalProperties &&
            field.additionalProperties.options &&
            JSON.parse(field.additionalProperties.options).length > 0
              ? JSON.parse(field.additionalProperties.options)[0].value
              : fieldValue || '',
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

    this.setState({inputFields});
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

  submitForm = async (e: SyntheticEvent<*>) => {
    e.preventDefault();

    if (this.state.submitting) return;

    if (!this.validateFormInput()) return;

    this.setState({submitting: true});

    this.props.sendRegistrationForm(this.state.inputFields);
  };

  handleTrimFieldInput = (e: SyntheticInputEvent<*>) => {
    const fieldId = e.target.name;
    const {value} = e.target;

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
    const {value} = e.target;
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
    const {fontFamily, colors, styles, registrationForm} = this.props.configuration;
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
      <form
        className={`WelcomeForm ${WelcomeFormStyle}`}
        style={{backgroundColor: colors.transcriptBackground}}
      >
        <div className="welcomeFormBanner" style={bannerStyle}>
          {registrationForm && registrationForm.headerText}
        </div>
        {this.state.formValidationError && this.renderValidationError()}
        <div className="fields">
          {registrationForm &&
            registrationForm.fields
              .filter(field => !field.additionalProperties || !field.additionalProperties.isHidden)
              .map(this.renderField)}
        </div>
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
    configuration: getConfiguration(state),
    registrationFieldValues: getRegistrationFieldValues(state),
    welcomeFormRegistered: state.welcomeFormRegistered,
  }),
  {
    setWelcomeFormRegistered,
    setWindowScrollLockEnabled,
  },
)(WelcomeForm);
