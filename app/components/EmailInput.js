// @flow
import React from 'react';
import styled from 'react-emotion';
import * as colors from 'colors';

export type EmailInputProps = {
  onCancel: () => void,
  onSubmit: () => void,
};

const EmailInputContainer = styled.div``;

const Input = styled.input``;

const CancelButton = styled.button``;

const SubmitButton = styled.button``;

const EmailInput = (props: EmailInputProps) => {
  const handleSubmitClick = () => {
    console.log('submit');
    props.onSubmit();
  };

  return (
    <EmailInputContainer className="EmailInput">
      <Input />
      <CancelButton onClick={props.onCancel}>Cancel</CancelButton>
      <SubmitButton onClick={handleSubmitClick}>Submit</SubmitButton>
    </EmailInputContainer>
  );
};

export default EmailInput;
