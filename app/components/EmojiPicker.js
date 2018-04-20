// @flow

// "Twemoji" emoji artwork by Twitter is licensed under CC BY 4.0

import React from 'react';
import {connect} from 'react-redux';
import {Picker} from 'emoji-mart';
import ClickOutside from 'react-click-outside-component';
import {getDisplayStringsFromDeepIntlObject} from 'core-ui/services/i18nService';
import {getConfiguration} from 'reducers/chat';
import './styles/EmojiMart.scss';
import type {Emoji, ChatConfiguration, ChatState} from 'Common/types';

export type EmojiPickerProps = {
  addEmoji: (emoji: Emoji) => void,
  visible?: boolean,
  onOutsideClick?: () => void,
  ignoreOutsideClickOnSelectors?: Array<string>,
  emojiFilter?: (e: Emoji) => boolean,
  configuration: ChatConfiguration,
};

const emojiSheet = require('core-ui/emoji/EmojiPicker/assets/emojiSheet.png');

export const EmojiPicker = (props: EmojiPickerProps) => {
  const handleClickOutside = (e: SyntheticMouseEvent<*>) => {
    if (!props.visible) return;

    if (Array.isArray(props.ignoreOutsideClickOnSelectors)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const selector of props.ignoreOutsideClickOnSelectors) {
        const nodes = document.querySelectorAll(selector);
        // eslint-disable-next-line no-restricted-syntax
        for (const node of nodes) {
          if (e.target instanceof Node && node.contains(e.target)) {
            return;
          }
        }
      }
    }

    if (props.onOutsideClick) {
      props.onOutsideClick();
    }
  };

  const formattedi18nStrings = getDisplayStringsFromDeepIntlObject(
    props.configuration.messages.emojiPicker,
  );

  return (
    <ClickOutside onClickOutside={handleClickOutside}>
      <Picker
        set="twitter"
        emojisToShowFilter={props.emojiFilter}
        native={false}
        autoFocus={true}
        onClick={props.addEmoji}
        color={props.configuration.colors.primary}
        i18n={formattedi18nStrings}
        emoji=""
        perLine={7}
        backgroundImageFn={() => emojiSheet}
        showPreview={false}
        style={{
          visibility: props.visible ? 'visible' : 'hidden',
          position: 'absolute',
          bottom: '70px',
          right: '20px',
          zIndex: 1000,
        }}
      />
    </ClickOutside>
  );
};

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {},
)(EmojiPicker);
