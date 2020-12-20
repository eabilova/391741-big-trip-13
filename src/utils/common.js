export const getRandomInteger = (min = 0, max = 1) => {
  const minCeiling = Math.ceil(Math.min(min, max));
  const maxFlooring = Math.floor(Math.max(min, max));

  return Math.floor(minCeiling + Math.random() * (maxFlooring - minCeiling + 1));
};

export const updatePoint = (points, update) => {
  const index = points.findIndex((point) => point.id === update.id);

  if (index === -1) {
    return points;
  }

  return [
    ...points.slice(0, index),
    update,
    ...points.slice(index + 1)
  ];
};
