// @flow
import ReactDOM, {render} from 'react-dom';
import React from 'react';
import ToggleChatButton from './ToggleChatButton';
import {quiqContainerId} from 'Common/Constants';

export type LauncherProps = {};

const Launcher = (props: LauncherProps) => (
  <div>
    <ToggleChatButton />
  </div>
);

export const destructDefaultLauncher = () => {
  ReactDOM.unmountComponentAtNode(document.getElementById(quiqContainerId));
};

export const constructDefaultLauncher = () => {
  const root = document.createElement('div');
  root.id = quiqContainerId; // If for some reason you change this, make sure you update the webpack config to match it!
  document.getElementsByTagName('body')[0].appendChild(root);

  render(<Launcher />, document.getElementById(quiqContainerId));

  if (module.hot) {
    // $FlowIssue
    module.hot.accept('Launcher', () => {
      const NextLauncher = Launcher.default;
      render(<NextLauncher />, document.getElementById(quiqContainerId));
    });
  }
};
