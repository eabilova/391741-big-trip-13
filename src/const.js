export const DESCRIPTION = `loremipsum`;
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
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};
