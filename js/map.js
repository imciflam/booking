'use strict';

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var ads = [];
var ADS_LENGTH = 8;
var AdParameters = {
  author: {
    authors: [],
    generateArray: function () {
      for (var i = 0; i < ADS_LENGTH; i++) {
        AdParameters.author.authors[i] = i + 1;
      }
    }
  },
  titles: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  price: {
    min: 1000,
    max: 1000000
  },
  types: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  rooms: {
    min: 1,
    max: 5
  },
  guests: {
    min: 1,
    max: 3
  },
  checkin: [
    '12:00',
    '13:00',
    '14:00'
  ],
  checkout: [
    '12:00',
    '13:00',
    '14:00'
  ],
  features: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  photos: [
    //'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
   // 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
   // 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],
  locations: {
    x: {
      min: 0,
      max: map.offsetWidth
    },
    y: {
      min: 130,
      max: 630
    }
  }
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

var shuffleArray = function (arr) {
  return arr.sort(compareRandom);
};

shuffleArray(AdParameters.titles);

AdParameters.author.generateArray();
shuffleArray(AdParameters.author.authors);

var generateAds = function () {
  for (var i = 0; i < ADS_LENGTH; i++) {
    ads[i] = {
      author: {
        avatar: 'img/avatars/user0' + AdParameters.author.authors[i] + '.png'
      },
      offer: {
        title: AdParameters.titles[i],
        price: getRandomNumber(AdParameters.price.min, AdParameters.price.max + 1),
        type: AdParameters.types[getRandomNumber(0, AdParameters.types.length)],
        rooms: getRandomNumber(AdParameters.rooms.min, AdParameters.rooms.max + 1),
        guests: getRandomNumber(AdParameters.guests.min, AdParameters.guests.max + 1),
        checkin: AdParameters.checkin[getRandomNumber(0, AdParameters.checkin.length)],
        checkout: AdParameters.checkout[getRandomNumber(0, AdParameters.checkout.length)],
        features: AdParameters.features.slice(0, getRandomNumber(0, AdParameters.features.length)),
        description: '',
        photos: shuffleArray(AdParameters.photos)
      },
      location: {
        x: getRandomNumber(AdParameters.locations.x.min, AdParameters.locations.x.max),
        y: getRandomNumber(AdParameters.locations.y.min, AdParameters.locations.y.max)
      }
    };
    ads[i].offer.address = ads[i].location.x + ', ' + ads[i].location.y;
  }
};

generateAds();

var markTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var renderMark = function (ad) {
  var markElement = markTemplate.cloneNode(true);
  var PIN_ARROW_HEIGHT = 22;
  var pinOffsetX = markElement.offsetWidth / 2;
  var pinOffsetY = markElement.offsetWidth + PIN_ARROW_HEIGHT;
  markElement.querySelector('img').src = ad.author.avatar;
  markElement.querySelector('img').alt = ad.offer.title;
  markElement.style.left = ad.location.x - pinOffsetX + 'px';
  markElement.style.top = ad.location.y - pinOffsetY + 'px';

  // markElement.addEventListener('click', onMarkClick); // Обработчик события

  return markElement;
};

var fragment = document.createDocumentFragment();

for (var adIndex = 0; adIndex < ads.length; adIndex++) {
  fragment.appendChild(renderMark(ads[adIndex]));
}

document.querySelector('.map__pins').appendChild(fragment);

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var types = {
  flat: {
    ru: 'Квартира'
  },
  bungalo: {
    ru: 'Бунгало'
  },
  house: {
    ru: 'Дом'
  },
  palace: {
    ru: 'Дворец'
  }
};

var renderCard = function (ad) {
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = ad.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = TYPES[ad.offer.type].ru;
  cardElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  var featuresList = cardElement.querySelector('.popup__features');
  var renderFeatures = function (features) {
    var featuresFragment = document.createDocumentFragment();
    if (features.length) {
      for (var featuresIndex = 0; featuresIndex < features.length; featuresIndex++) {
        var featuresElement = featuresList.querySelector('li').cloneNode(true);
        featuresElement.classList.add('popup__feature', 'popup__feature--' + features[featuresIndex]);
        featuresFragment.appendChild(featuresElement);
      }
    } else {
      featuresList.classList.add('hidden');
    }
    featuresList.innerHTML = '';
    featuresList.appendChild(featuresFragment);
  };
  renderFeatures(ad.offer.features);

  cardElement.querySelector('.popup__description').textContent = ad.offer.description;

  var photoList = cardElement.querySelector('.popup__photos');
  var renderPhoto = function (photos) {
    var photoFragment = document.createDocumentFragment();
    for (var photoIndex = 0; photoIndex < photos.length; photoIndex++) {
      var photoElement = photoList.querySelector('img').cloneNode(true);
      photoElement.src = photos[photoIndex];
      photoFragment.appendChild(photoElement);
    }
    photoList.innerHTML = '';
    photoList.appendChild(photoFragment);
  };
  renderPhoto(ad.offer.photos);

  cardElement.querySelector('.popup__avatar').src = ad.author.avatar;

  return cardElement;
};

fragment.appendChild(renderCard(ads[getRandomNumber(0, 8)]));
document.querySelector('.map').appendChild(fragment);

