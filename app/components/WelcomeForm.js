// @flow
import React from 'react';
import QUIQ from 'utils/quiq';
import HeaderMenu from 'HeaderMenu';
import {getDisplayString} from 'utils/i18n';
import {FormattedMessage} from 'react-intl';
import type {WelcomeFormField} from 'types';
import messages from 'messages';
import {sendRegistration} from 'quiq-chat';
import './styles/WelcomeForm.scss';

export type WelcomeFormProps = {
  onFormSubmit: (formattedString: string) => void,
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
      />
    </div>;

  const submitForm = () => {
    const fields: {[string]: string} = {};
    Object.keys(refs).forEach(k => {
      fields[k] = refs[k].value;
    });
    sendRegistration(fields).then(props.onFormSubmit);
  };

  return (
    <div className="WelcomeForm">
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
        <FormattedMessage {...messages.submitWelcomeForm} />
      </button>
    </div>
  );
};

export default WelcomeForm;
