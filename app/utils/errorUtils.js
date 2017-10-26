// @flow

import * as Utils from 'Common/Utils';

/* eslint-disable import/prefer-default-export */
export const getMetadataForSentry = () => {
  return {
    inStandaloneMode: Utils.inStandaloneMode(),
  };
};
/* eslint-disable import/prefer-default-export */
