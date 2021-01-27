import Abstract from "./abstract.js";
import dayjs from "dayjs";

const defineShortDates = (points) => {
  let dates = [];

  points.forEach((point, index) => {
    dates[index] = dayjs(point.time.startFullDate).format(`MMM DD`);
  });

  return dates;
};

const createTripRouteTemplate = (points) => {
  const shortDates = defineShortDates(points);

  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${points[0].city} - ${points[points.length - 1].city}</h1>

    <p class="trip-info__dates">${shortDates[0]} - ${shortDates[points.length - 1]}</p>
  </div>`;
};

export default class TripInfo extends Abstract {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripRouteTemplate(this._points);
  }
}
