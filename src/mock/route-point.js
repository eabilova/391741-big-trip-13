import dayjs from "dayjs";
import {getRandomInteger} from "../utils/render.js";
import {EVENT_TYPES, OFFERS, CITIES, PHOTOS} from "../const.js";

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

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
  const tripDate = dayjs(date).add(getRandomInteger(0, 7), `day`).add(getRandomInteger(0, 7), `hour`);
  const day = tripDate.format(`MMM DD`);
  const startFullDate = tripDate.format(`DD/MM/YY HH:mm`);
  const startTime = tripDate.format(`HH:mm`);
  const endDate = tripDate.add(getRandomInteger(7, 12), `hour`);
  const endFullDate = endDate.format(`DD/MM/YY HH:mm`);
  const endTime = endDate.format(`HH:mm`);
  const duration = endDate.diff(dayjs(date), `minute`);

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

const generatePhotos = () => {
  return PHOTOS.slice(getRandomInteger(0, PHOTOS.length - 1), getRandomInteger(0, PHOTOS.length - 1));
};

export const generateRoute = () => {
  return {
    type: generateRouteType(),
    city: getCity(),
    extraOffers: generateExtraOffers(),
    destinationDescription: generateDescription(),
    photo: generatePhotos(),
    time: generateDate(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    price: getRandomInteger(0, 200),
  };
};
