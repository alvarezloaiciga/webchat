import React, {Component} from 'react';
import {connect} from 'react-redux';
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor';
import {EditorState, ContentState, Modifier} from 'draft-js';
import createEmojiPlugin from 'core-ui/emoji/draftjsTwemojiPlugin';
import {getConfiguration} from 'reducers/chat';
import {getBrowserName} from '../../Common/Utils';
import type {ChatState, ChatConfiguration} from 'Common/types';
import {css} from 'react-emotion';

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

const EmojiTextAreaStyle = css`
  display: flex;
  align-items: center;
  overflow: auto;
  width: 320px; // 320 + 10padding = 330
  background: #fff;
  line-height: 1.3em;
  margin: auto 0 auto 10px;
  flex: 1 1 auto;
  border: none;
  resize: none;
  font-size: 14px;

  &:focus {
    outline: none;
  }

  .DraftEditor-root {
    flex: 1;
    max-width: 100%;
  }

  &:global(.public-DraftEditor-content) {
    min-height: 140px;
  }

  /* Based on https://github.com/draft-js-plugins/draft-js-plugins */
  .emoji {
    background-position: center;
    /* make sure the background the image is only shown once */
    background-repeat: no-repeat;
    background-size: contain;
    /* move it a bit further down to align it nicer with the text */
    vertical-align: middle;

    /*
    We need to limit the emoji width because it can be multiple characters
    long if it is a 32bit unicode. Since the proper width depends on the font and
    it's relationship between 0 and other characters it's not ideal. 1.95ch is not
    the best value, but hopefully a good enough approximation for most fonts.
    */
    display: inline-block;
    visibility: visible;
    overflow: hidden;
    max-width: 1.95ch;
    /*
    Needed for iOS rendering to avoid some icons using a lot of height without
    actually needing it.
    */
    max-height: 1em;
    line-height: inherit;
    margin: -0.2ex 0em 0.2ex;
    color: transparent;

    span {
      opacity: 0;
    }
  }
`;

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

    // Fix for Edge issue where typing is disabled and pressing RETURN enters new lines instead of sending
    if (getBrowserName() === 'Edge') {
      setTimeout(() => this.focus(), 100);
    }
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
        className={`EmojiTextArea ${EmojiTextAreaStyle}`}
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
