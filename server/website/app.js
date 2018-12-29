window.postImage = () => {
  const fileField = document.getElementById('file');
  const file = fileField.files[ 0 ];

  const bonusField = document.querySelector('input[name="warBonusRadios"]:checked');
  const statusOkField = document.getElementById('status-ok');
  const statusKoField = document.getElementById('status-ko');

  statusKoField.innerText = '';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('bonus', bonusField.value);
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
