'use strict';

(function () {
  var MAIN_PIN_TAIL_HEIGHT = 20;
  var map = document.querySelector('.map');
  var pinContainer = map.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var startCoords = {};
  var defaultCoords = {
    x: 570,
    y: 375
  };
  var loadedOffers = [];

  window.card.setCloseCallback(window.pins.setActive);
  writeAddress();

  map.addEventListener('click', onMapClick);
  mapPinMain.addEventListener('mousedown', onPinMainMouseDown);

  function onMapClick(evt) {
    var element = evt.target.closest('.map__pin:not(.map__pin--main)');
    if (element) {
      window.card.close();
      window.pins.setActive(element);
      var id = Number(element.dataset.id);
      var data = loadedOffers.find(function (offer) {
        return offer.id === id;
      });
      window.card.open(data, map);
    }
  }

  function onDocumentMouseUp() {
    writeAddress();
    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
  }

  function onPinMainMouseUp() {
    window.backend.loadData(function (data) {
      activatePage();
      loadedOffers = data.map(function (offer, index) {
        offer.id = index;
        return offer;
      });
      writeAddress();
      window.filter.set(loadedOffers, function (cards) {
        window.pins.remove();
        window.card.close();
        window.pins.add(cards, pinContainer);
      });
      mapPinMain.removeEventListener('mouseup', onPinMainMouseUp);
      document.removeEventListener('mousemove', onDocumentMouseMove);
    }, function (err) {
      window.notice.showError(err);
      document.removeEventListener('mousemove', onDocumentMouseMove);
    });
  }

  function onPinMainMouseDown(evt) {
    if (map.classList.contains('map--faded')) {
      mapPinMain.addEventListener('mouseup', onPinMainMouseUp);
    }
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
  }

  function onDocumentMouseMove(evt) {
    evt.preventDefault();
    //find cursor's displacement during one event
    //the difference between start coords and current coords
    var shift = {
      x: startCoords.x - evt.clientX,
      y: startCoords.y - evt.clientY
    };
    //rewrite start location
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    //add the difference thus moving the pin on cursor's place 
   var newCoords = {
      x: mapPinMain.offsetLeft - shift.x,
      y: mapPinMain.offsetTop - shift.y
    };
    setCoords(newCoords);
  }
 

  function setCoords(coords) {
    mapPinMain.style.left = coords.x + 'px';
    mapPinMain.style.top = coords.y + 'px';
  }

  function activatePage() {
    map.classList.remove('map--faded');
    window.form.enable();
    window.filter.enable();
  }

  function deactivateMap() {
    map.classList.add('map--faded');
    window.pins.remove();
    window.card.close();
    setCoords(defaultCoords);
    writeAddress();
  }

  function writeAddress() {
    var address = getAddress(mapPinMain);
    window.form.setAddress(address);
  }

  function getAddress(elem) {
    var pinLeft = elem.style.left;
    var pinTop = elem.style.top;
    var x = parseInt(pinLeft, 10) + Math.round(elem.clientWidth / 2);
    var y = parseInt(pinTop, 10) + Math.round(elem.clientHeight + MAIN_PIN_TAIL_HEIGHT);
    if (map.classList.contains('map--faded')) {
      y = parseInt(pinTop, 10) + Math.round(elem.clientHeight / 2);
    }
    return {x: x, y: y};
  }

  window.disableMap = deactivateMap;
})();
