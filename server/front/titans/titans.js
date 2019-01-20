import _ from 'lodash';
import flatpickr from 'flatpickr';
import displayLoadingInButton from '../displayLoadingInButton';

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

  const sendPromise = new Promise((resolve, reject) => {
    const uploadErrorField = document.getElementById('titan-upload-error');
    uploadErrorField.style.display = 'none';

    const xhr = new XMLHttpRequest();
    const { host } = document.location;
    xhr.open('POST', `http://${host.replace(/:[0-9]+/, ':12012')}/titans`, true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        return resolve(JSON.parse(xhr.responseText).message);
      }

      uploadErrorField.innerText = xhr.responseText;
      uploadErrorField.style.display = 'block';
      return reject();
    };

    xhr.onerror = () => {
      uploadErrorField.innerText = 'Unknown error';
      uploadErrorField.style.display = 'block';
      reject();
    };

    xhr.send(formData);
  });

  const button = document.getElementById('titans-btn');
  displayLoadingInButton(button, sendPromise);
};
