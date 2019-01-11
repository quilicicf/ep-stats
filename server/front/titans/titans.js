import _ from 'lodash';
import flatpickr from 'flatpickr';

const FIELDS = {
  FORM: null,
  DATE: null,
  LIFE: null,
};

window.loadTitansPage = () => {
  _.set(FIELDS, [ 'FORM' ], document.getElementById('titansForm'));
  _.set(FIELDS, [ 'DATE' ], document.getElementById('titanDate'));
  _.set(FIELDS, [ 'LIFE' ], document.getElementById('titanLife'));

  flatpickr(FIELDS.DATE, {
    defaultDate: new Date(),
    allowInput: true,
    inline: true,
    locale: { firstDayOfWeek: 1 /* start week on Monday */ },
  });
};

window.postTitansImage = () => {
  const statusOkField = document.getElementById('titans-status-ok');
  const statusKoField = document.getElementById('titans-status-ko');

  statusKoField.innerText = '';

  const colorField = document.querySelector('input[name="titanColorRadios"]:checked');
  const titanCheckedField = document.querySelector('.rate > input[type=radio]:checked');
  const fileField = document.getElementById('titanFile');
  const file = fileField.files[ 0 ];

  const formData = new FormData();
  formData.append('date', FIELDS.DATE.value);
  formData.append('life', FIELDS.LIFE.value);
  formData.append('stars', titanCheckedField.value);
  formData.append('color', colorField.value);
  formData.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://127.0.0.1:12012/titans'); // TODO: extract

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
