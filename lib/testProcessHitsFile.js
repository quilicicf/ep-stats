const profile = require('./image-processing/profiles/1536x2048');
const processHitsFile = require('./processHitsFile');

const main = async () => {
  const members = {
    Argonythe: 0,
    Berserker: 1,
    Chillchams: 2,
    clarimaniac: 3,
    Dodrix: 4,
    ImMaryPoppinsYall: 5,
    isy: 6,
    kg1: 7,
    King: 8,
    Lightcreed: 9,
    liloulilou499: 10,
    Lorenmantel: 11,
    lys31: 12,
    miaougraou: 13,
    Nappier: 14,
    NoxiousChicken65730: 15,
    Painy: 16,
    'quiet....': 17,
    Racheliaude: 18,
    razer: 19,
    Taco7788999: 20,
    '&&djedje&&': 21,
  };
  await processHitsFile('/tmp/IMG_1688.PNG', 'IMG_1688.PNG', profile, members, [], new Date());
};

main();
