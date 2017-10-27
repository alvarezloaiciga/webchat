// @flow

import * as Utils from 'Common/Utils';

export const getMetadataForSentry = () => {
  return {
    inStandaloneMode: Utils.inStandaloneMode(),
  };
};
