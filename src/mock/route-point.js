import dayjs from "dayjs";
import {getRandomInteger} from "../utils/common.js";
import {EVENT_TYPES, OFFERS, CITIES, PHOTO_AMOUNT, PRICE_AMOUNT, TIME_DIFFERENCE, DAY_DIFFERENCE, DESCRIPTION} from "../const.js";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateRouteType = () => {
  const randomIndex = getRandomInteger(0, EVENT_TYPES.length - 1);
  return EVENT_TYPES[randomIndex];
};

const getCity = () => {
  const randomIndex = getRandomInteger(0, CITIES.length - 1);

  return CITIES[randomIndex];
};

const generateExtraOffers = () => {
  return OFFERS.slice(getRandomInteger(0, OFFERS.length - 1));
};

const generateDescription = () => {
  const splitDescription = DESCRIPTION.split(`. `);

  return splitDescription.slice(0, getRandomInteger(0, splitDescription.length - 1)).join(`. `);
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
  return {
    id: generateId(),
    type: generateRouteType(),
    city: getCity(),
    extraOffers: generateExtraOffers(),
    destinationDescription: generateDescription(),
    photosAmount: getRandomInteger(PHOTO_AMOUNT.min, PHOTO_AMOUNT.max),
    time: generateDate(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    price: getRandomInteger(PRICE_AMOUNT.min, PRICE_AMOUNT.max),
  };
};
