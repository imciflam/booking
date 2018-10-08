'use strict';

(function () {

  function loadData(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', onDataLoad);
    xhr.addEventListener('error', onDataLoadError);
    xhr.addEventListener('timeout', onDataLoadTimeOut);

    xhr.timeout = 5000;
    xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
    xhr.send();

    function onDataLoad() {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        var errMessage = 'Ошибка загрузки данных с сервера: ' + xhr.status;
        onError(errMessage);
      }
    }

    function onDataLoadError() {
      var errMessage = 'Ошибка загрузки данных с сервера: ' + xhr.status + '. Проверьте интернет-соединение';
      onError(errMessage);
    }

    function onDataLoadTimeOut() {
      var errMessage = 'Данные не успели загрузиться с сервера: ' + xhr.status;
      onError(errMessage);
    }
  }

  function upLoadForm(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', onFormLoad);
    xhr.addEventListener('error', onFormUpLoadError);
    xhr.addEventListener('timeout', onFormUpLoadTimeOut);

    xhr.timeout = 5000;
    xhr.open('POST', 'https://js.dump.academy/keksobooking');
    xhr.send(data);

    function onFormLoad() {
      if (xhr.status === 200) {
        onLoad();
      } else {
        var errMessage = 'Ошибка загрузки объявления: ' + xhr.status;
        onError(errMessage);
      }
    }

    function onFormUpLoadError() {
      var errMessage = 'Ошибка загрузки объявления: ' + xhr.status + '. Проверьте интернет-соединение';
      onError(errMessage);
    }

    function onFormUpLoadTimeOut() {
      var errMessage = 'Данные не успели загрузиться на сервер: ' + xhr.status;
      onError(errMessage);
    }
  }

  window.backend = {
    upLoadForm: upLoadForm,
    loadData: loadData
  };
})();

