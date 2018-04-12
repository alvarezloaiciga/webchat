// @flow
declare var __VERSION__: string;
import * as React from 'react';
import moment from 'moment';
import {getOrientation, onOrientationChange} from 'utils/mobileUtils';
import {inNonProductionCluster, inLocalDevelopment} from 'Common/Utils';
import Button from 'core-ui/components/Button';
import {timesCircle} from 'core-ui/coreIcons';
import DevTools from './DevTools';
import PhraseListener from './PhraseListener';
import {version} from '../../../node_modules/quiq-chat/package.json';
import './styles/Debugger.scss';

type DebuggerProps = {};

type DebuggerState = {
  messages: Array<{
    message: string,
    timestamp: number,
  }>,
  hidden: boolean,
  height: number,
  width: number,
  orientation: 'portrait' | 'landscape',
};

export class Debugger extends React.Component<DebuggerProps, DebuggerState> {
  props: DebuggerProps;
  state: DebuggerState = {
    hidden: true,
    height: window.innerHeight,
    width: window.innerWidth,
    orientation: getOrientation(),
    messages: [],
  };
  updateInterval: number;
  messagesElement: any;

  componentDidMount() {
    onOrientationChange(({height, orientation}) =>
      this.setState({height, width: window.innerWidth, orientation}),
    );

    /* eslint-disable no-console */
    const oldDebug = console.debug;
    // $FlowIssue
    console.debug = (message, ...args) => {
      this.setState(
        {
          messages: [
            ...this.state.messages,
            {
              message: JSON.stringify(message, null, 2),
              timestamp: Date.now(),
            },
          ],
        },
        () => {
          if (this.messagesElement)
            this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
        },
      );
      oldDebug.apply(console, [message, ...args]);
    };
    /* eslint-disable no-console */
  }

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

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  render() {
    if (!this.shouldShowDebugger()) return null;

    if (this.state.hidden) return this.renderPhraseListener();

    return (
      <div className="Debugger">
        {this.renderPhraseListener()}
        <div className="row">
          <div className="lhsIcons">
            <DevTools />
            <div>{`h${this.state.height}w${this.state.width} ${this.state.orientation}`}</div>
          </div>
          <div className="rhsIcons">
            <div className="versions">
              <span>WC: v{__VERSION__}</span>
              <span>QC: v{version}</span>
            </div>
            <Button
              icon={timesCircle}
              title="Close Debugger"
              onClick={() => this.setState({hidden: true})}
            />
          </div>
        </div>
        <div
          className="row messages"
          ref={r => {
            this.messagesElement = r;
          }}
        >
          {this.state.messages.map((m, k) => (
            <div className="lineItem" key={k}>
              {`${moment(m.timestamp).format('hh:mm:ss')}: ${m.message}`}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Debugger;
