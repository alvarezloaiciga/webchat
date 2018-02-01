import React, {Component} from 'react';
import {connect} from 'react-redux';
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor';
import {EditorState, ContentState, Modifier} from 'draft-js';
import createEmojiPlugin from '../emoji/draftjsTwemojiPlugin';
import {getConfiguration} from 'reducers/chat';
import 'draft-js/dist/Draft.css';
import './styles/EmojiTextArea.scss';
import type {ChatState, ChatConfiguration} from 'Common/types';

export type EmojiTextareaProps = {
  onReturn?: () => void,
  onChange?: (text: string) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  onIMEModeEntered?: (currentValue: string) => void,
  style?: Object,
  maxLength?: number,
  disabled?: boolean,
  maxLength?: number,
  placeholder?: string,
  configuration: ChatConfiguration,
  'data-test'?: string, // eslint-disable-line react/no-unused-prop-types
};

export type EmojiTextareaState = {
  editorState?: EditorState,
};

const emojiPlugin = createEmojiPlugin();

const plugins = [emojiPlugin];

export class EmojiTextArea extends Component {
  props: EmojiTextareaProps;
  state: EmojiTextareaState = {
    editorState: createEditorStateWithText(''),
  };

  componentDidMount() {
    const internal = this.props.configuration._internal;
    if (internal.exposeDraftJsFunctions) {
      window.__quiq__draftJs = {
        setText: this.setText,
        getText: this.getPlaintext,
        getDisabled: () => this.props.disabled,
      };
    }
  }

  componentWillUnmount() {
    // Remove IME listener from content div
    const contentDiv = document.querySelector('.DraftEditor-root');
    if (contentDiv) {
      contentDiv.removeEventListener('compositionupdate', this._handleCompositionUpdate);
    }
  }

  componentDidUpdate() {
    // Watch content div for IME.
    // Because this div can be replaced at any time by React, we ensure a listener is attached after every render.
    // Note that event listeners are not duplicated if they reference the same handler function
    const contentDiv = document.querySelector('.DraftEditor-root');
    if (contentDiv) {
      contentDiv.addEventListener('compositionupdate', this._handleCompositionUpdate);
    }
  }

  focus = () => {
    this.editor.focus();
  };

  // See https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-emoji-plugin/src/modifiers/addEmoji.js
  insertEmoji = (emoji: string) => {
    const contentState = this.state.editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('emoji', 'IMMUTABLE', {
      emojiUnicode: emoji,
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const currentSelectionState = this.state.editorState.getSelection();

    let emojiAddedContent;
    let emojiEndPos = 0;
    let blockSize = 0;

    emojiAddedContent = Modifier.replaceText(
      contentState,
      currentSelectionState,
      emoji,
      null,
      entityKey,
    );

    emojiEndPos = currentSelectionState.getFocusOffset();
    const blockKey = currentSelectionState.getAnchorKey();
    blockSize = contentState.getBlockForKey(blockKey).getLength();

    // If the emoji is inserted at the end, a space is appended right after for
    // a smooth writing experience.
    if (emojiEndPos === blockSize) {
      emojiAddedContent = Modifier.insertText(
        emojiAddedContent,
        emojiAddedContent.getSelectionAfter(),
        ' ',
      );
    }

    const newEditorState = EditorState.push(
      this.state.editorState,
      emojiAddedContent,
      'insert-emoji',
    );
    this._handleChange(
      EditorState.forceSelection(newEditorState, emojiAddedContent.getSelectionAfter()),
    );
  };

  setText = (text: string) => {
    const textState = ContentState.createFromText(text);
    const newEditorState = EditorState.moveFocusToEnd(
      EditorState.push(this.state.editorState, textState),
    );
    this._handleChange(newEditorState);
  };

  getPlaintext = () => this.state.editorState.getCurrentContent().getPlainText() || '';

  _handleChange = editorState => {
    const textChanged =
      this.state.editorState.getCurrentContent().getPlainText() !==
      editorState.getCurrentContent().getPlainText();

    this.setState({editorState}, () => {
      if (textChanged && this.props.onChange) {
        this.props.onChange(editorState.getCurrentContent().getPlainText());
      }
    });
  };

  _maxLengthReached = (additionalCharacters: number): boolean => {
    // Enforce maxLength
    if (!(typeof this.props.maxLength === 'number')) return false;

    const currentContent = this.state.editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;

    return currentContentLength + additionalCharacters > this.props.maxLength;
  };

  _handleBeforeInput = () => {
    if (this._maxLengthReached(1)) return 'handled';
  };

  _handlePastedText = pastedText => {
    if (this._maxLengthReached(pastedText.length)) return 'handled';
  };

  _handleReturn = (e: SyntheticKeyboardEvent<*>) => {
    e.preventDefault();

    if (this.props.onReturn) {
      this.props.onReturn();
    }

    return 'handled';
  };

  _handleFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  };

  _handleBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  _handleCompositionUpdate = e => {
    if (this.props.onIMEModeEntered) {
      this.props.onIMEModeEntered(e.data);
    }
  };

  render() {
    return (
      <div
        className="EmojiTextArea"
        onClick={this.focus}
        style={this.props.style}
        data-test={this.props['data-test'] || null}
      >
        <Editor
          editorState={this.state.editorState}
          onChange={this._handleChange}
          handleBeforeInput={this._handleBeforeInput}
          handlePastedText={this._handlePastedText}
          handleDroppedFiles={() => 'handled'}
          handleReturn={this._handleReturn}
          onBlur={this._handleBlur}
          onFocus={this._handleFocus}
          plugins={plugins}
          ref={element => {
            this.editor = element;
          }}
          readOnly={this.props.disabled}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {},
  null,
  {withRef: true},
)(EmojiTextArea);
