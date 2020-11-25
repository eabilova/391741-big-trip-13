import dayjs from "dayjs";
import {getRandomInteger} from "../utils/render.js";
import {EVENT_TYPES} from "../const.js";

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const generateRouteType = () => {
  const randomIndex = getRandomInteger(0, EVENT_TYPES.length - 1);
  return EVENT_TYPES[randomIndex];
};

const generateToCity = () => {
  const cities = [
    `Las Vegas`,
    `Los Angeles`,
    `San Francisco`,
    `Houston`,
    `New York`,
  ];

  const randomIndex = getRandomInteger(0, cities.length - 1);

  return cities[randomIndex];
};

const generateExtraOffers = () => {
  const offers = [
    {
      id: "luggage",
      offerName: "Add luggage",
      price: 30
    },
    {
      id: "comfort",
      offerName: "Switch to comfort",
      price: 100
    },
    {
      id: "meal",
      offerName: "Add meal",
      price: 15
    },
    {
      id: "seats",
      offerName: "Choose seats",
      price: 5
    },
    {
      id: "train",
      offerName: "Travel by train",
      price: 40
    },
  ];

  return offers.slice(getRandomInteger(0, offers.length - 1));
};

const generateDescription = () => {
  const splitDescription = DESCRIPTION.split(`. `);

  return splitDescription.slice(0, getRandomInteger(0, splitDescription.length - 1)).join(`. `);
};

const generateDate = () => {
  const date = new Date();
  const day = dayjs(date).format(`MMM DD`);
  const startFullDate = dayjs(date).format(`DD/MM/YY HH:mm`);
  const startTime = dayjs(date).format(`HH:mm`);
  const endDate = dayjs(date).add(getRandomInteger(0, 12), `hour`);
  const endFullDate = endDate.format(`DD/MM/YY HH:mm`);
  const endTime = endDate.format(`HH:mm`);
  const duration = endDate.diff(dayjs(date), `minute`);

  return {
    day,
    startFullDate,
    endFullDate,
    startTime,
    endTime,
    duration,
  };
};

export const generateRoute = () => {
  const date = generateDate();
  return {
    type: generateRouteType(),
    city: generateToCity(),
    extraOffers: generateExtraOffers(),
    destinationDescription: generateDescription(),
    photo: `http://picsum.photos/248/152?r=Math.random()`,
    time: {
      date: date.day,
      startFullDate: date.startFullDate,
      startTime: date.startTime,
      endFullDate: date.endFullDate,
      endTime: date.endTime,
      duration: date.duration
    },
    isFavorite: Boolean(getRandomInteger(0, 1)),
    price: getRandomInteger(0, 200),
  };
};
