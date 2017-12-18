// @flow
declare var __VERSION__: string;
import React from 'react';
import {connect} from 'react-redux';
import {getConfiguration} from 'reducers/chat';
import {inNonProductionCluster, inLocalDevelopment, inStandaloneMode} from 'Common/Utils';
import DevTools from './DevTools';
import PhraseListener from './PhraseListener';
import {version} from '../../../node_modules/quiq-chat/package.json';
import './styles/Debugger.scss';
import type {ChatState, ChatConfiguration} from 'Common/types';

type DebuggerProps = {
  configuration: ChatConfiguration,
};

type DebuggerState = {
  hidden: boolean,
};

export class Debugger extends React.Component<DebuggerProps, DebuggerState> {
  props: DebuggerProps;
  state: DebuggerState = {
    hidden: !this.props.configuration.debug,
  };

  shouldShowDebugger = () => inNonProductionCluster() || inLocalDevelopment();

  renderPhraseListener = () => (
    <PhraseListener
      listeners={[
        {
          phrase: 'quiqdebug',
          callback: () => this.setState({hidden: !this.state.hidden}),
          caseInsensitive: true,
        },
      ]}
    />
  );

  render() {
    if (!this.shouldShowDebugger()) return null;
    if (this.state.hidden) return this.renderPhraseListener();

    return (
      <div className="Debugger">
        {this.renderPhraseListener()}
        <div className="lhsIcons">
          <DevTools />
          <div>inStandaloneMode: {inStandaloneMode() ? 'true' : 'false'}</div>
        </div>
        <div className="rhsIcons">
          <div className="versions">
            <span>WC: v{__VERSION__}</span>
            <span>QC: v{version}</span>
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

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {},
)(Debugger);
