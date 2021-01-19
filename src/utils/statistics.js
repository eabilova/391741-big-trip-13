export const makeItemsUniq = (items) => [...new Set(items)];

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

export const getTotalPriceByTypes = (points, types) => {
  return types.map((type) => getTotalPriceByType(points, type));
};

export const getTotalCountByTypes = (points, types) => {
  return types.map((type) => getTotalCountByType(points, type));
};
