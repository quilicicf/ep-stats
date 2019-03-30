const toHsv = require('rgb-hsv');

module.exports = ({ red, green, blue }) => {
  const [ hue, saturation, value ] = toHsv(red, green, blue);
  return { hue, saturation, value };
};
