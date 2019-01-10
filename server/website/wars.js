const DAY_LABEL_FORMAT = 'ddd Do MMMM YYYY';
const DAY_ID_FORMAT = 'YYYY-MM-DD';
const WEDNESDAY_OFFSET = 2;
const SATURDAY_OFFSET = 5;

const { _, dateFns: df } = window;

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
  .filter(warDate => df.isAfter(now, warDate))
  .last();

window.onload = () => {
  const now = new Date();
  const startOfCurrentWeek = df.startOfWeek(now, { weekStartsOn: 1 /* Monday */ });
  const warDaysOffsets = getWarDaysOffsets(3);
  const warDates = _.map(warDaysOffsets, warDayOffset => df.addDays(startOfCurrentWeek, warDayOffset));
  const warDays = _.map(
    warDates,
    warDate => ({
      date: warDate,
      label: df.format(warDate, DAY_LABEL_FORMAT),
      value: df.format(warDate, DAY_ID_FORMAT),
    }),
  );

  const selectedDay = getDayToSelect(now, warDates);

  const warDatesSelect = document.getElementById('warDate');
  warDays
    .forEach((warDay) => {
      const domElement = document.createElement('option');
      domElement.innerText = warDay.label;
      domElement.value = warDay.value;
      if (df.isEqual(warDay.date, selectedDay)) {
        domElement.setAttribute('selected', 'selected');
      }
      warDatesSelect.appendChild(domElement);
    });
};


window.postImage = () => {
  const warDateField = document.getElementById('warDate');
  const enemyScoreField = document.getElementById('warEnemyScore');
  const bonusField = document.querySelector('input[name="warBonusRadios"]:checked');

  const fileField = document.getElementById('file');
  const file = fileField.files[ 0 ];

  const statusOkField = document.getElementById('status-ok');
  const statusKoField = document.getElementById('status-ko');

  statusKoField.innerText = '';

  const formData = new FormData();
  formData.append('date', warDateField.options[ warDateField.selectedIndex ].value);
  formData.append('enemyScore', enemyScoreField.value);
  formData.append('bonus', bonusField.value);
  formData.append('file', file);
  formData.append('type', 'war'); // TODO: un-mock

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://127.0.0.1:12012');

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
