import {render, RenderPosition} from "../utils/render.js";
import InfoSection from "../view/trip-info-section.js";
import TripInfo from "../view/trip-route.js";
import TripCost from "../view/trip-cost.js";
import SiteMenu from "../view/site-menu.js";
import SiteFilter from "../view/site-filter.js";
import SiteSorting from "../view/sorting.js";
import {switchControl, filterControl, tripEvents} from "../main.js";

export default class Trip {
  constructor(tripInfoContainer) {
    this._tripInfoContainer = tripInfoContainer;

    this._infoSectionComponent = new InfoSection();
    this._siteMenuComponent = new SiteMenu();
    this._filterComponent = new SiteFilter();
    this._siteSortingComponent = new SiteSorting();
  }

  init(points) {
    this._points = points;
    render(this._tripInfoContainer, this._infoSectionComponent, RenderPosition.AFTERBEGIN);
    this._renderTripInfo(this._points);
    this._renderSiteMode();
    this._renderFilter();
    this._renderSort();
  }

  _renderTripInfo(points) {
    if (this._points.length !== 0) {
      this._tripInfoComponent = new TripInfo(points);
      this._tripCostComponent = new TripCost(points);
      render(this._infoSectionComponent, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      render(this._infoSectionComponent, this._tripCostComponent, RenderPosition.BEFOREEND);
    }
  }

  _renderSort() {
    render(tripEvents, this._siteSortingComponent, RenderPosition.BEFOREEND);
  }

  _renderFilter() {
    render(filterControl, this._filterComponent, RenderPosition.AFTEREND);
  }

  _renderSiteMode() {
    render(switchControl, this._siteMenuComponent, RenderPosition.AFTEREND);
  }
}
