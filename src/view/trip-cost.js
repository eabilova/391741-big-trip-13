import Abstract from "./abstract.js";

const calculateTripCost = (points) => {
  let offers = [];
  let offerPrices = [];
  points.forEach((point) => offers.push(point.extraOffers));
  offers.forEach((offer) => offer.forEach((pointOffer) => offerPrices.push(pointOffer.price)));
  const pointPrice = (points.map((point) => parseInt(point.price, 10))).reduce((a, b) => a + b, 0);
  const offerPrice = (offerPrices.map((offer) => parseInt(offer, 10))).reduce((a, b) => a + b, 0);
  return offerPrice + pointPrice;
};

export const tripCostTemplate = (points) => {
  const total = calculateTripCost(points);

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
