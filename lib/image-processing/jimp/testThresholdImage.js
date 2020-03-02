const _ = require('lodash');

const cropImage = require('./cropImage');
const readImage = require('./readImage');
const writeImage = require('./writeImage');
const thresholdImage = require('./thresholdImage');
const recognizeJs = require('../../ocr/recognizeJs');
const { global: { hits: hitsSize } } = require('../profiles/1536x2048');

const main = async () => {
  const imagePath = '/tmp/IMG_1787.png';

  const recognized = await readImage(imagePath)
    .then(jimpImage => cropImage(jimpImage, hitsSize))
    .then(cropped => thresholdImage(cropped, { thresholdLevel: 70, shouldInvert: true }))
    .then(threshold => writeImage(threshold, 'toto'))
    .then(tempPath => recognizeJs(tempPath));

  console.log(recognized);
};

main()
  .catch((error) => {
    throw error;
  });
