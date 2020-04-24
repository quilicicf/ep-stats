/** Multiple characters allowed to account for OCR mis-readings */
const OPENING_BRACKET_CHARS = '[[(]';
const CLOSING_BRACKET_CHARS = '[\\])1Il]';

/** OCR sometimes reads 0 as O */
const NUMBER_CHARS = '[0-9O]';

/** Closing char is sometimes read twice like: [7]1 Medusa 78928 */
const PREFIX = `${OPENING_BRACKET_CHARS}${NUMBER_CHARS}+${CLOSING_BRACKET_CHARS}{1,2}`;

module.exports = {
  REGEX_PREFIX: new RegExp(`^${PREFIX} `),
  REGEX_FULL: new RegExp(`^${PREFIX} (.*) (${NUMBER_CHARS}+)$`), // Pseudo must be greedy, it can contain numbers
};
