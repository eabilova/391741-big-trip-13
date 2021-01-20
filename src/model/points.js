import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(eventType, points) {
    this._points = points.slice();

    this._notify(eventType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(eventType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting trip point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(eventType, update);
  }

  addPoint(eventType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(eventType, update);
  }

  deletePoint(eventType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting trip point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(eventType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          isFavorite: point.is_favorite,
          extraOffers: point.offers,
          city: point.destination.name,
          destinationDescription: point.destination.description,
          photoLinks: point.destination.pictures,
          price: point.base_price,
          time: {
            startFullDate: point.date_from,
            endFullDate: point.date_to
          }
        }
    );

    delete adaptedPoint.is_favorite;
    delete adaptedPoint.offers;
    delete adaptedPoint.destination;
    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "is_favorite": point.isFavorite,
          "offers": point.extraOffers,
          "destination": {
            "name": point.city,
            "description": point.destinationDescription,
            "pictures": point.photoLinks,
          },
          "base_price": parseInt(point.price, 10),
          "date_from": point.time.startFullDate,
          "date_to": point.time.endFullDate
        }
    );

    delete adaptedPoint.extraOffers;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.city;
    delete adaptedPoint.destinationDescription;
    delete adaptedPoint.photoLinks;
    delete adaptedPoint.price;
    delete adaptedPoint.time;

    return adaptedPoint;
  }
}
