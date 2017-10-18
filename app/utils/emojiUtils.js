import {emojiIndex} from 'emoji-mart';
import emojiRegexFactory from 'emoji-regex/text';
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

  // If no emojis or more than one emoji were found, we can return false.
  if (!emojis || emojis.length > 1) return false;

  const e = emojis[0];
  const emojiCharCount = e.length;
  const emojiVariationSelectorCount = (e.match('\uFE0F') || []).length;
  const totalVariationSelectorCount = (text.match('\uFE0F') || []).length;

  // We want number of characters in emoji to match number of characters in string.
  // However, if we can explain away the difference by stray variation selector characters,
  // we still have a single emoji.
  const lengthDifference =
    text.length - emojiCharCount - totalVariationSelectorCount + emojiVariationSelectorCount;

  return lengthDifference === 0;
};

export const filterEmojisFromText = (text: string): string =>
  text.trim().replace(emojiRegex, u => {
    const emoji = convertUnicodeToEmojiObject(u);
    if (emoji && !emojiFilter(emoji)) return '';
    return u;
  });

export const convertUnicodeToEmojiObject = (u: string): ?Emoji => {
  const emojiId = Object.keys(emojiIndex.emojis).find(k => emojiIndex.emojis[k].native === u);
  return emojiIndex.emojis[emojiId];
};

// This function is used for filtering emojis in our picker, as well as redacting emojis prior to sending a message.
// Note that the string passed to this function must be the unified code, but NOT the actual unicode. (IE101, not \uIE101)
export const emojiFilter = (e: EmojiMetadata | Emoji | string) => {
  let emojiId;
  // emoji-mart will call this function when user is searching, but it only passes unicode string:
  if (typeof e === 'string') {
    emojiId = emojiIdByUnified[e.toLowerCase()];
  } else {
    // NOTE: In emoji-mart land, id === short_codes[0]
    // This is difference between Emoji and EmojiMetadata types
    emojiId = e.id || e.short_names[0];
  }

  // Don't include any emojis that don't have id or shortcode (we don't know what they are)
  if (!emojiId) return false;

  const {includeEmojis, excludeEmojis} = quiqOptions;
  // Prioritize include over exclude. Only one of the should be defined by customer, however.
  if (Array.isArray(includeEmojis)) {
    return includeEmojis.includes(emojiId);
  } else if (Array.isArray(excludeEmojis)) {
    return !excludeEmojis.includes(emojiId);
  }

  // If neither exclude nor include was defined, always include emoji.
  return true;
};

/**
 * Emojis are entirely disabled if the customer passes an empty array for the `emojisEnabled` quiq option
 */
export const emojisEnabledByCustomer = () => {
  const {includeEmojis} = quiqOptions;
  return !(Array.isArray(includeEmojis) && includeEmojis.length === 0);
};
