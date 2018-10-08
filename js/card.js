'use strict';

(function () {
  var templateCard = document.querySelector('#card').content.querySelector('.map__card');
  var closeCallback = null;

  function getFragmentFeatures(array) {
    var fragmentFeatures = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      var newElement = document.createElement('li');
      var className = 'popup__feature--' + array[i];
      newElement.classList.add('popup__feature');
      newElement.classList.add(className);
      fragmentFeatures.appendChild(newElement);
    }
    return fragmentFeatures;
  }

  function getFragmentPhotos(array) {
    var fragmentPhotos = document.createDocumentFragment();
    var popupPhoto = document.querySelector('#card').content.querySelector('.popup__photo');
    for (var i = 0; i < array.length; i++) {
      var newElement = popupPhoto.cloneNode(true);
      newElement.src = array[i];
      fragmentPhotos.appendChild(newElement);
    }
    return fragmentPhotos;
  }

  function getOfferType(obj) {
    var offerType;
    switch (obj.offer.type) {
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

  function getTextCapacity(obj) {
    var rooms = obj.offer.rooms;
    var guests = obj.offer.guests;
    var textCapacity;
    if (rooms === 1 && guests === 1) {
      textCapacity = rooms + ' комната для ' + guests + ' гостя';
    } else if (rooms >= 2 && guests === 1) {
      textCapacity = rooms + ' комнаты для ' + guests + ' гостя';
    } else if (rooms === 1 && guests >= 2) {
      textCapacity = rooms + ' комнатa для ' + guests + ' гостей';
    } else if (rooms === 5 && guests === 1) {
      textCapacity = rooms + ' комнат для ' + guests + ' гостя';
    } else if (rooms === 5 && guests >= 2) {
      textCapacity = rooms + ' комнат для ' + guests + ' гостей';
    } else {
      textCapacity = rooms + ' комнаты для ' + guests + ' гостей';
    }
    return textCapacity;
  }

  function createNoticeElement(obj) {
    var cardElement = templateCard.cloneNode(true);
    var cardFeatures = cardElement.querySelector('.popup__features');
    var featuresFragment = getFragmentFeatures(obj.offer.features);
    var cardPhotos = cardElement.querySelector('.popup__photos');
    var photosFragment = getFragmentPhotos(obj.offer.photos);
    cardElement.querySelector('.popup__title').textContent = obj.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = obj.offer.address;
    cardElement.querySelector('.popup__text--price').innerHTML = obj.offer.price + '&#x20bd<span>/ночь</span>';
    cardElement.querySelector('.popup__type').textContent = getOfferType(obj);
    cardElement.querySelector('.popup__text--capacity').textContent = getTextCapacity(obj);
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ' выезд после ' + obj.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = obj.offer.description;
    cardElement.querySelector('.popup__avatar').src = obj.author.avatar;
    cardFeatures.innerHTML = '';
    cardFeatures.appendChild(featuresFragment);
    cardPhotos.innerHTML = '';
    cardPhotos.appendChild(photosFragment);
    return cardElement;
  }

  function openCard(obj, container) {
    var newNotice = createNoticeElement(obj);
    container.appendChild(newNotice);
    var popupClose = container.querySelector('.popup__close');
    popupClose.addEventListener('click', onCloseOfferClick);
    document.addEventListener('keydown', onOfferEscPress);
  }

  function onOfferEscPress(evt) {
    if (evt.which === window.constants.ESC_KEYCODE) {
      closeCard();
      document.removeEventListener('keydown', onOfferEscPress);
    }
  }

  function onCloseOfferClick() {
    closeCard();
  }

  function setCloseCallback(callback) {
    closeCallback = callback;
  }

  function closeCard() {
    var card = document.querySelector('.map__card');
    if (card) {
      card.remove();
      document.removeEventListener('keydown', onOfferEscPress);
    }
    if (closeCallback) {
      closeCallback();
    }
  }

  window.card = {
    open: openCard,
    close: closeCard,
    setCloseCallback: setCloseCallback
  };
})();
