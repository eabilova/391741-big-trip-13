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


const TASK_COUNT = 3;
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

const tripInforSection = tripMain.querySelector(`.trip-info`);
render(tripInforSection, tripRouteTemplate(), AFTERBEGIN);
render(tripInforSection, tripCostTemplate(), BEFOREEND);
render(switchControl, siteMenuTempalte(), AFTEREND);
render(filterControl, siteFilterTemplate(), AFTEREND);
render(tripEvents, siteSortingTemplate(), BEFOREEND);
render(tripEvents, siteContentListTemplate(), BEFOREEND);

const tripList = tripEvents.querySelector(`.trip-events__list`);
render(tripList, editingFormTemlplate(), AFTERBEGIN);
for (let i = 0; i < TASK_COUNT; i++) {
  render(tripList, siteContentListItemTemplate(), BEFOREEND);
}
