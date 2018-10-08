'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormFieldSets = adForm.querySelectorAll('fieldset');
  var address = adForm.querySelector('#address');
  var price = adForm.querySelector('#price');
  var selectType = adForm.querySelector('#type');
  var selectTimeIn = adForm.querySelector('#timein');
  var selectTimeOut = adForm.querySelector('#timeout');
  var selectRoom = adForm.querySelector('#room_number');
  var selectCapacity = adForm.querySelector('#capacity');
  var submit = adForm.querySelector('.ad-form__submit');
  var fields = adForm.querySelectorAll('fieldset > input, select');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var PriceOfType = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  setMinPrice(selectType.value);
  changeAvailabilityFields();

  adForm.addEventListener('input', onElementInput);
  submit.addEventListener('click', onSubmitClick);
  adForm.addEventListener('submit', onFormSubmit);
  selectTimeIn.addEventListener('change', onSelectTimeChange);
  selectTimeOut.addEventListener('change', onSelectTimeChange);
  selectType.addEventListener('change', onSelectTypeChange);
  resetButton.addEventListener('click', onResetClick);
  selectRoom.addEventListener('change', onSelectRoomChange);

  function onFormSubmit(evt) {
    window.backend.upLoadForm(new FormData(adForm), function () {
      window.notice.showSuccess();
      window.disableMap();
      disableForm();
      setMinPrice(selectType.value);
    }, function (err) {
      window.notice.showError(err);
    });
    evt.preventDefault();
  }

  function onSelectRoomChange() {
    unMarkValidFields(selectCapacity);
  }

  function onElementInput(evt) {
    var field = evt.target;
    unMarkValidFields(field);
  }

  function onSelectTypeChange() {
    setMinPrice(selectType.value);
  }

  function onSelectTimeChange(evt) {
    var newSelect = evt.target;
    setTimeInOut(newSelect);
  }

  function onSubmitClick() {
    checkCapacity();
    markInvalidFields();
  }

  function onResetClick() {
    fields.forEach(function (field) {
      unMarkValidFields(field);
    });
    window.disableMap();
    disableForm();
    setMinPrice(selectType.value);
  }

  function checkCapacity() {
    var capacity = Number(selectCapacity.value);
    var roomNumber = Number(selectRoom.value);
    var message = null;
    if (roomNumber !== 100 && (capacity > roomNumber || capacity < 1)) {
      message = 'Количество гостей НЕ должно быть больше ' + roomNumber + ' и меньше 1';
    } else if (roomNumber === 100 && capacity !== 0) {
      message = 'Поставьте пункт \<не для гостей\> в поле <Количество мест>';
    } else {
      message = '';
    }
    selectCapacity.setCustomValidity(message);
  }

  function setTimeInOut(newSelect) {
    selectTimeIn.value = newSelect.value;
    selectTimeOut.value = newSelect.value;
  }

  function setMinPrice(typeValue) {
    price.min = PriceOfType[typeValue];
    price.placeholder = PriceOfType[typeValue];
  }

  function unMarkValidFields(field) {
    var hasFieldRemovedClass = field.classList.contains('field-invalid');
    if (hasFieldRemovedClass) {
      field.classList.remove('field-invalid');
    }
  }

  function markInvalidFields() {
    fields.forEach(function (field) {
      if (!field.validity.valid) {
        field.classList.add('field-invalid');
      }
    });
  }

  function setAddress(coords) {
    address.value = coords.x + ', ' + coords.y;
  }

  function isFormDisabled() {
    return adForm.classList.contains('ad-form--disabled');
  }

  function changeAvailabilityFields() {
    var disable = isFormDisabled();
    adFormFieldSets.forEach(function (field) {
      field.disabled = disable;
    });
  }

  function disableForm() {
    adForm.reset();
    adForm.classList.add('ad-form--disabled');
    window.filter.disable();
    changeAvailabilityFields();
  }

  window.form = {
    setAddress: setAddress,
    enable: function () {
      adForm.classList.remove('ad-form--disabled');
      changeAvailabilityFields();
    }
  };
})();
