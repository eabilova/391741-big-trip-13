import InfoSection from "../view/trip-info-section.js";
import TripInfo from "../view/trip-route.js";
import TripCost from "../view/trip-cost.js";
import SiteMenu from "../view/site-menu.js";
import SiteFilter from "../view/site-filter.js";
import SiteSorting from "../view/sorting.js";
import PointPresenter from "./point.js";
import EmptyList from "../view/no-points";
import TripList from "../view/content-list.js";
import {updatePoint} from "../utils/common.js";
import {switchControl, filterControl, tripEvents} from "../main.js";
import {render, RenderPosition} from "../utils/render.js";
import {SortType} from "../const.js";

export default class Trip {
  constructor(tripInfoContainer) {
    this._tripInfoContainer = tripInfoContainer;

    this._tripPoint = {};
    this._currentSortType = SortType.DAY;

    this._infoSectionComponent = new InfoSection();
    this._siteMenuComponent = new SiteMenu();
    this._filterComponent = new SiteFilter();
    this._siteSortingComponent = new SiteSorting();
    this._tripListContainer = new TripList();
    this._emptyList = new EmptyList();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._sourcedPoitList = points.slice();
    this._renderSiteMode();
    this._renderFilter();
    this._renderTripList();
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
    this._siteSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilter() {
    render(filterControl, this._filterComponent, RenderPosition.AFTEREND);
  }

  _renderSiteMode() {
    render(switchControl, this._siteMenuComponent, RenderPosition.AFTEREND);
  }

  _renderEmptyList() {
    render(tripEvents, this._emptyList, RenderPosition.BEFOREEND);
  }

  _renderTripList() {
    if (this._points.length !== 0) {
      render(this._tripInfoContainer, this._infoSectionComponent, RenderPosition.AFTERBEGIN);
      this._renderTripInfo(this._points);

      this._renderSort();
      render(tripEvents, this._tripListContainer, RenderPosition.BEFOREEND);

      this._points.forEach((point) => {
        this._renderPoint(point);
      });
    } else {
      this._renderEmptyList();
    }
  }

  _renderPoint(point) {
    const tripPoint = new PointPresenter(this._tripListContainer, this._handlePointChange, this._handleModeChange);
    tripPoint.init(point);
    this._tripPoint[point.id] = tripPoint;
  }

  _clearPointList() {
    Object
      .values(this._tripPoint)
      .forEach((presenter) => presenter.destroy());
    this._tripPoint = {};
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPointList(sortType);
    this._clearPointList();
    this._renderTripList();

  }

  _handlePointChange(updatedPoint) {
    this._points = updatePoint(this._points, updatedPoint);
    this._tripPoint[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object
      .values(this._tripPoint)
      .forEach((presenter) => presenter.resetView());
  }

  _sortPointList(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._points.sort((a, b) => a.time.day - b.time.day);
        break;
      case SortType.EVENT:
        this._points.sort((a, b) => a.type - b.type);
        break;
      case SortType.TIME:
        this._points.sort((a, b) => a.startTime - b.startTime);
        break;
      case SortType.PRICE:
        this._points.sort((a, b) => a.price - b.price);
        break;
      case SortType.OFFER:
        this._points.sort((a, b) => a.extraOffers - b.extraOffers);
        break;
      default:
        this._points = this._sourcedPoitList.slice();
    }
    this._currentSortType = sortType;
  }
}
