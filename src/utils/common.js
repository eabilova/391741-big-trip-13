import {PHOTO_NUMBER} from "../const.js";
import {DESCRIPTION, PHOTO_AMOUNT} from "../const.js";
export const getRandomInteger = (min = 0, max = 1) => {
  const minCeiling = Math.ceil(Math.min(min, max));
  const maxFlooring = Math.floor(Math.max(min, max));

  return Math.floor(minCeiling + Math.random() * (maxFlooring - minCeiling + 1));
};

export const generatePhotoList = () => {
  let photoAmount = getRandomInteger(PHOTO_AMOUNT.min, PHOTO_AMOUNT.max);
  let photos = [];

  while (photoAmount) {
    let randomNumber = getRandomInteger(PHOTO_NUMBER.min, PHOTO_NUMBER.max);
    photos[photoAmount] = `http://picsum.photos/248/152?r=${randomNumber}.jpg`;
    photoAmount--;
  }

  return photos;
};

export const generateDescription = () => {
  const splitDescription = DESCRIPTION.split(`. `);

  return splitDescription.slice(0, getRandomInteger(0, splitDescription.length - 1)).join(`. `);
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);
