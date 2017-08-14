import {inNonProductionCluster, inLocalDevelopment} from 'utils/utils';
/* eslint-disable global-require */
if (inNonProductionCluster() || inLocalDevelopment()) {
  module.exports = require('./configureStore.dev');
} else {
  module.exports = require('./configureStore.prod');
}
