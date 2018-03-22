// @flow
import * as React from 'react';
import debounce from 'lodash/debounce';
import messages from 'core-ui/messages';
import type {IntlMessage} from 'types';
import {getDisplayString} from 'core-ui/services/i18nService';

export type InputProps = {
  value?: string | null, // Null means parent doesn't want to track value
  initialValue?: string,
  onClick?: () => void,
  onBlur?: () => void,
  onFocus?: () => void,
  onChange?: (e: SyntheticInputEvent<>) => void,
  onKeyDown?: (e: SyntheticKeyboardEvent<> & SyntheticInputEvent<>) => void,
  onMouseOver?: () => void,
  onMouseOut?: () => void,
  onSubmit?: (value: string) => void,
  required?: boolean, // Presentational
  disabled?: boolean,
  maxLength?: number,
  debounce?: number,
  className?: string,
  inputStyle?: string | Object,
  placeholder?: IntlMessage | string,
  label?: IntlMessage | string,
  title?: IntlMessage | string,
  autoFocus?: boolean,
  'data-test'?: string, //eslint-disable-line react/no-unused-prop-types
};

type InputState = {
  value: string,
};

export class Input extends React.Component<InputProps, InputState> {
  state: InputState = {
    value: '',
  };
  static defaultProps = {
    value: '',
  };
  debouncedOnChange: any;
  input: any;

  componentDidMount() {
    /* eslint-disable react/no-did-mount-set-state */
    this.setState({value: this.props.initialValue || this.props.value || ''}, () => {
      if (this.props.onChange) {
        /*
         * We require this intermediate function because react discards the synthetic event
         * with the debounce call. Therefore without this function to persist it,
         * target would be undefined.
         */
        this.debouncedOnChange = this.props.debounce
          ? debounce(this.props.onChange, this.props.debounce)
          : this.props.onChange;
      }
    });
  }

  componentWillReceiveProps(nextProps: InputProps) {
    if (
      nextProps.value !== undefined &&
      nextProps.value !== null &&
      (nextProps.value !== this.props.value || nextProps.value !== this.state.value)
    ) {
      this.setState({value: nextProps.value});
    }
  }

  onChange = (e: SyntheticInputEvent<>) => {
    const value = e.target.value;
    e.persist();
    this.setState({value}, () => {
      if (this.props.onChange) {
        this.debouncedOnChange(e);
      }
    });
  };

  onKeyDown = (e: SyntheticKeyboardEvent<> & SyntheticInputEvent<>) => {
    if (e.keyCode === 13 && this.props.onSubmit) {
      this.props.onSubmit(this.state.value);
      e.preventDefault();
    } else if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  };

  getValue = () => this.state.value;

  /* eslint-disable jsx-a11y/no-autofocus */
  render() {
    return (
      <div className={`Input ${this.props.className || ''}`}>
        {this.props.label && (
          <label className="inputLabel" title={getDisplayString(this.props.title)}>
            {getDisplayString(this.props.label)}
            {this.props.required && (
              <span
                className="required"
                onMouseOver={this.props.onMouseOver}
                onMouseOut={this.props.onMouseOut}
                title={getDisplayString(messages.required)}
              >
                {' '}
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={r => {
            this.input = r;
          }}
          className={typeof this.props.inputStyle === 'string' ? this.props.inputStyle : ''}
          type="text"
          title={getDisplayString(this.props.title)}
          placeholder={getDisplayString(this.props.placeholder)}
          onClick={this.props.onClick}
          onChange={this.onChange}
          maxLength={this.props.maxLength}
          onKeyDown={this.onKeyDown}
          onBlur={this.props.onBlur}
          onFocus={this.props.onFocus}
          autoFocus={this.props.autoFocus}
          data-test={this.props['data-test']}
          onMouseOver={this.props.onMouseOver}
          onMouseOut={this.props.onMouseOut}
          value={this.state.value}
          style={typeof this.props.inputStyle === 'object' ? this.props.inputStyle : undefined}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}

export default Input;
