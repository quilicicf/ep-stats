#!/usr/bin/env node

const _ = require('lodash');

const titanColors = require('../lib/ep/titanColors');
const analyzeNewTitanProfile = require('../lib/image-processing/profiles/titan/analyzeNewTitanProfile');

const main = async () => {
  const imagesToAnalyze = {
    RED: '894',
    GREEN: '924',
    // BLUE: '834',
    HOLY: '918',
    DARK: '892',
  };

  const promise = _.reduce(
    imagesToAnalyze,
    (seed, imageNumber, color) => {
      return seed.then(() => analyzeNewTitanProfile(`/home/cyp/Downloads/Photos/IMG_0${imageNumber}.png`, titanColors[ color ]));
    },
    Promise.resolve(),
  );

  await promise;
};

try {
  main();
} catch (error) {
  throw error;
}
