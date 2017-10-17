import React, {Component} from 'react';
import quiqOptions from 'Common/QuiqOptions';
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor';
import {EditorState, ContentState, Modifier} from 'draft-js';
import createEmojiPlugin from '../emoji/draftjsTwemojiPlugin';
import 'draft-js/dist/Draft.css';
import './styles/EmojiTextArea.scss';

export type EmojiTextareaProps = {
  onReturn?: () => void,
  onChange?: (text: string) => void,
  style?: Object,
  maxLength?: number,
  disabled?: boolean,
  maxLength?: number,
  placeholder?: string,
};

export type EmojiTextareaState = {
  editorState?: EditorState,
};

const emojiPlugin = createEmojiPlugin();

const plugins = [emojiPlugin];

export default class EmojiTextArea extends Component {
  props: EmojiTextareaProps;
  state: EmojiTextareaState = {
    editorState: createEditorStateWithText(''),
  };

  constructor() {
    super();
    // If specified (for testing) make `setText` available on window.
    // this is required for programatically interacting with draft-js
    const internal = quiqOptions._internal;
    if (internal.exposeDraftJsSetText) {
      window.__quiq__setText = this.setText;
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

  render() {
    return (
      <div className="EmojiTextArea" onClick={this.focus} style={this.props.style}>
        <Editor
          editorState={this.state.editorState}
          onChange={this._handleChange}
          handleBeforeInput={this._handleBeforeInput}
          handlePastedText={this._handlePastedText}
          handleReturn={this._handleReturn}
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
