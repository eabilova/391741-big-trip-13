import dayjs from "dayjs";
import {fullDayInMinutes} from "../const.js";


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

const getDuration = (time) => {
  const {endFullDate, startFullDate} = time;
  return dayjs(endFullDate).diff(dayjs(startFullDate), `minute`);
};

const getDurationTotalCountByType = (points, type) => {
  let total = 0;

  points.forEach((point) => {
    if (point.type === type.toLowerCase()) {
      total += getDuration(point.time);
    }
  });

  return Math.round(total / fullDayInMinutes);
};

export const getTotalPriceByTypes = (points, types) => {
  return types.map((type) => getTotalPriceByType(points, type));
};

export const getTotalCountByTypes = (points, types) => {
  return types.map((type) => getTotalCountByType(points, type));
};

export const getDurationTotalCountByTypes = (points, types) => {
  return types.map((type) => getDurationTotalCountByType(points, type));
};

export const makeItemsUniq = (items) => [...new Set(items)];
