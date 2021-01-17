import {UpdateType} from "./const.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import TripInfoPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic 39hgp-1tfg7dph56vd`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

let destinationList;
let offerList;

const siteHeader = document.querySelector(`header`);
const tripMain = siteHeader.querySelector(`.trip-main`);
const tripControls = siteHeader.querySelector(`.trip-controls`);
export const switchControl = tripControls.querySelector(`h2:first-of-type`);
export const filterControl = tripControls.querySelector(`h2:last-of-type`);
const main = document.querySelector(`main`);
export const tripEvents = main.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

export const getDestinationList = () => {
  return destinationList;
};

export const getOfferList = () => {
  return offerList;
};

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const tripInfo = new TripInfoPresenter(tripMain, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(filterControl, filterModel, filterModel);

filterPresenter.init();
tripInfo.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripInfo.createPoint();
});

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });


api.getDestinations()
.then((destinations) => {
  destinationList = destinations;
});

api.getOffers()
  .then((offers) => {
    offerList = offers;
  });
