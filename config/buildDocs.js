const documentation = require('documentation');
const fs = require('fs');
const args = require("args-parser")(process.argv);
const copydir = require('copy-dir');
const mkdirp = require('mkdirp');
const Messages = require('../Common/Messages');
const reduce = require('lodash/reduce');
const toPairs = require('lodash/toPairs');
const fromPairs = require('lodash/fromPairs');
const sortBy = require('lodash/sortBy');

const outputDir = args.output || 'dist/docs';
const inputDir = args.input || 'docs';

const baseTitleLevel = 1;

const getHeader = level => `${' '.repeat(4 * (level - baseTitleLevel - 1))}- ${Array(baseTitleLevel + level + 1).join('#')}`;

const renderMessageDoc = (key, message, level) => {
  return `
${getHeader(level)} ${key}
${message.description}  
**Default value:** *${message.defaultMessage}*
  `;
};

const generateMessageMarkdown = (key, messages, level) => {
  // Skip private definitions
  if (messages.private) {
    return;
  }

  const title = key !== 'root' ?
    `${getHeader(level)} ${key} \n` : '';

  // Base case: messages is an IntlObject (we know this because id is a string, which means intl can try and format it)
  if (typeof messages.id === 'string') {
    return renderMessageDoc(key, messages, level);
  }

  return title + reduce(
    messages,
    (result, value, k) => result + (generateMessageMarkdown(k, value, level + 1) || ''),
    ''
  );
};

const targets = [
  {
    source: 'Common/types.js',
    output: 'types.md',
  },
  {
    source: 'SDK/src/SdkPrototype.js',
    output: 'sdk.md',
  },
  {
    source: 'Extensions/src/ExtensionSdk.js',
    output: 'extension.md',
  },
];

console.log("Building documentation...");

// Create outputDir if it doesn't yet exist
mkdirp.sync(outputDir);

// Copy input to output
copydir.sync(inputDir, outputDir);

// Build dynamic docs
for (const target of targets) {
  documentation.build([target.source], {ignorePatterns: [/\* @jsx h /]})
    .then(documentation.formats.md)
    .then(output => {
      // output is a string of Markdown data
      fs.writeFileSync(`${outputDir}/${target.output}`, output);
    });
}

// Build Intl message docs
const sortedMessages = fromPairs(sortBy(toPairs(Messages), 0));
generateMessageMarkdown('root', sortedMessages, 1);
const mdString = `# Chat strings \n You can override every piece of static text that appears in Webchat. This lets you match the app\'s verbage with your brand and provide translations for any language.' \n ${generateMessageMarkdown('root', Messages, 1) || ''}`;
fs.writeFileSync(`${outputDir}/strings.md`, mdString);