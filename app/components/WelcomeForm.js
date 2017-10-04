// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import update from 'react-addons-update';
import {messageTypes} from 'Common/Constants';
import quiqOptions, {
  getStyle,
  getMessage,
  buildQuiqObject,
  validateWelcomeFormDefinition,
} from 'Common/QuiqOptions';
import {setWelcomeFormRegistered} from 'actions/chatActions';
import HeaderMenu from 'HeaderMenu';
import Debugger from './Debugger/Debugger';
import QuiqChatClient from 'quiq-chat';
import {supportsFlexbox} from 'Common/Utils';
import type {WelcomeFormField, WelcomeForm as WelcomeFormType, ChatState} from 'Common/types';
import './styles/WelcomeForm.scss';
import map from 'lodash/map';
import Textarea from 'react-textarea-autosize';

export type WelcomeFormProps = {
  setWelcomeFormRegistered: () => void,
  welcomeFormRegistered: boolean,
};

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
  loading: boolean,
};

export class WelcomeForm extends Component<WelcomeFormProps, WelcomeFormState> {
  props: WelcomeFormProps;
  state: WelcomeFormState = {
    formValidationError: false,
    loading: !quiqOptions.welcomeForm,
    inputFields: {},
    submitting: false,
  };

  processWelcomeForm = (welcomeForm: WelcomeFormType) => {
    const inputFields = {};
    welcomeForm.fields.forEach(field => {
      inputFields[field.id] = {
        value: '',
        label: field.label,
        required: Boolean(field.required),
        isInitialMessage: Boolean(field.isInitialMessage),
      };
    });

    this.setState({inputFields, loading: false});
  };

  fetchWelcomeForm = async () => {
    const metadata = await QuiqChatClient.getMetadata();
    const welcomeForm = metadata.registrationForm;
    if (!welcomeForm) {
      this.props.setWelcomeFormRegistered();
    }

    buildQuiqObject(Object.assign(quiqOptions, {welcomeForm}));
    console.log(quiqOptions.welcomeForm);
    if (quiqOptions.welcomeForm) {
      this.processWelcomeForm(quiqOptions.welcomeForm);
    }
  };

  componentWillMount() {
    const {welcomeForm} = quiqOptions;
    if (welcomeForm) {
      // No need to fetch a form since we already have our definition and it's not being used.
      if (QuiqChatClient.isRegistered()) return this.props.setWelcomeFormRegistered();

      // Form was defined on quiqObject, skip fetching it from the API and run validation logic.
      validateWelcomeFormDefinition();
      this.processWelcomeForm(welcomeForm);
    } else {
      // Only fetch welcome form from server if it is not already defined in the Quiq Object.
      this.fetchWelcomeForm();
    }
  }

  renderField = (field: WelcomeFormField) => {
    const {fontFamily, styles} = quiqOptions;

    const labelStyle = getStyle(styles.WelcomeFormFieldLabel, {fontFamily: fontFamily});
    const inputStyle = getStyle(styles.WelcomeFormFieldInput, {fontFamily: fontFamily});
    const textareaStyle = getStyle(styles.WelcomeFormFieldTextarea, {fontFamily: fontFamily});

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
        {field.type === 'textarea' ? (
          <Textarea
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
        ) : (
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
        )}
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

    const {href} = quiqOptions;
    const fields: {[string]: string} = {};

    if (!this.validateFormInput()) return;

    map(this.state.inputFields, (field, key) => {
      // Only include field if it was filled out
      // TODO: API should allow empty strings. Send all fields when this is fixed.
      if (field.value.length) fields[key] = field.value;
    });

    // Append field containing referrer (host)
    fields.Referrer = href;

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
    const {welcomeForm, fontFamily, colors, styles} = quiqOptions;

    if (!welcomeForm || this.props.welcomeFormRegistered || this.state.loading) return null;

    const bannerStyle = getStyle(styles.WelcomeFormBanner, {
      backgroundColor: colors.primary,
      fontFamily: fontFamily,
    });

    const submitButtonStyle = getStyle(styles.WelcomeFormSubmitButton, {
      backgroundColor: colors.primary,
      fontFamily: fontFamily,
    });

    return (
      <form className="WelcomeForm" style={{backgroundColor: colors.transcriptBackground}}>
        <HeaderMenu />
        <div className="welcomeFormBanner" style={bannerStyle}>
          {welcomeForm.headerText}
        </div>
        <Debugger />
        {this.state.formValidationError && (
          <span className="formValidationError">
            {getMessage(messageTypes.welcomeFormValidationErrorMessage)}
          </span>
        )}
        <div className="fields">{welcomeForm.fields.map(this.renderField)}</div>
        <button
          className="submit"
          disabled={this.state.submitting}
          style={submitButtonStyle}
          onClick={this.submitForm}
        >
          {this.state.submitting ? (
            getMessage(messageTypes.welcomeFormSubmittingButtonLabel)
          ) : (
            getMessage(messageTypes.welcomeFormSubmitButtonLabel)
          )}
        </button>
      </form>
    );
  };
}

export default connect(
  (state: ChatState) => ({
    welcomeFormRegistered: state.welcomeFormRegistered,
  }),
  {setWelcomeFormRegistered},
)(WelcomeForm);
