// @flow
import React from 'react';
import QUIQ from 'utils/quiq';
import HeaderMenu from 'HeaderMenu';
import {getDisplayString, formatMessage} from 'utils/i18n';
import type {WelcomeFormField, ApiError} from 'types';
import messages from 'messages';
import {sendRegistration} from 'quiq-chat';
import './styles/WelcomeForm.scss';

export type WelcomeFormProps = {
  onFormSubmit: (formattedString: string) => void,
  onApiError: (err: ApiError, () => any) => void,
  onPop: (fireEvent: boolean) => void,
  onDock: (fireEvent: boolean) => void,
  onMinimize: (fireEvent: boolean) => void,
};

const WelcomeForm = (props: WelcomeFormProps) => {
  const {WELCOME_FORM, FONT_FAMILY, COLOR} = QUIQ;

  // We shouldn't be rendering this component if we didn't find a WELCOME_FORM in the QUIQ object.
  // But just in case, pass it through so we don't block webchat.
  if (!WELCOME_FORM) {
    props.onFormSubmit('');
    return null;
  }

  const refs = {};
  const form = WELCOME_FORM;

  const renderField = (field: WelcomeFormField) =>
    <div className="field" key={field.id}>
      <label htmlFor={field.label} style={{fontFamily: FONT_FAMILY}}>
        {field.label}
        {field.required &&
          <span className="required" title={getDisplayString(messages.required)}> *</span>}
      </label>
      <input
        ref={n => (refs[field.id] = n)}
        type={field.type}
        name={field.id}
        required={field.required}
        style={{fontFamily: FONT_FAMILY}}
        maxLength={1000}
      />
    </div>;

  const submitForm = (e: SyntheticEvent) => {
    e.preventDefault();
    const fields: {[string]: string} = {};
    Object.keys(refs).forEach(k => {
      fields[k] = refs[k].value;
    });
    sendRegistration(fields)
      .then(props.onFormSubmit)
      .catch((err: ApiError) => props.onApiError(err, submitForm));
  };

  return (
    <form className="WelcomeForm">
      <HeaderMenu onPop={props.onPop} onDock={props.onDock} onMinimize={props.onMinimize} />
      <div className="welcomeFormBanner" style={{backgroundColor: COLOR}}>
        <span style={{fontFamily: FONT_FAMILY}}>{form.headerText}</span>
      </div>
      <div className="fields">
        {WELCOME_FORM.fields.map(renderField)}
      </div>
      <button
        className="submit"
        style={{background: COLOR, fontFamily: FONT_FAMILY}}
        onClick={submitForm}
      >
        {formatMessage(messages.submitWelcomeForm)}
      </button>
    </form>
  );
};

export default WelcomeForm;
