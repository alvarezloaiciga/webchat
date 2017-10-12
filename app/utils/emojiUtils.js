import {emojiIndex} from 'emoji-mart';
import type {EmojiMetadata, Emoji} from 'Common/Types';
import quiqOptions from 'Common/QuiqOptions';

// NOTE: In emoji-mart land, id === short_codes[0]

export const convertUnicodeToEmojiObject = (u: string): ?Emoji => {
  const emojiId = Object.keys(emojiIndex.emojis).find(k => emojiIndex.emojis[k].native === u);
  return emojiIndex.emojis[emojiId];
};

export const emojiFilter = (e: EmojiMetadata | Emoji) => {
  const emojiId = e.id || e.short_names[0];
  const {includeEmojis, excludeEmojis} = quiqOptions;
  // Prioritize include over exclude. Only one of the should be defined by customer, however.
  // If an emoji does not have a shortcode, DON'T include it if we're in "include" mode.
  // DO include it if we're in "exclude" mode.
  if (Array.isArray(includeEmojis) && includeEmojis.length > 0) {
    return includeEmojis.includes(emojiId);
  } else if (Array.isArray(excludeEmojis) && excludeEmojis.length > 0) {
    return !excludeEmojis.includes(emojiId);
  }

  // If neither exclude nor include was defined, always include emoji.
  return true;
};
