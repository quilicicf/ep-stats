import _ from 'lodash';
import 'flatpickr/dist/flatpickr.css';

import './style/main.scss';

import './titans/titans';
import './wars/wars';

const loadPage = () => {
  const pages = document.getElementsByClassName('page');
  const hash = (document.location.hash || 'titans').replace(/^#/, '');

  _.each(pages, (page) => {
    const style = page.id === `${hash}-page` ? 'visible' : 'none';
    _.set(page, [ 'style', 'display' ], style);
  });
};

window.onload = () => {
  window.loadTitansPage();
  window.loadWarsPage();
  loadPage();
};

window.onhashchange = loadPage;
