module.exports = (imageSize, subImageSize) => {
  const resizeScript = `-crop ${subImageSize.width}x${subImageSize.height}+${subImageSize.horizontalOffset}+${subImageSize.verticalOffset}`;
  return (imagePath, outputPath) => (
    `convert \
      "${imagePath}" \
      -write mpr:P1 \
      +delete \
      -respect-parentheses \
      \\( mpr:P1 ${resizeScript}        +write mpr:P2 \\) \
      \\( mpr:P2 -threshold 90% -negate +write "${outputPath}" \\) \
      null:
  `);
};
