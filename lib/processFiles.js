const _ = require('lodash');

const processOneFile = require('./processOneFile');

module.exports = async (files, screenshotProfile, members, initialCache, holidays) => {
  const orderedScreenshots = _.chain(files)
    .values()
    .sortBy('date')
    .value();

  return _.reduce(
    orderedScreenshots,
    (seed, screenshot) => seed
      .then(cache => processOneFile(cache, screenshot, screenshotProfile, members, holidays)),
    Promise.resolve(initialCache),
  );
};

