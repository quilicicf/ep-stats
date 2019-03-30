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

  const promises = _.map(
    imagesToAnalyze,
    (imageNumber, color) => analyzeNewTitanProfile(`/home/cyp/Downloads/Photos/IMG_0${imageNumber}.png`, titanColors[ color ]),
  );

  await Promise.all(promises);
  console.log();
};

try {
  main();
} catch (error) {
  throw error;
}
