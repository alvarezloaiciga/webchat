// @flow
import type {QuiqObject} from 'types';

const QUIQ: QuiqObject = {
  CONTACT_POINT: 'Bob',
  HOST: 'https://bob.dev.centricient.corp',
  COLOR: '#333',
  HEADER_TEXT: 'TOOL TIME',
  FONT_FAMILY: 'Lato, sans-serif',
  DEBUG: false,
  AUTO_POP_TIME: 2000,
  HREF: window.location.href,
  CUSTOM_LAUNCH_BUTTONS: [],
  WELCOME_FORM: {
    headerText:
      'Thanks for contacting us! Please fill out a couple brief pieces of information and we will get you chatting with an agent.',
    fields: [
      {
        type: 'text',
        label: 'First Name',
        id: 'firstName',
        required: true,
      },
      {
        type: 'text',
        label: 'Last Name',
        id: 'lastName',
        required: false,
      },
      {
        type: 'number',
        label: 'Number Field',
        id: 'numberField',
        required: true,
      },

      {
        type: 'email',
        label: 'E-Mail',
        id: 'email',
        required: true,
      },
      {
        type: 'tel',
        label: 'Phone Number',
        id: 'phoneNumber',
        required: true,
      },
    ],
  },
};

export default QUIQ;
