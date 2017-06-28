// @flow
import React from 'react';
import QUIQ from 'utils/quiq';
import HeaderMenu from 'HeaderMenu';
import {formatMessage, getDisplayString} from 'utils/i18n';
import type {WelcomeFormField} from 'types';
import messages from 'messages';
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
    <div className="field" key={field.label}>
      <label htmlFor={field.label} style={{fontFamily: FONT_FAMILY}}>
        {field.label}
        {field.required &&
          <span className="required" title={getDisplayString(messages.required)}> *</span>}
      </label>
      <input
        ref={n => (refs[field.label] = n)}
        type={field.type}
        name={field.label}
        required={field.required}
        style={{fontFamily: FONT_FAMILY}}
      />
    </div>;

  const submitForm = (e: SyntheticInputEvent) => {
    e.preventDefault();
    props.onFormSubmit(
      // This is a pretty hacky way to ensure the customer can't see the form they submit.
      // We filter on this message when displaying messages in the customer webchat.
      // Long-term we will most likely do the welcome form as an API call, in which case it won't ever
      // be submitted as a text message.  Until that day, this will suffice as a unique key.
      // Note: This would break if the customer were to change the language of their browser mid-chat.
      [formatMessage(messages.welcomeFormUniqueIdentifier)]
        .concat(
          form.fields.map(f => {
            const field = refs[f.label];
            if (!field) return '';

            return `${f.label}: ${field.value}`;
          }),
        )
        .concat([`${formatMessage(messages.referrer)}: ${QUIQ.HREF}`])
        .join('\n'),
    );
  };

  return (
    <form onSubmit={submitForm} className="WelcomeForm">
      <HeaderMenu onPop={props.onPop} onDock={props.onDock} onMinimize={props.onMinimize} />
      <div className="welcomeFormBanner" style={{backgroundColor: COLOR}}>
        <span style={{fontFamily: FONT_FAMILY}}>{form.headerText}</span>
      </div>
      <div className="fields">
        {WELCOME_FORM.fields.map(renderField)}
      </div>
      <button className="submit" style={{background: COLOR, fontFamily: FONT_FAMILY}} type="submit">
        Submit
      </button>
    </form>
  );
};

export default WelcomeForm;
