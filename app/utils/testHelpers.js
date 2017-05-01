// @flow
import type {Message} from 'types';

export const getMockMessage = (
  // eslint-disable-line import/prefer-default-export
  id?: number = 0,
  overrides?: Message | {} = {},
) => {
  const message = {
    authorType: id % 2 === 0 ? 'Guest' : 'Agent',
    body: `body--${id}`,
    id: `id--${id}`,
    timestamp: id,
    type: 'Text',
  };

  return Object.assign(message, overrides);
};
