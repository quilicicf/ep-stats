#!/usr/bin/env node

const _ = require('lodash');
const Jimp = require('jimp');
const { resolve: resolvePath } = require('path');
const { homedir } = require('os');

const readFileBuffer = require('../lib/fs/readFileBuffer');

const IMAGES_FOLDER = resolvePath(homedir(), 'Downloads', 'Photos');
const PAD_LENGTH = 8;
const HEAL_STRING = _.padEnd('HEAL', PAD_LENGTH);
const ATTACK_STRING = _.padEnd('ATTACK', PAD_LENGTH);
const ARROW_STRING = _.padEnd('ARROWS', PAD_LENGTH);

const getImage = async (name) => {
  const imagePath = resolvePath(IMAGES_FOLDER, name);
  const imageBuffer = await readFileBuffer(imagePath);
  return Jimp.read(imageBuffer);
};

const diffColor = (referenceValue, otherValue) => {
  const result = Math.abs(referenceValue - otherValue) / 255;
  return result;
};

const diffPixel = (referenceImage, otherImage, columnIndex, lineIndex) => {
  const {
    r: redRef, g: greenRef, b: blueRef,
  } = Jimp.intToRGBA(referenceImage.getPixelColor(columnIndex, lineIndex + 1));
  const {
    r: redOther, g: greenOther, b: blueOther,
  } = Jimp.intToRGBA(otherImage.getPixelColor(columnIndex, lineIndex + 1));

  const unweightedDiff = _.reduce(
    [
      diffColor(redRef, redOther),
      diffColor(greenRef, greenOther),
      diffColor(blueRef, blueOther),
    ],
    (seed, diff) => seed + diff,
    0,
  );
  return unweightedDiff / 3;
};

const diffLine = (referenceImage, otherImage, lineIndex) => {
  const unweightedDiff = _(new Array(24))
    .map((value, index) => index)
    .reduce(
      (seed, columnIndex) => {
        const bgPixelDiff = diffPixel(referenceImage, otherImage, columnIndex, lineIndex);
        const fgPixelDiff = diffPixel(referenceImage, otherImage, columnIndex, lineIndex + 1);

        return seed + bgPixelDiff + fgPixelDiff;
      },
      0,
    );
  return unweightedDiff / 24;
};

const toPercentage = fraction => Math.round(fraction * 100);

const compareImages = (referenceImage, otherImage) => {
  const resizedOtherImage = otherImage.resize(24, 24);

  const unweightedDiff = _(new Array(24))
    .map((value, index) => index * 2)
    .reduce((seed, lineIndex) => seed + diffLine(referenceImage, resizedOtherImage, lineIndex), 0);

  return toPercentage(1 - (unweightedDiff / 24));
};

const main = async () => {
  const images = {
    heal: await getImage('heal.png'),
    heal_24: await getImage('heal_24.png'),
    attack: await getImage('attack.png'),
    attack_24: await getImage('attack_24.png'),
    arrow: await getImage('arrow.png'),
    arrow_24: await getImage('arrow_24.png'),
  };

  process.stdout.write(`
    ${HEAL_STRING} <-> ${HEAL_STRING}: ${compareImages(images.heal_24, images.heal)}
    ${HEAL_STRING} <-> ${ATTACK_STRING}: ${compareImages(images.heal_24, images.attack)}
    ${HEAL_STRING} <-> ${ARROW_STRING}: ${compareImages(images.heal_24, images.arrow)}

    ${ATTACK_STRING} <-> ${HEAL_STRING}: ${compareImages(images.attack_24, images.heal)}
    ${ATTACK_STRING} <-> ${ATTACK_STRING}: ${compareImages(images.attack_24, images.attack)}
    ${ATTACK_STRING} <-> ${ARROW_STRING}: ${compareImages(images.attack_24, images.arrow)}

    ${ARROW_STRING} <-> ${HEAL_STRING}: ${compareImages(images.arrow_24, images.heal)}
    ${ARROW_STRING} <-> ${ATTACK_STRING}: ${compareImages(images.arrow_24, images.attack)}
    ${ARROW_STRING} <-> ${ARROW_STRING}: ${compareImages(images.arrow_24, images.arrow)}
  `);
};

main().catch(error => process.stderr.write(`${error.stack}\n`));
