import dayjs from "dayjs";

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateRouteType = () => {
  const types = [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`,
    `Check-in`,
    `Sightseeing`,
    `Restaurant`,
  ];
  const randomIndex = getRandomInteger(0, types.length - 1);

  return types[randomIndex];
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

// const generateExtraOffers = () => {
//   const offers = [
//     `Add luggage`,
//     `Switch to comfort`,
//     `Add meal`,
//     `Choose seats`,
//     `Travel by train`,
//   ];
//
//   return offers.slice(0, getRandomInteger(0, offers.length - 1));
// };

const generateDescription = () => {
  const splitDescription = DESCRIPTION.split(`. `);

  return splitDescription.slice(0, getRandomInteger(0, splitDescription.length - 1)).join(`. `);
};

const generateDate = () => {
  const date = new Date();
  const day = dayjs(date).format(`MMM DD`);
  const startTime = dayjs(date).format(`HH:mm`);
  const endDate = dayjs(date).add(getRandomInteger(0, 12), `hour`);
  const endTime = endDate.format(`HH:mm`)
  const duration = endDate.diff(dayjs(date), `minute`);

  return {
    day,
    startTime,
    endTime,
    duration,
  }
};

export const generateRoute = () => {
  const date = generateDate();
  return {
    type: generateRouteType(),
    city: generateToCity(),
    // extraOffers: generateExtraOffers(),
    destinationDescription: generateDescription(),
    photo: `http://picsum.photos/248/152?r=${Math.random()}`,
    time: {
      date: date.day,
      startTime: date.startTime,
      endTime: date.endTime,
      duration: date.duration
    },
    isFavorite: Boolean(getRandomInteger(0, 1)),
    price: getRandomInteger(0, 200),
  };
};
