import Abstract from "./abstract.js";

const tripRouteTemplate = (points) => {
  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${points[0].city} - ${points[points.length - 1].city}</h1>

    <p class="trip-info__dates">${points[0].time.day} - ${points[points.length - 1].time.day}</p>
  </div>`;
};

export default class TripInfo extends Abstract {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return tripRouteTemplate(this._points);
  }
}
