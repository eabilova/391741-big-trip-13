import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting trip point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting trip point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
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
    delete adaptedPoint.destination.name;
    delete adaptedPoint.destination.description;
    delete adaptedPoint.destination.pictures;
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
          "destination.name": point.city,
          "destination.description": point.destinationDescription,
          "destination.pictures": point.photoLinks,
          "base_price": point.price,
          "date_from": point.time.startFullDate,
          "date_to": point.time.endFullDate
        }
    );

    delete adaptedPoint.isFavorite;
    delete adaptedPoint.extraOffers;
    delete adaptedPoint.city;
    delete adaptedPoint.destinationDescription;
    delete adaptedPoint.photoLinks;
    delete adaptedPoint.price;
    delete adaptedPoint.time.startFullDate;
    delete adaptedPoint.time.endFullDate;

    return adaptedPoint;
  }
}
