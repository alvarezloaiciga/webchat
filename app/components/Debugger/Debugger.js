// @flow
declare var __VERSION__: string;
import React from 'react';
import QUIQ from 'utils/quiq';
import {inNonProductionCluster, inLocalDevelopment} from 'utils/utils';
import DevTools from './DevTools';
import PhraseListener from './PhraseListener';
import {getChatClient} from '../../ChatClient';
import {version} from '../../../node_modules/quiq-chat/package.json';
import './styles/Debugger.scss';
import type {QuiqChatClientType} from 'quiq-chat';

type DebuggerState = {
  hidden: boolean,
};

export class Debugger extends React.Component {
  state: DebuggerState = {
    hidden: !QUIQ.DEBUG,
  };
  client: QuiqChatClientType;

  constructor() {
    super();
    this.client = getChatClient();
  }

  shouldShowDebugger = () => inNonProductionCluster() || inLocalDevelopment();

  renderPhraseListener = () =>
    <PhraseListener
      listeners={[
        {
          phrase: 'quiqdebug',
          callback: () => this.setState({hidden: !this.state.hidden}),
          caseInsensitive: true,
        },
      ]}
    />;

  render() {
    if (!this.shouldShowDebugger()) return null;
    if (this.state.hidden) return this.renderPhraseListener();

    return (
      <div className="Debugger">
        {this.renderPhraseListener()}
        <div className="lhsIcons">
          <DevTools />
          {
            <i
              className={`fa fa-sign-in icon`}
              title="AndrewTest Auth User via Secure Cookie (Old Deprecated Way)"
              onClick={this.client.DEPRECATED_AUTH_USER_DO_NOT_USE}
            />
          }
        </div>
        <div className="rhsIcons">
          <div className="versions">
            <span>
              WC: v{__VERSION__}
            </span>
            <span>
              QC: v{version}
            </span>
          </div>
          <i
            className={`fa fa-close icon`}
            title="Close Debugger"
            onClick={() => this.setState({hidden: true})}
          />
        </div>
      </div>
    );
  }
}

export default Debugger;
