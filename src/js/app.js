import slider from './modules/slider';
import preloader from './modules/preloader';
import toltip from './modules/toltip';
import modal from './modules/modal';
import form from './modules/form';

import '../scss/style.scss';

window.addEventListener('DOMContentLoaded', function () {
  toltip();
  preloader();
  slider();
  modal('#modalBtn', '#modalForm');
  form('#bitrixForm', '#modalBtn');
});
