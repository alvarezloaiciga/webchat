import decorateComponentWithProps from 'decorate-component-with-props';
import {EditorState} from 'draft-js';
import Emoji from './components/Emoji';
import emojiStrategy from './emojiStrategy';
import attachImmutableEntitiesToEmojis from './modifiers/attachImmutableEntitiesToEmojis';

const defaultImagePath = '//twemoji.maxcdn.com/2/';
const defaultImageType = 'png';
const defaultImageSize = '72x72';
const defaultCacheBustParam = '?v=2.2.7';

// TODO activate/deactivate different the conversion or search part

export default (config = {}) => {
  const callbacks = {
    keyBindingFn: undefined,
    handleKeyCommand: undefined,
    onDownArrow: undefined,
    onUpArrow: undefined,
    onTab: undefined,
    onEscape: undefined,
    handleReturn: undefined,
    onChange: undefined,
  };

  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
  };

  // Styles are overwritten instead of merged as merging causes a lot of confusion.
  //
  // Why? Because when merging a developer needs to know all of the underlying
  // styles which needs a deep dive into the code. Merging also makes it prone to
  // errors when upgrading as basically every styling change would become a major
  // breaking change. 1px of an increased padding can break a whole layout.
  const {
    imagePath = defaultImagePath,
    imageType = defaultImageType,
    imageSize = defaultImageSize,
    allowImageCache,
    useNativeArt,
  } = config;

  const cacheBustParam = allowImageCache ? '' : defaultCacheBustParam;

  return {
    decorators: [
      {
        strategy: emojiStrategy,
        component: decorateComponentWithProps(Emoji, {
          imagePath,
          imageType,
          imageSize,
          cacheBustParam,
          useNativeArt,
        }),
      },
    ],

    initialize: ({getEditorState, setEditorState}) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },

    onDownArrow: keyboardEvent => callbacks.onDownArrow && callbacks.onDownArrow(keyboardEvent),
    onTab: keyboardEvent => callbacks.onTab && callbacks.onTab(keyboardEvent),
    onUpArrow: keyboardEvent => callbacks.onUpArrow && callbacks.onUpArrow(keyboardEvent),
    onEscape: keyboardEvent => callbacks.onEscape && callbacks.onEscape(keyboardEvent),
    handleReturn: keyboardEvent => callbacks.handleReturn && callbacks.handleReturn(keyboardEvent),
    onChange: editorState => {
      let newEditorState = attachImmutableEntitiesToEmojis(editorState);

      if (!newEditorState.getCurrentContent().equals(editorState.getCurrentContent())) {
        // Forcing the current selection ensures that it will be at it's right place.
        // This solves the issue where inserting an Emoji on OSX with Apple's Emoji
        // selector led to the right selection the data, but wrong position in
        // the contenteditable.
        newEditorState = EditorState.forceSelection(newEditorState, newEditorState.getSelection());
      }

      if (callbacks.onChange) return callbacks.onChange(newEditorState);
      return newEditorState;
    },
  };
};
