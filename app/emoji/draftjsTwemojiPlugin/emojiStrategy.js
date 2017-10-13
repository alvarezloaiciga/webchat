import findWithRegex from './utils/findWithRegex';
import emojiRegex from 'emoji-regex';

const unicodeRegex = emojiRegex();

export default (contentBlock: Object, callback: Function) => {
  findWithRegex(unicodeRegex, contentBlock, callback);
};
