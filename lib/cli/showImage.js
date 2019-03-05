const _ = require('lodash');
const { readFile } = require('fs');

const chalk = require('chalk');
const Jimp = require('@sindresorhus/jimp');

const PIXEL_CHARACTER = String.fromCharCode(0x2584);

const readFileBuffer = async filePath => new Promise((resolve, reject) => {
  readFile(filePath, (error, buffer) => {
    if (error) { return reject(error); }
    return resolve(buffer);
  });
});

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

const renderMatrix = async (buffer, maxWidth = process.stdout.columns) => {
  const image = await Jimp.read(buffer);
  const { bitmap } = image;

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

const renderString = async (imageBuffer, maxWidth) => {
  const matrix = await renderMatrix(imageBuffer, maxWidth);
  return _(matrix)
    .map(line => _.join(line, ''))
    .join('\n');
};

module.exports = async (imagePath, maxWidth) => {
  const imageBuffer = await readFileBuffer(imagePath);
  return renderString(imageBuffer, maxWidth);
};
