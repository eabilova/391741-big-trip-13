import dayjs from "dayjs";
import {getRandomInteger, generateDescription, generatePhotoList, generateId} from "../utils/common.js";
import {EVENT_TYPES, OFFERS, CITIES, PRICE_AMOUNT, TIME_DIFFERENCE, DAY_DIFFERENCE} from "../const.js";


const generateRouteType = () => {
  const randomIndex = getRandomInteger(0, EVENT_TYPES.length - 1);
  return EVENT_TYPES[randomIndex];
};

const getCity = () => {
  const randomIndex = getRandomInteger(0, CITIES.length - 1);

  return CITIES[randomIndex];
};

const generateExtraOffers = (pointType) => {
  let currentOffer;
  OFFERS.forEach((offer) => {
    if (offer.type === pointType) {
      currentOffer = offer.offers.slice(getRandomInteger(0, offer.offers.length - 1));
    }
  });
  return currentOffer;
};

const generateDate = () => {
  const date = new Date();
  const tripDate = dayjs(date).add(getRandomInteger(DAY_DIFFERENCE.min, DAY_DIFFERENCE.max), `day`).add(getRandomInteger(TIME_DIFFERENCE.firstHalf.min, TIME_DIFFERENCE.firstHalf.max), `hour`);
  const day = tripDate.format(`MMM DD`);
  const startFullDate = tripDate.format(`DD/MM/YY HH:mm`);
  const startTime = tripDate.format(`HH:mm`);
  const endDate = tripDate.add(getRandomInteger(TIME_DIFFERENCE.secondHalf.min, TIME_DIFFERENCE.secondHalf.max), `hour`);
  const endFullDate = endDate.format(`DD/MM/YY HH:mm`);
  const endTime = endDate.format(`HH:mm`);
  const duration = endDate.diff(dayjs(date), `hour`);

  return {
    tripDate,
    day,
    startFullDate,
    endFullDate,
    startTime,
    endTime,
    duration,
  };
};

export const generateRoute = () => {
  const type = generateRouteType();

  return {
    id: generateId(),
    type,
    city: getCity(),
    extraOffers: generateExtraOffers(type),
    destinationDescription: generateDescription(),
    photoLinks: generatePhotoList(),
    time: generateDate(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    price: getRandomInteger(PRICE_AMOUNT.min, PRICE_AMOUNT.max),
  };
};
