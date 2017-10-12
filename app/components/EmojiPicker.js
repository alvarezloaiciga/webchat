// @flow

import React from 'react';
import {Picker} from 'emoji-mart';
import ClickOutside from 'react-click-outside-component';
import {defineMessages} from 'react-intl';
import {getDisplayString} from 'Common/i18n';
import quiqOptions from 'Common/QuiqOptions';
import 'emoji-mart/css/emoji-mart.css';
import type {Emoji, IntlMessage} from 'Common/types';

export type EmojiPickerProps = {
  addEmoji: (emoji: Emoji) => void,
  visible?: boolean,
  onOutsideClick?: () => void,
  ignoreOutsideClickOnSelectors?: Array<string>,
  emojiFilter?: (e: Emoji) => boolean,
};

const messages: {[string]: IntlMessage} = defineMessages({
  search: {
    id: 'search',
    description: 'Emoji picker search',
    defaultMessage: 'Search',
  },
  notfound: {
    id: 'notfound',
    description: 'Emoji picker no results found label',
    defaultMessage: 'No Emoji Found',
  },
  searchResults: {
    id: 'searchResults',
    descriptions: 'Emoji picker search results label',
    defaultMessage: 'Search Results',
  },
  recent: {
    id: 'recent',
    description: 'Emoji picker recently used emoji label',
    defaultMessage: 'Frequently Used',
  },
  people: {
    id: 'people',
    description: 'emoji picker section label for people',
    defaultMessage: 'Smileys & People',
  },
  nature: {
    id: 'nature',
    description: 'emoji picker section label for nature',
    defaultMessage: 'Animals & Nature',
  },
  foods: {
    id: 'foods',
    description: 'emoji picker section label for foods',
    defaultMessage: 'Food & Drink',
  },
  activity: {
    id: 'activity',
    description: 'emoji picker section label for activity',
    defaultMessage: 'Activity',
  },
  places: {
    id: 'places',
    description: 'emoji picker section label for places',
    defaultMessage: 'Travel & Places',
  },
  objects: {
    id: 'objects',
    description: 'emoji picker section label for objects',
    defaultMessage: 'Objects',
  },
  symbols: {
    id: 'symbols',
    description: 'emoji picker section label for symbols',
    defaultMessage: 'Symbols',
  },
  flags: {
    id: 'flags',
    description: 'emoji picker section label for flags',
    defaultMessage: 'Flags',
  },
  custom: {
    id: 'custom',
    description: 'emoji picker section label for custom',
    defaultMessage: 'Other',
  },
});

const formattedi18nStrings = {
  search: getDisplayString(messages.search),
  notfound: getDisplayString(messages.notfound),
  categories: {
    search: getDisplayString(messages.searchResults),
    recent: getDisplayString(messages.recent),
    people: getDisplayString(messages.people),
    nature: getDisplayString(messages.nature),
    foods: getDisplayString(messages.foods),
    activity: getDisplayString(messages.activity),
    places: getDisplayString(messages.places),
    objects: getDisplayString(messages.objects),
    symbols: getDisplayString(messages.symbols),
    flags: getDisplayString(messages.flags),
    custom: getDisplayString(messages.custom),
  },
};

export const EmojiPicker = (props: EmojiPickerProps) => {
  const handleClickOutside = (e: SyntheticMouseEvent<*>) => {
    if (!props.visible) return;

    if (Array.isArray(props.ignoreOutsideClickOnSelectors)) {
      for (const selector of props.ignoreOutsideClickOnSelectors) {
        const nodes = document.querySelectorAll(selector);
        for (const node of nodes) {
          if (e.target instanceof Node) {
            if (node.contains(e.target)) {
              return;
            }
          }
        }
      }
    }

    if (props.onOutsideClick) {
      props.onOutsideClick();
    }
  };

  return (
    <ClickOutside onClickOutside={handleClickOutside}>
      <Picker
        set="twitter"
        emojisToShowFilter={props.emojiFilter}
        native={false}
        autoFocus={true}
        onClick={props.addEmoji}
        color={quiqOptions.colors.primary}
        i18n={formattedi18nStrings}
        emoji=""
        perLine={7}
        showPreview={false}
        style={{
          visibility: props.visible ? 'visible' : 'hidden',
          position: 'absolute',
          bottom: '70px',
          right: '20px',
        }}
      />
    </ClickOutside>
  );
};

export default EmojiPicker;
