import {render} from "./utils/render.js";
import {tripInfoSectionTemplate} from "./view/trip-info-section.js";
import {tripRouteTemplate} from "./view/trip-route.js";
import {tripCostTemplate} from "./view/trip-cost.js";
import {siteMenuTempalte} from "./view/site-menu.js";
import {siteFilterTemplate} from "./view/site-filter.js";
import {siteSortingTemplate} from "./view/sorting.js";
import {siteContentListTemplate} from "./view/content-list.js";
import {editingFormTemlplate} from "./view/editing-form.js";
import {siteContentListItemTemplate} from "./view/content-list-item.js";
import {createEventOffer} from "./view/event-offer.js";
import {generateRoute} from "./mock/route-point.js";

const POINT_COUNT = 20;

const points = new Array(POINT_COUNT).fill().map(generateRoute);

const BEFOREEND = `beforeend`;
const AFTEREND = `afterend`;
const AFTERBEGIN = `afterbegin`;
const siteHeader = document.querySelector(`header`);
const tripMain = siteHeader.querySelector(`.trip-main`);
const tripControls = siteHeader.querySelector(`.trip-controls`);
const switchControl = tripControls.querySelector(`h2:first-of-type`);
const filterControl = tripControls.querySelector(`h2:last-of-type`);
const main = document.querySelector(`main`);
const tripEvents = main.querySelector(`.trip-events`);

render(tripMain, tripInfoSectionTemplate(), AFTERBEGIN);

const tripInfoSection = tripMain.querySelector(`.trip-info`);
render(tripInfoSection, tripRouteTemplate(), AFTERBEGIN);
render(tripInfoSection, tripCostTemplate(), BEFOREEND);
render(switchControl, siteMenuTempalte(), AFTEREND);
render(filterControl, siteFilterTemplate(), AFTEREND);
render(tripEvents, siteSortingTemplate(), BEFOREEND);
render(tripEvents, siteContentListTemplate(), BEFOREEND);

const tripList = tripEvents.querySelector(`.trip-events__list`);
render(tripList, editingFormTemlplate(), AFTERBEGIN);
for (let i = 0; i < points.length; i++) {
  render(tripList, siteContentListItemTemplate(points[i]), BEFOREEND);
  const offerContainer = Array.from(tripList.querySelectorAll(`.event__selected-offers`));
  const {extraOffers} = points[i];
  for (let n = 0; n < extraOffers.length; n++) {
    render(offerContainer[i], createEventOffer(extraOffers[n]), BEFOREEND)
  }
};



