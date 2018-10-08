'use strict';
var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var TIMES = [
  '12:00',
  '13:00',
  '14:00'
];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
//  var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 87;
var MAX_Y_COORD = 630;
var MIN_Y_COORD = 130;
var adForm = document.querySelector('.ad-form');
var address = adForm.querySelector('#address');
var adFormFieldSets = adForm.querySelectorAll('fieldset');
var price = adForm.querySelector('#price');
var selectType = adForm.querySelector('#type');
var selectTimeIn = adForm.querySelector('#timein');
var selectTimeOut = adForm.querySelector('#timeout');
var selectRoom = adForm.querySelector('#room_number');
var selectCapacity = adForm.querySelector('#capacity');
var submit = document.querySelector('.ad-form__submit');
var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
var templateCard = document.querySelector('#card').content.querySelector('.map__card');
var map = document.querySelector('.map');
var pinContainer = map.querySelector('.map__pins');
var mapFilters = map.querySelector('.map__filters-container');
var mapPinMain = map.querySelector('.map__pin--main'); 
 
var currentAd;
var pins = [];

var fields = adForm.querySelectorAll('fieldset > input, select');
var resetButton = adForm.querySelector('.ad-form__reset');
var PriceOfType = 
{
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
 };



(function () 
{
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
    //checkCapacity();
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




var getRandomInt = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

var getRandomItem = function (items) {
  return items[getRandomInt(0, items.length - 1)];
};

var randomCompare = function () {
  return Math.random() - 0.5;
};

 
 
var getItem = function (number) {
  var x = getRandomInt(0, pinContainer.offsetWidth);
  var y = getRandomInt(MIN_Y_COORD, MAX_Y_COORD);
  //mock item
  var item = {
    author: {
      avatar: 'img/avatars/user0' + (number + 1) + '.png'
    },
    offer: {
      title: TITLES[number],
      address: x + ', ' + y,
      price: getRandomInt(1000, 100000),
      type: getRandomItem(TYPES),
      rooms: getRandomInt(1, 5),
      guests: getRandomInt(1, 10),
      checkin: getRandomItem(TIMES),
      checkout: getRandomItem(TIMES),
      features: FEATURES.slice(getRandomInt(0, FEATURES.length - 1)),
      description: '',
      photos: PHOTOS.slice().sort(randomCompare)
    },
    location: {
      x: x,
      y: y
    }
  };
  return item;
};

var getItemsList = function (quantity) {
  var itemsList = [];
  for (var i = 0; i < quantity; i++) {
    itemsList[i] = getItem(i);
  }
  return itemsList;
};

var getMapPin = function (item) {
  var mapPin = templatePin.cloneNode(true);

  mapPin.addEventListener('click', function () {
    appendAd(item);
  });
  mapPin.style = 'left: ' + (item.location.x - PIN_WIDTH / 2) + 'px; top: ' + (item.location.y - PIN_HEIGHT) + 'px;';
  mapPin.querySelector('img').src = item.author.avatar;
  mapPin.querySelector('img').alt = item.offer.title;

  return mapPin;
};

var appendPins = function (items) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < items.length; i++) {
    fragment.appendChild(getMapPin(items[i]));
  }
  pinContainer.appendChild(fragment);
};

var getFeatures = function (features) {
  var fragment = document.createDocumentFragment();
  features.forEach(function (item) {
    var li = document.createElement('li');
    li.classList.add('popup__feature', 'popup__feature--' + item);
    fragment.appendChild(li);
  });
  return fragment;
};

var getFragmentPhotos = function (pictures) {
    var fragmentPhotos = document.createDocumentFragment();
    var popupPhoto = document.querySelector('#card').content.querySelector('.popup__photo');
    for (var i = 0; i < pictures.length; i++) {
      var newElement = popupPhoto.cloneNode(true);
      newElement.src = pictures[i];
      fragmentPhotos.appendChild(newElement);
    }
    return fragmentPhotos;

};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeAd();
  }
};

var closeAd = function () {
  map.removeChild(document.querySelector('article.map__card'));
  document.removeEventListener('keydown', onPopupEscPress);
  currentAd = null;
};

function getOfferType(item) {
    var offerType;
    switch (item.offer.type) {
      case 'flat': offerType = 'Квартира';
        break;
      case 'palace': offerType = 'Дворец';
        break;
      case 'bungalo': offerType = 'Бунгало';
        break;
      case 'house': offerType = 'Дом';
        break;
      default: offerType = 'Ночлежка';
        break;
    }
    return offerType;
 }


