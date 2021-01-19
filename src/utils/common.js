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
  const dayDiff = floor(diff / UnitMapping.days);
  const hourDiff = floor((diff % UnitMapping.days) / UnitMapping.hours);
  const minDiff = floor((diff % UnitMapping.hours) / UnitMapping.minutes);
  let duration;
  if (dayDiff > 0) {
    duration = `${dayDiff}D ${hourDiff}H ${minDiff}m`;
  } else if (dayDiff === 0 && hourDiff > 0) {
    duration = `${hourDiff}H ${minDiff}m`;
  } else if (dayDiff === 0 && hourDiff === 0 && minDiff > 0) {
    duration = `${minDiff}m`;
  }
  return duration;
};
