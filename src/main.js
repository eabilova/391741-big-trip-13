import SiteMenu from "./view/site-menu.js";
import {render, Position, remove} from "./utils/render.js";
import {UpdateType, MenuItem} from "./const.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import TripInfoPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import Statistics from "./view/statistics.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic 39hgp-1tf6g7dghvd`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

let destinationList;
let offerList;
let statisticsComponent = null;
const api = new Api(END_POINT, AUTHORIZATION);

const siteHeader = document.querySelector(`header`);
const tripMain = siteHeader.querySelector(`.trip-main`);
const tripControls = siteHeader.querySelector(`.trip-controls`);
const switchControl = tripControls.querySelector(`h2:first-of-type`);
const filterControl = tripControls.querySelector(`h2:last-of-type`);
const main = document.querySelector(`main`);
const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
const tripEvents = main.querySelector(`.trip-events`);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const siteMenuComponent = new SiteMenu();

const tripInfo = new TripInfoPresenter(tripMain, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(filterControl, filterModel, filterModel);

filterPresenter.init();
tripInfo.init();

const getDestinationList = () => {
  return destinationList;
};

const getOfferList = () => {
  return offerList;
};

const handleNewPointFormClose = () => {
  siteMenuComponent.activateTable();
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      siteMenuComponent.deactivateStat();
      siteMenuComponent.activateTable();
      tripInfo.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      siteMenuComponent.deactivateTable();
      siteMenuComponent.activateStat();
      tripInfo.destroy();
      statisticsComponent = new Statistics(pointsModel.getPoints());
      render(main, statisticsComponent, Position.BEFOREEND);
      break;
  }
};

const newButtonClickHandler = (evt) => {
  evt.preventDefault();
  newEventButton.disabled = true;
  siteMenuComponent.deactivateTable();
  if (statisticsComponent) {
    remove(statisticsComponent);
    siteMenuComponent.deactivateStat();
    siteMenuComponent.activateTable();
  }
  tripInfo.createPoint(handleNewPointFormClose);
  newEventButton.removeEventListener(`click`, newButtonClickHandler);
};

newEventButton.addEventListener(`click`, newButtonClickHandler);

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
    render(switchControl, siteMenuComponent, Position.AFTEREND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });
})
.catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);
  render(switchControl, siteMenuComponent, Position.AFTEREND);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
});

export {newEventButton, tripEvents, newButtonClickHandler, getDestinationList, getOfferList};
