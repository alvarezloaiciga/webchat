// @flow
declare var __VERSION__: string;
import React from 'react';
import quiqOptions from 'Common/QuiqOptions';
import {inNonProductionCluster, inLocalDevelopment} from 'Common/Utils';
import DevTools from './DevTools';
import PhraseListener from './PhraseListener';
import {version} from '../../../node_modules/quiq-chat/package.json';
import './styles/Debugger.scss';

type DebuggerState = {
  hidden: boolean,
};

export class Debugger extends React.Component<{}, DebuggerState> {
  state: DebuggerState = {
    hidden: !quiqOptions.debug,
  };

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
