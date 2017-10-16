jest.mock('Common/QuiqOptions');

import * as EmojiUtils from '../emojiUtils';

describe('Emoji Utils', () => {
  describe('isSingleEmoji', () => {
    it('returns false when no emojis are in text', () => {
      expect(EmojiUtils.isSingleEmoji('no emojis here!!!')).toBe(false);
    });

    it('returns false when multiple emojis are in text', () => {
      expect(EmojiUtils.isSingleEmoji('😀 😀')).toBe(false);
    });
    it('returns false when one emoji is in text with other chars', () => {
      expect(EmojiUtils.isSingleEmoji('😀 hey')).toBe(false);
    });
    it('returns true when exactly one emoji is in text', () => {
      expect(EmojiUtils.isSingleEmoji('😀')).toBe(true);
    });
  });
  describe('convertUnicodeToEmojiObject', () => {
    it('returns an emoji-mart object given a unicode string', () => {
      expect(EmojiUtils.convertUnicodeToEmojiObject('😀')).toEqual({
        colons: ':grinning:',
        emoticons: [],
        id: 'grinning',
        name: 'Grinning Face',
        native: '😀',
        skin: null,
        unified: '1f600',
      });
    });
  });
  describe('emojiFilter', () => {
    it('returns true for unified string that is not excluded', () => {
      expect(EmojiUtils.emojiFilter('1f600')).toBe(true);
    });
  });
});
