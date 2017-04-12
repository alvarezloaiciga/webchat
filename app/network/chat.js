// @flow

import QUIQ from 'utils/quiq';
import fetch from 'isomorphic-fetch';
import type { Conversation } from 'types';

const { HOST, CONTACT_POINT } = QUIQ;

const parseResponse = (response: Response): Promise<*> => {
  if (response.status && response.status >= 300) {
    return response.json()
      .then((res) => Promise.reject(res))
      .catch((err) => Promise.reject(err));
  }

  return response.json();
};

export const joinChat = () => {
  fetch(`${ HOST }/api/v1/messaging/chat/${ CONTACT_POINT }/join`, {
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
  fetch(`${ HOST }/api/v1/messaging/chat/${ CONTACT_POINT }/leave`, {
    mode: 'cors',
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const ping = () => {
  fetch(`${ HOST }/api/v1/webchat/endpoints/${ CONTACT_POINT }/socket-ping`, {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
  });
};

export const addMessage = (body: string) => {
  fetch(`${ HOST }/api/v1/messaging/chat/${ CONTACT_POINT }/send-message`, {
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

export const fetchWebsocketInfo = (): Promise<{ url: string }> => (
  fetch(`${ HOST }/api/v1/messaging/chat/${ CONTACT_POINT }/socket-info`, {
    mode: 'cors',
    credentials: 'include',
  }).then(parseResponse)
);

export const fetchConversation = (): Promise<Conversation> => (
  fetch(`${ HOST }/api/v1/messaging/chat/${ CONTACT_POINT }`, {
    mode: 'cors',
    credentials: 'include',
  }).then(parseResponse)
);
