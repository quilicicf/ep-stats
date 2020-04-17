const profile = require('./image-processing/profiles/1536x2048');
const processHitsFile = require('./processHitsFile');

processHitsFile('/tmp/IMG_1808.PNG', 'IMG_1808', profile);
