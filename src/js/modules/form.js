import $ from 'jquery';

const form = (formId, button) => {
  // Маска для номера телефона
  [].forEach.call(document.querySelectorAll('.tel'), function (input) {
    var keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = '+7 (___) ___ ____',
        i = 0,
        def = matrix.replace(/\D/g, ''),
        val = this.value.replace(/\D/g, ''),
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });
      i = new_value.indexOf('_');
      if (i != -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i);
      }
      var reg = matrix
        .substr(0, this.value.length)
        .replace(/_+/g, function (a) {
          return '\\d{1,' + a.length + '}';
        })
        .replace(/[+()]/g, '\\$&');
      reg = new RegExp('^' + reg + '$');
      if (!reg.test(this.value) || this.value.length < 5 || (keyCode > 47 && keyCode < 58))
        this.value = new_value;
      if (event.type == 'blur' && this.value.length < 5) this.value = '';
    }

    input.addEventListener('input', mask, false);
    input.addEventListener('focus', mask, false);
    input.addEventListener('blur', mask, false);
    input.addEventListener('keydown', mask, false);
  });

  // Установка атрибута 'data-buttonid' (Идентиификатор кнопки для Битрикса)
  document.querySelectorAll(button).forEach((element) => {
    element.addEventListener('click', function () {
      document
        .querySelector('#yourClientTarrifToBitrix')
        .setAttribute('data-buttonid', this.getAttribute('data-buttonid'));
    });
  });

  // Отправка формы
  document.querySelector(formId).addEventListener('submit', function (event) {
    event.preventDefault();
    document.querySelector('.thnx').style.display = 'block';

    let clientName = document.querySelector('#formGroupExampleInput').value;
    let clientPhone = document.querySelector('#formGroupExampleInput2').value;
    let clientComment = document.querySelector('#formGroupExampleInput3').value;
    let clientTarrif = document
      .querySelector('#yourClientTarrifToBitrix')
      .getAttribute('data-buttonid');

    createBitrixLeadRequest(clientName, clientPhone, clientComment, clientTarrif);

    this.reset();
  });

  // Отправка Лида в Битрикс
  const createBitrixLeadRequest = (clientName, clientPhone, clientComment, clientTarrif) => {
    $.post('//' + location.host + '/backend/bitrixLead.php', {
      NAME: clientName,
      PHONE_MOBILE: clientPhone,
      COMMENTS: clientComment,
      UF_CRM_1563785863: clientTarrif,
      UTM_CEK_ADV: cekUTMModule.getBitrixUTMs(),
    });
  };
};

export default form;
