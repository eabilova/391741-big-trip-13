export const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

export const EVENT_TYPES = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
  `check-in`,
  `sightseeing`,
  `restaurant`,
];

export const OFFER_LIST = {
  luggage: {
    id: `luggage`,
    title: `Add luggage`,
    price: 30
  },
  comfort: {
    id: `comfort`,
    title: `Switch to comfort`,
    price: 100
  },
  meal: {
    id: `meal`,
    title: `Add meal`,
    price: 15
  },
  seats: {
    id: `seats`,
    title: `Choose seats`,
    price: 5
  },
  train: {
    id: `train`,
    title: `Travel by train`,
    price: 40
  }
};


export const OFFERS = [{
  type: `taxi`,
  offers: [OFFER_LIST.luggage, OFFER_LIST.comfort, OFFER_LIST.seats, OFFER_LIST.train]
},
{
  type: `bus`,
  offers: [OFFER_LIST.luggage, OFFER_LIST.comfort, OFFER_LIST.meal, OFFER_LIST.seats, OFFER_LIST.train]
},
{
  type: `train`,
  offers: [OFFER_LIST.luggage, OFFER_LIST.comfort, OFFER_LIST.meal, OFFER_LIST.seats]
},
{
  type: `ship`,
  offers: [OFFER_LIST.luggage, OFFER_LIST.comfort, OFFER_LIST.meal, OFFER_LIST.seats, OFFER_LIST.train]
},
{
  type: `transport`,
  offers: [OFFER_LIST.luggage, OFFER_LIST.comfort, OFFER_LIST.seats, OFFER_LIST.train]
},
{
  type: `drive`,
  offers: [OFFER_LIST.train]
},
{
  type: `flight`,
  offers: [OFFER_LIST.luggage, OFFER_LIST.comfort, OFFER_LIST.meal, OFFER_LIST.seats, OFFER_LIST.train]
},
{
  type: `check-in`,
  offers: [OFFER_LIST.comfort, OFFER_LIST.meal]
},
{
  type: `sightseeing`,
  offers: [OFFER_LIST.comfort]
},
{
  type: `restaurant`,
  offers: []
}
];

export const CITIES = [
  `Las Vegas`,
  `Los Angeles`,
  `San Francisco`,
  `Houston`,
  `New York`,
];

export const PHOTO_NUMBER = {
  min: 0,
  max: 1000
};

export const PHOTO_AMOUNT = {
  min: 0,
  max: 10
};

export const PRICE_AMOUNT = {
  min: 0,
  max: 200
};

export const TIME_DIFFERENCE = {
  firstHalf: {
    min: 0,
    max: 6
  },
  secondHalf: {
    min: 7,
    max: 12
  }
};

export const DAY_DIFFERENCE = {
  min: 0,
  max: 7
};

export const POINT_COUNT = 5;

export const SortType = {
  DAY: `sort-day`,
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
  OFFER: `sort-offer`,
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};
