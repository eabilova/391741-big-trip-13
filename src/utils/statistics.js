import {FULL_DAY_IN_MINUTES} from "../const.js";
import dayjs from "dayjs";

const getPointListOfSpecifiedType = (points, type) => {
  return points.filter((point) => point.type === type.toLowerCase());
};

const getTotalPriceByType = (points, type) => {
  const items = getPointListOfSpecifiedType(points, type);

  return items.reduce(function (sum, point) {
    return sum + point.price;
  }, 0);
};

const getTotalCountByType = (points, type) => {
  const items = getPointListOfSpecifiedType(points, type);
  return items.length;
};

const getPointDurationByType = (time) => {
  const {endFullDate, startFullDate} = time;
  return dayjs(endFullDate).diff(dayjs(startFullDate), `minute`);
};

const getTotalDurationCountByType = (points, type) => {
  const items = getPointListOfSpecifiedType(points, type);
  const total = items.reduce(function (sum, point) {
    return sum + getPointDurationByType(point.time);
  }, 0);

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
