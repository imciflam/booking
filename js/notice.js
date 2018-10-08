'use strict';

(function () {
  var main = document.querySelector('main');
  var successBlock = getSuccessBlock();
  var errorBlock = getErrorBlock();

  function getErrorBlock() {
    var templateError = document.querySelector('#error').content.querySelector('.error');
    return templateError.cloneNode(true);
  }

  function getSuccessBlock() {
    var templateSuccess = document.querySelector('#success').content.querySelector('.success');
    return templateSuccess.cloneNode(true);
  }

  function showErrorMessage(err) {
    errorBlock.querySelector('.error__message').textContent = err;
    main.appendChild(errorBlock);
    document.addEventListener('keydown', onErrorMessageEscPress);
    document.addEventListener('click', onErrorMessageClick);
  }

  function showSuccessMassage() {
    main.appendChild(successBlock);
    document.addEventListener('keydown', onSuccessMessageEscPress);
    document.addEventListener('click', onSuccessMessageClick);
    document.activeElement.blur();
  }

  function onErrorMessageClick() {
    hideErrorMassage();
  }

  function onSuccessMessageClick() {
    hideSuccessMassage();
  }

  function onErrorMessageEscPress(evt) {
    if (evt.which === window.constants.ESC_KEYCODE) {
      hideErrorMassage();
    }
  }

  function onSuccessMessageEscPress(evt) {
    if (evt.which === window.constants.ESC_KEYCODE) {
      hideSuccessMassage();
    }
  }

  function hideSuccessMassage() {
    successBlock.remove();
    document.removeEventListener('keydown', onSuccessMessageEscPress);
    document.removeEventListener('click', onSuccessMessageClick);
  }

  function hideErrorMassage() {
    errorBlock.remove();
    document.removeEventListener('keydown', onErrorMessageEscPress);
    document.removeEventListener('click', onErrorMessageClick);
  }

  window.notice = {
    showError: showErrorMessage,
    showSuccess: showSuccessMassage
  };
})();

