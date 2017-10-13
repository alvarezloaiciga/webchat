import {emojiIndex} from 'emoji-mart';
import emojiRegexFactory from 'emoji-regex';
import invertBy from 'lodash/invertBy';
import type {EmojiMetadata, Emoji} from 'Common/Types';
import quiqOptions from 'Common/QuiqOptions';

const emojiRegex = emojiRegexFactory();

// Build lookup table of {unifiedCode : emojiId}
const emojiIdByUnified = {};
Object.keys(emojiIndex.emojis).forEach(id => {
  const unified = emojiIndex.emojis[id].unified.toLowerCase();
  emojiIdByUnified[unified] = id;
});

export const isSingleEmoji = (text: string): boolean => {
  // We know a string contains only one emoji iff
  // 1) An emoji regex finds only one match in the string, and
  // 2) The number of characters in that emoji === the number of characters in the string
  const emojis = text.match(emojiRegex);

  if (!emojis)
    return false;

  const emojiCharCount = emojis.reduce((count, e) => count + e.length, 0);
  return emojis.length === 1 && text.length === emojiCharCount;
};

export const convertUnicodeToEmojiObject = (u: string): ?Emoji => {
  const emojiId = Object.keys(emojiIndex.emojis).find(k => emojiIndex.emojis[k].native === u);
  return emojiIndex.emojis[emojiId];
};

// This function is used for filtering emojis in our picker, as well as redacting emojis prior to sending a message.
export const emojiFilter = (e: EmojiMetadata | Emoji | string) => {
  let emojiId;
  // emoji-mart will call this function when user is searching, but it only passes unicode string:
  if (typeof e === 'string') {
    emojiId =  emojiIdByUnified[e.toLowerCase()];
  } else {
    // NOTE: In emoji-mart land, id === short_codes[0]
    emojiId = e.id || e.short_names[0];
  }

  // Don't include any emojis that don't have id or shortcode (we don't know what they are)
  if (!emojiId)
    return false;

  const {includeEmojis, excludeEmojis} = quiqOptions;
  // Prioritize include over exclude. Only one of the should be defined by customer, however.
  if (Array.isArray(includeEmojis)) {
    return includeEmojis.includes(emojiId);
  }
  else if (Array.isArray(excludeEmojis)) {
    return !excludeEmojis.includes(emojiId);
  }

  // If neither exclude nor include was defined, always include emoji.
  return true;
};
