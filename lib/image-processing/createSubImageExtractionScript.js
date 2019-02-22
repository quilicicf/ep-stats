module.exports = (imageSize, subImageSize) => (
  (imagePath, outputPath) => (
    `convert \
     -crop ${subImageSize.width}x${subImageSize.height}+${subImageSize.horizontalOffset}+${subImageSize.verticalOffset} \
     ${imagePath} ${outputPath}
  `)
);
