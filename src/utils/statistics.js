import dayjs from "dayjs";
import {FULL_DAY_IN_MINUTES} from "../const.js";


const getTotalPriceByType = (points, type) => {
  let total = 0;

  points.forEach((point) => {
    if (point.type === type.toLowerCase()) {
      total += parseInt(point.price, 10);
    }
  });

  return total;
};

const getTotalCountByType = (points, type) => {
  let total = 0;

  points.forEach((point) => {
    if (point.type === type.toLowerCase()) {
      total++;
    }
  });

  return total;
};

const getPointDurationByType = (time) => {
  const {endFullDate, startFullDate} = time;
  return dayjs(endFullDate).diff(dayjs(startFullDate), `minute`);
};

const getTotalDurationCountByType = (points, type) => {
  let total = 0;

  points.forEach((point) => {
    if (point.type === type.toLowerCase()) {
      total += getPointDurationByType(point.time);
    }
  });

  return Math.round(total / FULL_DAY_IN_MINUTES);
};

export const getTotalPriceByTypes = (points, types) => {
  return types.map((type) => getTotalPriceByType(points, type));
};

export const getTotalCountByTypes = (points, types) => {
  return types.map((type) => getTotalCountByType(points, type));
};

export const getTotalDurationCountByTypes = (points, types) => {
  return types.map((type) => getTotalDurationCountByType(points, type));
};

export const makeItemsUniq = (items) => [...new Set(items)];
