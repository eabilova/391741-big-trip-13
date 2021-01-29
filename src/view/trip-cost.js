import Abstract from "./abstract.js";

const calculateTripCost = (points) => {
  const offers = [];
  const offerPrices = [];
  points.forEach((point) => offers.push(point.extraOffers));
  offers.forEach((offer) => offer.forEach((pointOffer) => offerPrices.push(pointOffer.price)));
  const pointPrice = (points.map((point) => parseInt(point.price, 10))).reduce((a, b) => a + b, 0);
  const offerPrice = (offerPrices.map((offer) => parseInt(offer, 10))).reduce((a, b) => a + b, 0);
  return offerPrice + pointPrice;
};

const createTripCostTemplate = (points) => {
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
    return createTripCostTemplate(this._points);
  }
}
