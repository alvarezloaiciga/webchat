import 'cdnOverride';
import 'globalStyles';
import {nonCompatibleBrowser} from 'Common/Utils';
import {constructApp} from 'utils/domUtils';
import quiqOptions from '../Common/QuiqOptions';
import QuiqChatClient from 'quiq-chat';
import {configureStore} from 'store/index';
import {quiqContainerId} from 'Common/Constants';
import {init as initMalfunctionJunction} from './services/Postmaster';
import chat, {initialState} from 'reducers/chat';
import {updateChatConfigurationFromQuiqOptions} from 'actions/chatActions';
import 'services/orientationchange';

const init = () => {
  if (nonCompatibleBrowser()) return;

  QuiqChatClient.initialize(quiqOptions.host, quiqOptions.contactPoint);
  const store = configureStore(chat, initialState);

  // NOTE HARD: Postmaster must be initialized before setting quiqOptions in Redux
  initMalfunctionJunction(quiqOptions.clientDomain, store);

  // Update initial quiqOptions in Redux
  store.dispatch(updateChatConfigurationFromQuiqOptions(quiqOptions));

  const root = document.createElement('div');
  root.id = quiqContainerId; // If for some reason you change this, make sure you update the webpack config to match it!
  document.getElementsByTagName('body')[0].appendChild(root);

  constructApp(store);
};

// Conditionally load Intl polyfill for old versions of IE
// TODO: Load correct locale once we add i18n
if (!global.Intl) {
  require.ensure(['intl', 'intl/locale-data/jsonp/en.js'], function(require) {
    require('intl');
    require('intl/locale-data/jsonp/en.js');
    init();
  });
} else {
  init();
}
