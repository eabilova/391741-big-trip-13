import {render, RenderPosition} from "./utils/render.js";
import InfoSection from "./view/trip-info-section.js";
import TripInfo from "./view/trip-route.js";
import TripCost from "./view/trip-cost.js";
import SiteMenu from "./view/site-menu.js";
import SiteFilter from "./view/site-filter.js";
import SiteSorting from "./view/sorting.js";
import EmptyList from "./view/no-points.js";
import RouteList from "./view/content-list.js";
import EditingForm from "./view/editing-form.js";
import RoutePoint from "./view/content-list-item.js";
import EventOffer from "./view/event-offer.js";
import {generateRoute} from "./mock/route-point.js";

const POINT_COUNT = 20;

const points = new Array(POINT_COUNT).fill().map(generateRoute);
const sortedPoints = points.sort((a, b) => a.time.tripDate - b.time.tripDate);

const renderRoutePoint = (routeList, point) => {
  const routePoint = new RoutePoint(point);
  const editRoutePoint = new EditingForm(point);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToPoint();
    }
  };

  const onClickClose = (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
  }

  const replacePointToForm = () => {
    routeList.replaceChild(editRoutePoint.getElement(), routePoint.getElement());
    editRoutePoint.getElement().addEventListener(`submit`, replaceFormToPoint);
    editRoutePoint.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onClickClose)
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const replaceFormToPoint = () => {
    routeList.replaceChild(routePoint.getElement(), editRoutePoint.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  routePoint.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToForm();
  });

  render(routeList, routePoint.getElement(), RenderPosition.BEFOREEND);
};

const siteHeader = document.querySelector(`header`);
const tripMain = siteHeader.querySelector(`.trip-main`);
const tripControls = siteHeader.querySelector(`.trip-controls`);
const switchControl = tripControls.querySelector(`h2:first-of-type`);
const filterControl = tripControls.querySelector(`h2:last-of-type`);
const main = document.querySelector(`main`);
const tripEvents = main.querySelector(`.trip-events`);

const infoSectionComponent = new InfoSection();
render(tripMain, infoSectionComponent.getElement(), RenderPosition.AFTERBEGIN);

if (points.length !== 0) {
  const tripInfoComponent = new TripInfo(sortedPoints);
  const tripCostComponent = new TripCost(sortedPoints);
  render(infoSectionComponent.getElement(), tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
  render(infoSectionComponent.getElement(), tripCostComponent.getElement(), RenderPosition.BEFOREEND);
}

const siteMenuComponent = new SiteMenu();
const filterComponent = new SiteFilter();
render(switchControl, siteMenuComponent.getElement(), RenderPosition.AFTEREND);
render(filterControl, filterComponent.getElement(), RenderPosition.AFTEREND);

const siteSortingComponent = new SiteSorting();
render(tripEvents, siteSortingComponent.getElement(), RenderPosition.BEFOREEND);

if (points.length !== 0) {
  const routeListComponent = new RouteList();
  render(tripEvents, routeListComponent.getElement(), RenderPosition.BEFOREEND);

  const renderOffers = (point, index) => {
    const offerContainer = routeListComponent.getElement().querySelectorAll(`.event__selected-offers`);
    const {extraOffers} = point;
    extraOffers.forEach((offer) => {
      const eventOfferComponent = new EventOffer(offer);
      render(offerContainer[index], eventOfferComponent.getElement(), RenderPosition.BEFOREEND);
    });
  };

  sortedPoints.forEach((point, index) => {
    renderRoutePoint(routeListComponent.getElement(), point);
    renderOffers(point, index);
  });
} else {
  const emptyList = new EmptyList();
  render(tripEvents, emptyList.getElement(), RenderPosition.BEFOREEND);
}


