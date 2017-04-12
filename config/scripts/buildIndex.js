/* eslint-disable no-console */
const fs = require('fs');

const cdnUrl = process.env.QUIQ_CDN || './';
const dist = './dist/';
const scriptPaths = [];
const cssPaths = [];

fs.readdir(dist, (readError, files) => {
  if (readError) {
    console.log(`Error reading dist directory. \n\n ${readError} \n\nAborting`);
    process.exit(1);
  }

  files.forEach(file => {
    if (file.endsWith('.js')) {
      console.log(`Adding Javascript ${file} to webchat.js`);
      scriptPaths.push(file);
    }
    else if (file.endsWith('.css')) {
      console.log(`Adding CSS ${file} to webchat.js`);
      cssPaths.push(file);
    }
  });

  const scripts = scriptPaths.map((path, index) => (
`var QUIQ_INCLUDE_SCRIPT_${index} = document.createElement('script');
QUIQ_INCLUDE_SCRIPT_${index}.src = "${cdnUrl}${path}";
document.getElementsByTagName('head')[0].appendChild(QUIQ_INCLUDE_SCRIPT_${index});`
  )).join('\n');

  const styles = cssPaths.map((path, index) => (
`var QUIQ_INCLUDE_STYLE_${index} = document.createElement('link');
QUIQ_INCLUDE_STYLE_${index}.rel = "stylesheet";
QUIQ_INCLUDE_STYLE_${index}.href = "${cdnUrl}${path}";
document.getElementsByTagName('head')[0].appendChild(QUIQ_INCLUDE_STYLE_${index});`
  )).join('\n');

  fs.open(`${dist}/index.js`, 'w', function (createError, fd) {
    if (createError) {
      console.log(`Error creating index. \n\n ${createError} \n\nAborting`);
      process.exit(1);
    }

    const buffer = new Buffer(`${scripts}\n${styles}`);
    fs.write(fd, buffer, 0, buffer.length, null, function(writeError) {
      if (writeError) {
        console.log(`Error creating index. \n\n ${writeError} \n\nAborting`);
        process.exit(1);
      }

      fs.close(fd, function (saveError) {
        if (saveError) {
          console.log(`Error saving index. \n\n ${saveError} \n\nAborting`);
          process.exit(1);
        }
        else {
          console.log('Successfully generated index.js file');
          process.exit(0);
        }
      });
    });
  });
});
