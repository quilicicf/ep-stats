const { render } = require('node-sass');

const { STYLE_ENTRY_POINT, STYLE_OUTPUT_PATH } = require('./constants');
const writeFile = require('../lib/fs/writeFile');

const SASS_OPTIONS = {
  file: STYLE_ENTRY_POINT,
  outFile: STYLE_OUTPUT_PATH,
  sourceMap: true,
};

module.exports = async () => {
  const { css, map } = await new Promise((resolve, reject) => {
    render(SASS_OPTIONS, (error, result) => {
      if (error) { return reject(error); }
      return resolve(result);
    });
  });

  return writeFile(STYLE_OUTPUT_PATH, Buffer.concat([ css, map ]));
};
