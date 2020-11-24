const generateRouteInformation = (points) => {
  const route = [];
  for (let i = 0; i < points.length; i++) {
    const {city} = points[i];
    route[i] = city;
 }
  return route.join(' - ')
}

const generateTripDates = (points) => {
  const {time} = points;
  return points[0].time.date + `-` + points[points.length-1].time.date;
}
export const tripRouteTemplate = (points) => {
  const fullRoute = generateRouteInformation(points);
  const tripDates = generateTripDates(points);
  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${fullRoute}</h1>

    <p class="trip-info__dates">${tripDates}</p>
  </div>`;
};
