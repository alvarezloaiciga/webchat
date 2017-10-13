import React from 'react';

const UFE0FgRegEx = /\uFE0F/g;

// https://github.com/appfigures/react-easy-emoji
// avoid using a string literal like '\u200D' here because minifiers expand it inline
const U200D = String.fromCharCode(0x200d);

// Courtesy of react-easy-emoji
// https://github.com/appfigures/react-easy-emoji
// Converts an emoji unicode to hexadecimal code point
// Note: this function originates from Twemoji itself, and encapsulates their file naming paradigm.
const unicodeToCodePoint = (unicodeSurrogates, sep) => {
  const r = [];
  let c = 0,
    p = 0;

  for (let i = 0; i < unicodeSurrogates.length; i++) {
    c = unicodeSurrogates.charCodeAt(i);
    if (p) {
      r.push((0x10000 + ((p - 0xd800) << 10) + (c - 0xdc00)).toString(16));
      p = 0;
    } else if (0xd800 <= c && c <= 0xdbff) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join(sep || '-');
};

// Note: this function originates from Twemoji itself, and encapsulates their file naming paradigm.
/**
 * Used to both remove the possible variant (skin tone characters)
 * and to convert utf16 into code points.
 * If there is a zero-width-joiner (U+200D) present, leave the variants in.
 * @param rawText {string} - The raw text of the emoji match
 */
const grabTheRightIcon = rawText =>
  unicodeToCodePoint(rawText.indexOf(U200D) < 0 ? rawText.replace(UFE0FgRegEx, '') : rawText);

export const Emoji = ({imagePath, imageSize, imageType, decoratedText, useNativeArt, ...props}) => {
  let emojiDisplay = null;
  if (useNativeArt === true) {
    emojiDisplay = <span>{props.children}</span>;
  } else {
    const icon = grabTheRightIcon(decoratedText);
    const backgroundImage = `url(${imagePath}${imageSize}/${icon}.${imageType})`;

    emojiDisplay = (
      <span className="emoji" style={{backgroundImage}}>
        {props.children}
      </span>
    );
  }

  return emojiDisplay;
};

export default Emoji;
