const { resolve: resolvePath } = require('path');

module.exports = {
  USER_WORDS_PATH: resolvePath(__dirname, 'user_words.txt'),
  PSMS: {
    OSD_ONLY: { value: 0, description: 'Orientation and script detection (OSD) only.' },
    APS_WITH_OSD: { value: 1, description: 'Automatic page segmentation with OSD.' },
    APS_NO_OSD: { value: 2, description: 'Automatic page segmentation, but no OSD, or OCR.' },
    FAPS_NO_OSD: { value: 3, description: 'Fully automatic page segmentation, but no OSD. (Default)' },
    SINGLE_COLUMN_VARIABLE_SIZES: { value: 4, description: 'Assume a single column of text of variable sizes.' },
    SINGLE_UNIFORM_BLOCK_VERTICALLY_ALIGN: { value: 5, description: 'Assume a single uniform block of vertically aligned text.' },
    SINGLE_UNIFORM_BLOCK_OF_TEXT: { value: 6, description: 'Assume a single uniform block of text.' },
    SINGLE_LINE: { value: 7, description: 'Treat the image as a single text line.' },
    SINGLE_WORD: { value: 8, description: 'Treat the image as a single word.' },
    SINGLE_WORD_IN_CIRCLE: { value: 9, description: 'Treat the image as a single word in a circle.' },
    SINGLE_CHARACTER: { value: 10, description: 'Treat the image as a single character.' },
    AS_MUCH_TEXT_AS_POSSIBLE: { value: 11, description: 'Sparse text. Find as much text as possible in no particular order.' },
    SPARSE_TEXT_WITH_OSD: { value: 12, description: 'Sparse text with OSD.' },
    SINGLE_LINE_no_HACKS: { value: 13, description: 'Raw line. Treat the image as a single text line, bypassing hacks that are Tesseract-specific.' },
  },
};
