var elem = document.querySelector(".map");
elem.classList.remove('map--faded');
var TITLE_NAMES = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var TYPE_NAMES = ["flat", "house", "bungalo"];
var CHECKING_TIMES= ["12:00", "13:00", "14:00"];
var FEATURES_LIST = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"]

var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var createOffer = function () {
  var offer = [];
  for (var i = 0; i < 8; i++) {
    offer.push({
      title: TITLE_NAMES[getRandomInteger(0, TITLE_NAMES.length)],
      address: location.x + ' ' + location.y,
      price: getRandomInteger(1000, 1000000),
      type: TYPE_NAMES[getRandomInteger(0, TYPE_NAMES.length)],
      rooms: getRandomInteger(1, 5),
      guests: getRandomInteger(1, 25),
      checkin: CHECKING_TIMES[getRandomInteger(0, CHECKING_TIMES.length)],
      checkout: CHECKING_TIMES[getRandomInteger(0, CHECKING_TIMES.length)],
      features:
      description: "",
      photos: []
    });
  }
  return offer;
};

var createAuthor = function () {
  var author = [];
   for (var i = 0; i < 8; i++) {
    author.push({
    	avatar: "img/avatars/user"+0+getRandomInteger(1, 8)+".png"
    });
	}
return author;
};

var createLocation = function () {
  var location = [];
   for (var i = 0; i < 8; i++) {
    location.push({
    	x: getRandomInteger(300, 900),
    	y: getRandomInteger(100, 500)
    });
	}
return location;
}; 

