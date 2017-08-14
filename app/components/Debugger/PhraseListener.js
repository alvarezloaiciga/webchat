// @flow

import React from 'react';

type listener = {
  phrase: string,
  callback: Function,
  caseInsensitive: boolean,
};

type PhraseListenerProps = {
  listeners: Array<listener>,
  timeout: number,
};

type PhraseListenerState = {
  keys: string,
};

export class PhraseListener extends React.Component {
  props: PhraseListenerProps;
  state: PhraseListenerState = {keys: ''};
  timeoutFunctionId: number;

  static defaultProps = {timeout: 5000};

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutFunctionId);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  resetTimeout = () => {
    clearTimeout(this.timeoutFunctionId);
    this.timeoutFunctionId = setTimeout(() => {
      this.setState({keys: ''});
    }, this.props.timeout);
  };

  handleKeyDown = (e: {keyCode: number}) => {
    this.resetTimeout();

    this.setState({keys: this.state.keys + String.fromCharCode(e.keyCode).toLowerCase()});
    this.props.listeners.forEach(l => {
      const {phrase, callback, caseInsensitive} = l;

      if (
        this.state.keys.includes(phrase) ||
        (caseInsensitive && this.state.keys.toLowerCase().includes(phrase.toLowerCase()))
      ) {
        callback();
        this.setState({keys: ''});
      }
    });
  };

  render() {
    return null;
  }
}

export default PhraseListener;
