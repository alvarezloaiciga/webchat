/* global __DEV__ */

/* eslint-disable no-undef */
__webpack_public_path__ = __DEV__
  ? 'https://quiq.dev:3000/app/webchat/'
  : `${document
      .querySelector('#quiqScript0')
      .src.slice(0, document.querySelector('#quiqScript0').src.indexOf('.com/') + 5)}webchat/`;
/* eslint-disable no-undef */
