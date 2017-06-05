// @flow
import React from 'react';
import QUIQ from 'utils/quiq';
import {formatMessage, getDisplayString} from 'utils/i18n';
import type {WelcomeFormField} from 'types';
import messages from 'messages';
import './styles/WelcomeForm.scss';

export type WelcomeFormProps = {
  onFormSubmit: (formattedString: string) => void,
};

const WelcomeForm = (props: WelcomeFormProps) => {
  // We shouldn't be rendering this component if we didn't find a WELCOME_FORM in the QUIQ object.
  // But just in case, pass it through so we don't block webchat.
  if (!QUIQ.WELCOME_FORM) {
    props.onFormSubmit('');
    return null;
  }

  const refs = {};
  const form = QUIQ.WELCOME_FORM;

  const renderField = (field: WelcomeFormField) =>
    <div className="field" key={field.label}>
      <label htmlFor={field.label}>
        {field.label}
        {field.required &&
          <span className="required" title={getDisplayString(messages.required)}> *</span>}
      </label>
      <input
        ref={n => (refs[field.label] = n)}
        type={field.type}
        name={field.label}
        required={field.required}
      />
    </div>;

  const submitForm = (e: SyntheticInputEvent) => {
    e.preventDefault();
    props.onFormSubmit(
      form.fields
        .map(f => {
          const field = refs[f.label];
          if (!field) return '';

          return `${f.label}: ${field.value}`;
        })
        .concat([formatMessage(messages.referrer, {location: window.location.href})])
        .join('\n'),
    );
  };

  return (
    <form onSubmit={submitForm} className="WelcomeForm">
      <div className="welcomeFormBanner" style={{backgroundColor: QUIQ.COLOR}}>
        <span>{form.headerText}</span>
      </div>
      <div className="fields">
        {QUIQ.WELCOME_FORM.fields.map(renderField)}
      </div>
      <button className="submit" style={{background: QUIQ.COLOR}} type="submit">Submit</button>
    </form>
  );
};

export default WelcomeForm;
