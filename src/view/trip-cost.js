import {createElement} from "../utils/render.js";

export const tripCostTemplate = (points) => {
  const total = (points.map((point) => point.price)).reduce((a, b) => a + b, 0);

  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
  </p>`;
};

export default class TripCost {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return tripCostTemplate(this._points);
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
