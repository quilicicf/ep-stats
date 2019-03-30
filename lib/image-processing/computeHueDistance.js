module.exports = (hue1, hue2) => 180 - Math.abs(Math.abs(hue1 - hue2) - 180);
