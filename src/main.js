import {render, RenderPosition, replace} from "./utils/render.js";
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

  const replacePointToForm = () => {
    replace(editRoutePoint, routePoint);
    editRoutePoint.setFormSubmitHandler(() => {
      replaceFormToPoint();
    });
    editRoutePoint.setEditClickHandler(() => {
      replaceFormToPoint();
    });
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const replaceFormToPoint = () => {
    editRoutePoint.removeEditClickHandler(() => {
      replaceFormToPoint();
    });
    replace(routePoint, editRoutePoint);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  routePoint.setClickHandler(() => {
    replacePointToForm();
  });

  render(routeList, routePoint, RenderPosition.BEFOREEND);
};

const siteHeader = document.querySelector(`header`);
const tripMain = siteHeader.querySelector(`.trip-main`);
const tripControls = siteHeader.querySelector(`.trip-controls`);
const switchControl = tripControls.querySelector(`h2:first-of-type`);
const filterControl = tripControls.querySelector(`h2:last-of-type`);
const main = document.querySelector(`main`);
const tripEvents = main.querySelector(`.trip-events`);

const infoSectionComponent = new InfoSection();
render(tripMain, infoSectionComponent, RenderPosition.AFTERBEGIN);

if (points.length !== 0) {
  const tripInfoComponent = new TripInfo(sortedPoints);
  const tripCostComponent = new TripCost(sortedPoints);
  render(infoSectionComponent, tripInfoComponent, RenderPosition.AFTERBEGIN);
  render(infoSectionComponent, tripCostComponent, RenderPosition.BEFOREEND);
}

const siteMenuComponent = new SiteMenu();
const filterComponent = new SiteFilter();
render(switchControl, siteMenuComponent, RenderPosition.AFTEREND);
render(filterControl, filterComponent, RenderPosition.AFTEREND);

const siteSortingComponent = new SiteSorting();
render(tripEvents, siteSortingComponent, RenderPosition.BEFOREEND);

if (points.length !== 0) {
  const routeListComponent = new RouteList();
  render(tripEvents, routeListComponent, RenderPosition.BEFOREEND);

  const renderOffers = (point, index) => {
    const offerContainer = routeListComponent.getElement().querySelectorAll(`.event__selected-offers`);
    const {extraOffers} = point;
    extraOffers.forEach((offer) => {
      const eventOfferComponent = new EventOffer(offer);
      render(offerContainer[index], eventOfferComponent, RenderPosition.BEFOREEND);
    });
  };

  sortedPoints.forEach((point, index) => {
    renderRoutePoint(routeListComponent, point);
    renderOffers(point, index);
  });
} else {
  const emptyList = new EmptyList();
  render(tripEvents, emptyList, RenderPosition.BEFOREEND);
}


