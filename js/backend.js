'use strict';

(function () {

    function onLoadError() {
      var errMessage = 'Error: ' + xhr.status;
      onError(errMessage);
    }

    function onLoadTimeOut() {
      var errMessage = 'Timeout: ' + xhr.status;
      onError(errMessage);
    }

  function loadData(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', onDataLoad);
    xhr.addEventListener('error', onLoadError);
    xhr.addEventListener('timeout', onLoadTimeOut);

    xhr.timeout = 3000;
    xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
    xhr.send();

    function onDataLoad() {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else { 
        onError(errMessage);
      }
    }
  }

  function upLoadForm(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', onFormLoad);
    xhr.addEventListener('error', onLoadError);
    xhr.addEventListener('timeout', onLoadTimeOut);

    xhr.timeout = 3000;
    xhr.open('POST', 'https://js.dump.academy/keksobooking');
    xhr.send(data);

    function onFormLoad() {
      if (xhr.status === 200) {
        onLoad();
      } else { 
        onError(errMessage);
      }
    }
  }

  window.backend = {
    upLoadForm: upLoadForm,
    loadData: loadData
  };
})();

