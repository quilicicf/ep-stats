const SCREENSHOT_HEADER_WIDTH_REDUCER = 0.8;
const SCREENSHOT_HEADER_HEIGHT_REDUCER = 0.9;

module.exports = (image, titanHeaderLocation) => {
  const headerMidHeight = Math.round(titanHeaderLocation.verticalOffset / 2);
  const headerHalfHeight = Math.round((titanHeaderLocation.verticalOffset / 2) * SCREENSHOT_HEADER_HEIGHT_REDUCER);

  const headerTop = headerMidHeight - headerHalfHeight;
  const headerHeight = headerHalfHeight * 2;

  const headerWidth = Math.round(titanHeaderLocation.width * SCREENSHOT_HEADER_WIDTH_REDUCER);
  const headerLeft = Math.round(image.bitmap.width / 2) - Math.round(headerWidth / 2);

  return {
    verticalOffset: headerTop,
    horizontalOffset: headerLeft,
    width: headerWidth,
    height: headerHeight,
  };
};
