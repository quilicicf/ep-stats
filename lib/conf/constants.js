const { existsSync, mkdirSync } = require('fs');
const { homedir } = require('os');
const { resolve: resolvePath } = require('path');

const CONFIG_DIR_PATH = resolvePath(homedir(), '.config');
const EP_STATS_CONFIG_DIR_PATH = resolvePath(CONFIG_DIR_PATH, 'ep-stats');

if (!existsSync(CONFIG_DIR_PATH)) { mkdirSync(CONFIG_DIR_PATH); }
if (!existsSync(EP_STATS_CONFIG_DIR_PATH)) { mkdirSync(EP_STATS_CONFIG_DIR_PATH); }

const WAR_INFO_TYPE = 'warInfo';
const TITAN_INFO_TYPE = 'titanInfo';
const WAR_HITS_TYPE = 'warHits';
const TITAN_HITS_TYPE = 'titanHits';

/**
 * Minimal similarity to match an unparsable pseudo.
 * Example: matching -king。你的一 to king, which is hard because chinese-enabled OCR does not work
 * well so the OCR is done in English and the pseudo is parsed as rubbish like: -king, {RHI-
 *
 * A too high number would match members that are no longer there to anyone, a too small would
 * never match tough pseudos. You need to tread carefully here and make sure you review
 * these cases. You'll get warnings in the console to help you do that though.
 */
const MINIMAL_SIMILARITY_UNPARSABLE = 0.4;

module.exports = {
  CONFIGURATION_PATH: resolvePath(EP_STATS_CONFIG_DIR_PATH, 'configuration.json'),
  LOGS_PATH: resolvePath(EP_STATS_CONFIG_DIR_PATH, 'execution_logs.txt'),
  CACHE_PATH: resolvePath(EP_STATS_CONFIG_DIR_PATH, 'cache.json'),
  MINIMAL_SIMILARITY_THRESHOLD: 0.26,
  MINIMAL_SIMILARITY_UNPARSABLE,
  DATE_FORMAT_GSHEET: 'yyyy/MM/dd',
  DATE_FORMAT_LOGS: 'yyyy-MM-dd | HH-mm-ss',
  NOT_APPLICABLE: 'N/A',
  RANGES: {
    TITAN_RANGE: 'Titans',
    WAR_RANGE: 'Wars',
  },
  FIXED_FIELDS: {
    TITAN: {
      DATE: 'date',
      TOTAL_SCORE: 'totalScore',
      LIFE: 'life',
      STARS: 'stars',
      COLOR: 'color',
      PARTICIPATING_MEMBERS_NUMBER: 'participatingMembersNumber',
    },
    WAR: {
      DATE: 'date',
      TOTAL_SCORE: 'totalScore',
      ENEMY_SCORE: 'enemyScore',
      BONUS: 'bonus',
      PARTICIPATING_MEMBERS_NUMBER: 'participatingMembersNumber',
    },
  },
  SCREEN_TYPES: {
    WAR_INFO_TYPE,
    TITAN_INFO_TYPE,
    WAR_HITS_TYPE,
    TITAN_HITS_TYPE,
  },
  DEFAULT_CONFIGURATION: {
    sheetId: null,
    screenshotsSize: null,
    calendarId: null,
  },
  DEFAULT_CACHE: {
    lastCheck: null,
    [ TITAN_INFO_TYPE ]: {},
    [ WAR_INFO_TYPE ]: {},
    processedItems: [],
  },
};
