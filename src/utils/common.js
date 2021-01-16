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
  return `${floor(diff / UnitMapping.days)}D ${floor((diff % UnitMapping.days) / UnitMapping.hours)}H ${floor((diff % UnitMapping.hours) / UnitMapping.minutes)}M`;
};
