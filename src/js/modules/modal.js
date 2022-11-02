import { Modal } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const modal = (button, form) => {
  document.querySelectorAll(button).forEach((item) => {
    item.addEventListener('click', function () {
      new Modal(document.querySelector(form)).show();
    });
  });
};

export default modal;
