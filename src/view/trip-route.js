const generateRouteInformation = (points) => {
  const cities = points.reduce((total, point) => {
      return total.concat(point.city);
    }, []);
  return cities.join(` - `);
};

const generateTripDates = (points) => {
  return points[0].time.day + ` - ` + points[points.length - 1].time.day;
};
export const tripRouteTemplate = (points) => {
  const fullRoute = generateRouteInformation(points);
  const tripDates = generateTripDates(points);
  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${fullRoute}</h1>

    <p class="trip-info__dates">${tripDates}</p>
  </div>`;
};
