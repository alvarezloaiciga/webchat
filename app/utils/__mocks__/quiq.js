// @flow
import type {QuiqObject} from 'types';

const QUIQ: QuiqObject = {
  CONTACT_POINT: 'Bob',
  HOST: 'https://bob.dev.centricient.corp',
  COLOR: '#333',
  HEADER_TEXT: 'TOOL TIME',
  DEBUG: false,
  AUTO_POP_TIME: 2000,
  HREF: window.location.href,
  WELCOME_FORM: {
    headerText:
      'Thanks for contacting us! Please fill out a couple brief pieces of information and we will get you chatting with an agent.',
    fields: [
      {
        type: 'text',
        label: 'First Name',
        required: true,
      },
      {
        type: 'text',
        label: 'Last Name',
        required: false,
      },
      {
        type: 'number',
        label: 'Number Field',
        required: true,
      },

      {
        type: 'email',
        label: 'E-Mail',
        required: true,
      },
      {
        type: 'tel',
        label: 'Phone Number',
        required: true,
      },
    ],
  },
};

export default QUIQ;
