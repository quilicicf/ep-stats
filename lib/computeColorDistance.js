module.exports = (color1, color2) => (
  Math.abs(color1.red - color2.red)
  + Math.abs(color1.green - color2.green)
  + Math.abs(color1.blue - color2.blue)
);
