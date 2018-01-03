import {getMockConfiguration} from 'utils/testHelpers';

export const getConfiguration = () => getMockConfiguration();
export const getMessage = message => getMockConfiguration().messages[message].defaultMessage;
