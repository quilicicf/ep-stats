import _ from 'lodash';

import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import isAfter from 'date-fns/isAfter';
import isEqual from 'date-fns/isEqual';
import startOfWeek from 'date-fns/startOfWeek';

import CONSTANTS from '../constants';

const WEDNESDAY_OFFSET = 2;
const SATURDAY_OFFSET = 5;

const getWarDaysOffsets = (weeksNumber, seed = []) => {
  if (weeksNumber === 1) { return [ ...seed, WEDNESDAY_OFFSET, SATURDAY_OFFSET ]; }

  const newWeeksNumber = weeksNumber - 1;
  const newSeed = [
    ...seed,
    WEDNESDAY_OFFSET - (7 * newWeeksNumber),
    SATURDAY_OFFSET - (7 * newWeeksNumber),
  ];

  return getWarDaysOffsets(newWeeksNumber, newSeed);
};

const getDayToSelect = (now, warDates) => _(warDates)
  .filter(warDate => isAfter(now, warDate))
  .last();

window.loadWarsPage = () => {
  const now = new Date();
  const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 /* Monday */ });
  const warDaysOffsets = getWarDaysOffsets(3);
  const warDates = _.map(warDaysOffsets, warDayOffset => addDays(startOfCurrentWeek, warDayOffset));
  const warDays = _.map(
    warDates,
    warDate => ({
      date: warDate,
      label: format(warDate, CONSTANTS.DAY_LABEL_FORMAT),
      value: format(warDate, CONSTANTS.DAY_ID_FORMAT),
    }),
  );

  const selectedDay = getDayToSelect(now, warDates);

  const warDatesSelect = document.getElementById('warDate');
  warDays
    .forEach((warDay) => {
      const domElement = document.createElement('option');
      domElement.innerText = warDay.label;
      domElement.value = warDay.value;
      if (isEqual(warDay.date, selectedDay)) {
        domElement.setAttribute('selected', 'selected');
      }
      warDatesSelect.appendChild(domElement);
    });
};


window.postWarImage = () => {
  const warDateField = document.getElementById('warDate');
  const enemyScoreField = document.getElementById('warEnemyScore');
  const bonusField = document.querySelector('input[name="warBonusRadios"]:checked');

  const fileField = document.getElementById('warFile');
  const file = fileField.files[ 0 ];

  const statusOkField = document.getElementById('wars-status-ok');
  const statusKoField = document.getElementById('wars-status-ko');

  statusKoField.innerText = '';

  const formData = new FormData();
  formData.append('date', warDateField.options[ warDateField.selectedIndex ].value);
  formData.append('enemyScore', enemyScoreField.value);
  formData.append('bonus', bonusField.value);
  formData.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://127.0.0.1:12012/wars'); // TODO: extract

  xhr.onload = () => {
    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.status === 200) {
      statusOkField.innerText = JSON.parse(xhr.responseText).message;
      fileField.value = '';
      setTimeout(() => {
        statusOkField.innerText = '';
      }, 1000);
      return;
    }

    statusKoField.innerText = xhr.statusText;
  };

  xhr.send(formData);
};
