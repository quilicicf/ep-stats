const _ = require('lodash');
const cliProgress = require('cli-progress');

const log = require('./conf/log');
const { ERROR } = require('./conf/logLevels');
const downloadPhoto = require('./google/photos/downloadPhoto');

module.exports = async (screenshots, lastCheckAsString) => {
  const screenshotsNumber = _.size(screenshots);
  log([ `${screenshotsNumber} screenshots since ${lastCheckAsString}. Downloading them...` ]);
  const progress = new cliProgress.SingleBar({ clearOnComplete: true }, cliProgress.Presets.shades_classic);
  progress.start(screenshotsNumber, 0);

  const filesPromise = _.reduce(
    screenshots,
    (seed, screenshot) => seed.then(({ files, errors }) => downloadPhoto(screenshot)
      .then((filePath) => {
        progress.increment(1);
        _.set(files, [ screenshot.fileName ], { ...screenshot, filePath });
        return { files, errors };
      })
      .catch((error) => {
        progress.increment(1);
        _.set(errors, [ screenshot.fileName ], error.message);
        return { files, errors };
      })),
    Promise.resolve({ files: {}, errors: {} }),
  );

  const { files, errors } = await filesPromise;
  progress.stop();

  if (!_.isEmpty(errors)) {
    _.each(errors, (message, fileName) => {
      log([ `Failed to download ${fileName}. Error: ${message}.` ], ERROR);
    });
    log([ `Will only process files without errors (${_.size(files)})\n` ], ERROR);
  }

  return files;
};
