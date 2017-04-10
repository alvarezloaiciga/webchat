// @flow

import { QUIQ } from 'utils/utils';
import fetch from 'isomorphic-fetch';
import type { Conversation } from 'types';

const { TENANT, HOST, CONTACT_POINT } = QUIQ;

export const joinChat = () => {
  fetch(`https://${TENANT}.${HOST}/api/v1/messaging/chat/${CONTACT_POINT}/join`, {
    mode: 'cors',
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const leaveChat = () => {
  fetch(`https://${TENANT}.${HOST}/api/v1/messaging/chat/${CONTACT_POINT}/leave`, {
    mode: 'cors',
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const poll = (callback: (conversation: Conversation) => void) => {
  fetch(`https://${TENANT}.${HOST}/api/v1/messaging/chat/${CONTACT_POINT}`, {
    mode: 'cors',
    credentials: 'include',
  }).then(response => response.json().then(callback));
};

export const ping = () => {
  fetch(`https://${TENANT}.${HOST}/api/v1/webchat/endpoints/${CONTACT_POINT}/socket-ping`, {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
  });
};

export const addMessage = (body: string) => {
  fetch(`https://${TENANT}.${HOST}/api/v1/messaging/chat/${CONTACT_POINT}/send-message`, {
    mode: 'cors',
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({body}),
  });
};

export const retrieveMessages = (
  callback: (conversation: Conversation, resolve: () => void) => void
) => new Promise((resolve, reject) => {
  console.log('Initial message retrieval starting'); // eslint-disable-line no-console
  fetch(`https://${TENANT}.${HOST}/api/v1/messaging/chat/${CONTACT_POINT}`, {
    mode: 'cors',
    credentials: 'include',
  }).then(response => {
    response.json().then(res => {
      if (res.status && res.status >= 300) {
        return reject();
      }

      callback(res, resolve);
    });
  }).catch(() => {
    reject();
  });
});
