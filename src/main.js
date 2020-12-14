import {POINT_COUNT} from "./const.js";
import PointPresenter from "./presenter/point.js";
import TripInfoPresenter from "./presenter/trip.js";
import {generateRoute} from "./mock/route-point.js";

const siteHeader = document.querySelector(`header`);
const tripMain = siteHeader.querySelector(`.trip-main`);
const tripControls = siteHeader.querySelector(`.trip-controls`);
export const switchControl = tripControls.querySelector(`h2:first-of-type`);
export const filterControl = tripControls.querySelector(`h2:last-of-type`);
const main = document.querySelector(`main`);
export const tripEvents = main.querySelector(`.trip-events`);

const points = new Array(POINT_COUNT).fill().map(generateRoute);
const sortedPoints = points.sort((a, b) => a.time.tripDate - b.time.tripDate);

const tripInfo = new TripInfoPresenter(tripMain);
tripInfo.init(sortedPoints);

const routePoint = new PointPresenter(tripEvents);
routePoint.init(sortedPoints);
