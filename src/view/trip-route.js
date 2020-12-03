import {createElement} from "../utils/render.js";

const tripRouteTemplate = (points) => {
  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${points[0].city} - ${points[points.length - 1].city}</h1>

    <p class="trip-info__dates">${points[0].time.day} - ${points[points.length - 1].time.day}</p>
  </div>`;
};

export default class TripInfo {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return tripRouteTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
