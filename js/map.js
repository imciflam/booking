//to-do
//push index
//lol.content.querySelector('h3'); - works
// random values from random lenght - two loops 
//Array.prototype.fill() check out


var elem = document.querySelector(".map");
elem.classList.remove('map--faded');
var titleNames = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var typeNames = ["flat", "house", "bungalo"];
var checkingTimes= ["12:00", "13:00", "14:00"];
var featuresList = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"]

var offerTemplate = document.querySelector('#tmplt').content;
var typeSelectElement = document.querySelector('#type');
var priceInputElement = document.querySelector('#price');
var timeinSelectElement = document.querySelector('#timein');
var timeoutSelectElement = document.querySelector('#timeout');
var roomNumberSelectElement = document.querySelector('#room_number');
var capacitySelectElement = document.querySelector('#capacity');


var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var createOffer = function () {
  var offer = [];
  for (var i = 0; i < 8; i++) {
    offer.push({
      title: titleNames[getRandomInteger(0, titleNames.length)],
      address: location.x + ' ' + location.y,
      price: getRandomInteger(1000, 1000000),
      type: typeNames[getRandomInteger(0, typeNames.length)],
      rooms: getRandomInteger(1, 5),
      guests: getRandomInteger(1, 25),
      checkin: checkingTimes[getRandomInteger(0, checkingTimes.length)],
      checkout: checkingTimes[getRandomInteger(0, checkingTimes.length)],
      features: featuresList[getRandomInteger(0, featuresList.length)],//сделать несколько
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
//этот кусок дерьма не видит элементы

var render = function () {
  var offerElement = offerTemplate.cloneNode(true);
  offerElement.querySelector('h3').textContent = createOffer()[i].title;
  offerElement.querySelector('small').textContent = createOffer()[i].address;
  offerElement.querySelector('.popup__price').textContent = createOffer()[i].price;

  return offerElement;
};

var fragment = document.createDocumentFragment();

for (var i = 0; i < createOffer().length; i++) {
  fragment.appendChild(render(createOffer()[i]));
}

offerTemplate.appendChild(fragment);
