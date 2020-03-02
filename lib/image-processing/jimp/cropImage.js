module.exports = async (
  { image, bitmap },
  {
    width, height, horizontalOffset, verticalOffset,
  }) => {

  image.crop(horizontalOffset, verticalOffset, width, height);
  return { image, bitmap };
};
