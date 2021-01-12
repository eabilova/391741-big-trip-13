import {POINT_COUNT} from "./const.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import TripInfoPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import {generateRoute} from "./mock/route-point.js";

const siteHeader = document.querySelector(`header`);
const tripMain = siteHeader.querySelector(`.trip-main`);
const tripControls = siteHeader.querySelector(`.trip-controls`);
export const switchControl = tripControls.querySelector(`h2:first-of-type`);
export const filterControl = tripControls.querySelector(`h2:last-of-type`);
const main = document.querySelector(`main`);
export const tripEvents = main.querySelector(`.trip-events`);

const points = new Array(POINT_COUNT).fill().map(generateRoute);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const tripInfo = new TripInfoPresenter(tripMain, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filterControl, filterModel, filterModel);

filterPresenter.init();
tripInfo.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripInfo.createPoint();
});