var getMapCard = function (item) {
  var adItem = templateCard.cloneNode(true);
  var pictures = adItem.querySelector('.popup__photos');
  var photosFragment = getFragmentPhotos(item.offer.photos);


  var closeBtn = adItem.querySelector('.popup__close');
  closeBtn.addEventListener('click', closeAd);
  document.addEventListener('keydown', onPopupEscPress);

  adItem.querySelector('.popup__title').textContent = item.offer.title;
  adItem.querySelector('.popup__text--address').textContent = item.offer.address;
  adItem.querySelector('.popup__text--price').innerHTML = item.offer.price + '&#x20bd;<span>/ночь</span></p>';
  adItem.querySelector('.popup__type').textContent = getOfferType(item);
  adItem.querySelector('.popup__text--capacity').textContent = item.offer.rooms + ' комнаты для ' + item.offer.guests + ' гостей';
  adItem.querySelector('.popup__text--time').textContent = 'Заезд после ' + item.offer.checkin + ', ' + 'выезд до ' + item.offer.checkout;
  adItem.querySelector('.popup__description').textContent = item.offer.description;
  adItem.querySelector('.popup__avatar').src = item.author.avatar;

  
 // var newPictures = pictures.cloneNode();
 // newPictures.appendChild(getPictures(item.offer.photos));
 // adItem.replaceChild(newPictures, pictures);

  var features = adItem.querySelector('.popup__features');
  var newFeatures = features.cloneNode();
  newFeatures.appendChild(getFeatures(item.offer.features));
  adItem.replaceChild(newFeatures, features);

  return adItem;
};

var appendAd = function (item) 
{
  if (currentAd) {
    currentAd.parentElement.removeChild(currentAd);
  }

  currentAd = map.insertBefore(getMapCard(item), mapFilters);
};

var setDisabledFieldsets = function (data, bool) 
{
  for (var i = 0; i < data.length; i++) {
    data[i].disabled = bool;
  }
};

var activatePage = function () 
{
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  setDisabledFieldsets(adFormFieldSets, false);
  selectCapacity.value = '1';
};

var getMainPinCoordinate = function () 
{
  var x = mapPinMain.offsetLeft + MAIN_PIN_WIDTH / 2;
  var y = mapPinMain.offsetTop + MAIN_PIN_HEIGHT;
  return x + ',' + y;
};

var setDisabledOptions = function (node) 
{
  for (var i = 0; i < node.length; i++) 
  {
    node[i].removeAttribute('disabled');
  }
};

var updateCapacity = function () 
{
  var roomNumber = selectRoom.value;
  var capacity = selectCapacity.value;
  var currentCapacityOption = selectCapacity.querySelector('option[value="' + capacity + '"]');
  var errorMessage;
  var items = selectCapacity.querySelectorAll('option');
  for (var i = 0; i < items.length; i++) {
    if (roomNumber === '100') {
      items[i].disabled = (items[i].value !== '0');
    } else {
      items[i].disabled = (items[i].value === '0' || items[i].value > roomNumber);
    }
  }
  errorMessage = currentCapacityOption.disabled ? 'Некорректный выбор' : '';
  selectCapacity.setCustomValidity(errorMessage);
};

var typeSelectHandler = function () 
{
  switch (selectType.value) {
    case 'bungalo': price.setAttribute('min', '0'); break;
    case 'flat': price.setAttribute('min', '1000'); break;
    case 'house': price.setAttribute('min', '5000'); break;
    case 'palace': price.setAttribute('min', '10000'); break;
  }
};

var timeInChangeHandler = function ()
{
  selectTimeOut.value = selectTimeIn.value;
};

var timeOutChangeHandler = function ()
{
  selectTimeIn.value = selectTimeOut.value;
};

var deactivatePage = function ()
{
  setDisabledFieldsets(adFormFieldSets, true);
  address.value = getMainPinCoordinate();
};

var isPageNotActive = function()
{
  return map.classList.contains('map--faded');
};

selectRoom.addEventListener('focus', function () 
{
  setDisabledOptions(selectCapacity.querySelectorAll('option'));
});

selectRoom.addEventListener('change', updateCapacity);

selectType.addEventListener('change', typeSelectHandler);

selectTimeIn.addEventListener('change', timeInChangeHandler);

selectTimeOut.addEventListener('change', timeOutChangeHandler);

mapPinMain.addEventListener('mousedown', function (evt)
{
  evt.preventDefault();
  //  default coordinates
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

    var onMouseMove = function (moveEvt)
    {
    moveEvt.preventDefault();
    //  find cursor's displacement during one event
    //  the difference between start coords and current coords
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };
    //  rewrite start location
    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };
    //  add the difference thus moving the pin on cursor's place
    mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + "px";
    mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + "px";
    };

    var onMouseUp = function (upEvt)
    {
      upEvt.preventDefault();
      if (isPageNotActive()) {
      pins = getItemsList(8);
      appendPins(pins);
      activatePage();
      updateCapacity();
    }
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});



//deactivatePage();