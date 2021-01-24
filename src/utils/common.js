import dayjs from "dayjs";

const UnitMapping = {
  days: 24 * 60 * 60 * 1000,
  hours: 60 * 60 * 1000,
  minutes: 60 * 1000,
  seconds: 1000
};

const floor = (value) => {
  return Math.floor(value);
};

export const getHumanizedDiff = (diff) => {
  const day = floor(diff / UnitMapping.days);
  const dayDiff = day > 0 ? day.toLocaleString(`en-US`, {minimumIntegerDigits: 2, useGrouping: false}) : day;
  const hourDiff = (floor((diff % UnitMapping.days) / UnitMapping.hours)).toLocaleString(`en-US`, {minimumIntegerDigits: 2, useGrouping: false});
  const minDiff = (floor((diff % UnitMapping.hours) / UnitMapping.minutes)).toLocaleString(`en-US`, {minimumIntegerDigits: 2, useGrouping: false});

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
