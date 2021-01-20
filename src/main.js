import SiteMenu from "./view/site-menu.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import {UpdateType, MenuItem} from "./const.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import TripInfoPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import Statistics from "./view/statistics.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic 39hgp-1tfg7dph56vd`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

let destinationList;
let offerList;

const siteHeader = document.querySelector(`header`);
const tripMain = siteHeader.querySelector(`.trip-main`);
const tripControls = siteHeader.querySelector(`.trip-controls`);
const switchControl = tripControls.querySelector(`h2:first-of-type`);
const filterControl = tripControls.querySelector(`h2:last-of-type`);
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
const siteMenuComponent = new SiteMenu();

const tripInfo = new TripInfoPresenter(tripMain, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(filterControl, filterModel, filterModel);

const handlePointNewFormClose = () => {
  siteMenuComponent.getElement().querySelector(`[data-value=${MenuItem.TABLE}]`).classList.add(`trip-tabs__btn--active`);
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      siteMenuComponent.getElement().querySelector(`[data-value=${MenuItem.STATISTICS}]`).classList.remove(`trip-tabs__btn--active`);
      siteMenuComponent.getElement().querySelector(`[data-value=${MenuItem.TABLE}]`).classList.add(`trip-tabs__btn--active`);
      tripInfo.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      siteMenuComponent.getElement().querySelector(`[data-value=${MenuItem.TABLE}]`).classList.remove(`trip-tabs__btn--active`);
      siteMenuComponent.getElement().querySelector(`[data-value=${MenuItem.STATISTICS}]`).classList.add(`trip-tabs__btn--active`);
      tripInfo.destroy();
      statisticsComponent = new Statistics(pointsModel.getPoints());
      render(main, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

filterPresenter.init();
tripInfo.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  if (statisticsComponent) {
    remove(statisticsComponent);
    siteMenuComponent.getElement().querySelector(`[data-value=${MenuItem.STATISTICS}]`).classList.remove(`trip-tabs__btn--active`);
  }
  evt.preventDefault();
  tripInfo.createPoint(handlePointNewFormClose);
  tripInfo.init();
  siteMenuComponent.getElement().querySelector(`[data-value=${MenuItem.TABLE}]`).classList.remove(`trip-tabs__btn--active`);
});

api.getDestinations()
.then((destinations) => {
  destinationList = destinations;
})
.then(() => {
  return api.getOffers()
  .then((offers) => {
    offerList = offers;
  });
})
.then(() => {
  return api.getPoints().then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    render(switchControl, siteMenuComponent, RenderPosition.AFTEREND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  }).catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    render(switchControl, siteMenuComponent, RenderPosition.AFTEREND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });
});
