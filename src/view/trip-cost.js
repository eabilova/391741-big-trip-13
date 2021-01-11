import Abstract from "./abstract.js";

export const tripCostTemplate = (points) => {
  const total = (points.map((point) => parseInt(point.price, 10))).reduce((a, b) => a + b, 0);

  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
  </p>`;
};

export default class TripCost extends Abstract {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return tripCostTemplate(this._points);
  }
}
