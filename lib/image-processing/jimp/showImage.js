const _ = require('lodash');
const Jimp = require('jimp');
const chalk = require('chalk');

const readImage = require('./readImage');

const PIXEL_CHARACTER = String.fromCharCode(0x2584);

const renderLine = (image, bitmap, lineIndex) =>
  _(new Array(bitmap.width))
    .map((value, index) => index)
    .reduce(
      (seed, columnIndex) => {
        const {
          r: redBg, g: greenBg, b: blueBg, a: alphaBg,
        } = Jimp.intToRGBA(image.getPixelColor(columnIndex, lineIndex));
        const {
          r: redFg, g: greenFg, b: blueFg,
        } = Jimp.intToRGBA(image.getPixelColor(columnIndex, lineIndex + 1));

        const pixel = alphaBg === 0
          ? chalk.reset(' ')
          : chalk
            .bgRgb(redBg, greenBg, blueBg)
            .rgb(redFg, greenFg, blueFg)(PIXEL_CHARACTER);

        return [ ...seed, pixel ];
      },
      [],
    );

const renderMatrix = async (image, bitmap, maxWidth = process.stdout.columns) => {
  const columns = maxWidth || 80;
  const rows = process.stdout.rows || 24;

  if (bitmap.width > columns || (bitmap.height / 2) > rows) {
    image.scaleToFit(columns, rows * 2);
  }

  return _(new Array(Math.floor(bitmap.height / 2)))
    .map((value, index) => index * 2)
    .reduce(
      (seed, lineIndex) => [
        ...seed,
        renderLine(image, bitmap, lineIndex),
      ],
      [],
    );
};

const renderString = async (image, bitmap, maxWidth) => {
  const matrix = await renderMatrix(image, bitmap, maxWidth);
  return _(matrix)
    .map(line => _.join(line, ''))
    .join('\n');
};

module.exports = async (imagePath, maxWidth) => {
  const { image, bitmap } = await readImage(imagePath);
  return renderString(image, bitmap, maxWidth);
};
