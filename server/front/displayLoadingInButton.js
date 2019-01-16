/* eslint-disable no-param-reassign */

import wait from './wait';

const spinnerHtml = '<i class="fa fa-spin fa-spinner"></i>';

export default async (button, promise) => {
  const initialText = button.innerText;

  button.innerHTML = spinnerHtml;
  button.classList.add('btn-primary');
  button.classList.remove('btn-danger');
  button.setAttribute('disabled', true);

  try {
    await promise;
    button.innerText = initialText;
    button.classList.add('btn-success');
    button.classList.remove('btn-primary');

    await wait(1000);
    button.classList.add('btn-primary');
    button.classList.remove('btn-success');

  } catch (error) {
    button.classList.add('btn-danger');
    button.classList.remove('btn-primary');

    await wait(1000);
    button.classList.add('btn-primary');
    button.classList.remove('btn-danger');

  } finally {
    button.innerText = initialText;
    button.removeAttribute('disabled');
  }
};
