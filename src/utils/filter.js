import {FilterType} from "../const";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => Date.parse(point.time.startFullDate) >= new Date()),
  [FilterType.PAST]: (points) => points.filter((point) => Date.parse(point.time.startFullDate) < new Date())
};
