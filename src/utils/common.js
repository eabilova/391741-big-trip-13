import dayjs from "dayjs";

const UnitMapping = {
  DAYS: 24 * 60 * 60 * 1000,
  HOURS: 60 * 60 * 1000,
  MINUTES: 60 * 1000
};

const getFloorValue = (value) => {
  return Math.floor(value);
};

export const getTimePeriodDifference = (diff) => {
  const day = getFloorValue(diff / UnitMapping.DAYS);
  const dayDiff = day > 0 ? day.toLocaleString(`en-US`, {minimumIntegerDigits: 2, useGrouping: false}) : day;
  const hourDiff = (getFloorValue((diff % UnitMapping.DAYS) / UnitMapping.HOURS)).toLocaleString(`en-US`, {minimumIntegerDigits: 2, useGrouping: false});
  const minDiff = (getFloorValue((diff % UnitMapping.HOURS) / UnitMapping.MINUTES)).toLocaleString(`en-US`, {minimumIntegerDigits: 2, useGrouping: false});

  let duration;

  if (dayDiff > 0) {
    duration = `${dayDiff}D ${hourDiff}H ${minDiff}M`;
  } else if (dayDiff === 0 && hourDiff !== `00`) {
    duration = `${hourDiff}H ${minDiff}M`;
  } else if (dayDiff === 0 && hourDiff === `00` && (minDiff > 0 || minDiff === `00`)) {
    duration = `${minDiff}M`;
  }
  return duration;
};

export const getPointsDuration = (point) => {
  const {time} = point;
  return dayjs(time.endFullDate).diff(dayjs(time.startFullDate), `minute`);
};
