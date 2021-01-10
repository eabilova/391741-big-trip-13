import InfoSection from "../view/trip-info-section.js";
import TripInfo from "../view/trip-route.js";
import TripCost from "../view/trip-cost.js";
import SiteMenu from "../view/site-menu.js";
import SiteFilter from "../view/site-filter.js";
import SiteSorting from "../view/sorting.js";
import PointPresenter from "./point.js";
import EmptyList from "../view/no-points";
import TripList from "../view/content-list.js";
import {switchControl, filterControl, tripEvents} from "../main.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {SortType, UpdateType, UserAction, FilterType} from "../const.js";

export default class Trip {
  constructor(tripInfoContainer, pointsModel, filterModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._tripPoint = {};
    this._currentSortType = SortType.DAY;
    this._currentFilterType = FilterType.EVERYTHING;

    this._siteSortingComponent = null;

    this._infoSectionComponent = new InfoSection();
    this._siteMenuComponent = new SiteMenu();
    this._tripListContainer = new TripList();
    this._emptyList = new EmptyList();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderSiteMode();
    this._renderInfoSection();
    this._renderTripList();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.DAY:
        this._pointsModel.getPoints().sort((a, b) => new Date(a.time.day) - new Date(b.time.day));
        break;
      case SortType.EVENT:
        this._pointsModel.getPoints().sort((a, b) => a.type - b.type);
        break;
      case SortType.TIME:
        this._pointsModel.getPoints().sort((a, b) => a.time.startTime.localeCompare(b.time.startTime));
        break;
      case SortType.PRICE:
        this._pointsModel.getPoints().sort((a, b) => a.price - b.price);
        break;
      case SortType.OFFER:
        this._pointsModel.getPoints().sort((a, b) => a.extraOffers - b.extraOffers);
        break;
    }
    return this._pointsModel.getPoints();
  }

  _getFilter() {
    let filteredPoints;
    switch (this._currentFilterType) {
      case FilterType.EVERYTHING:
        filteredPoints = this._pointsModel.getPoints();
        break;
      case FilterType.FUTURE:
        filteredPoints = this._pointsModel.getPoints().slice().filter((point) => Date.parse(point.time.startFullDate) >= new Date());
        break;
      case FilterType.PAST:
        filteredPoints = this._pointsModel.getPoints().slice().filter((point) => Date.parse(point.time.startFullDate) < new Date());
        break;
    }
    return filteredPoints;
  }

  _renderTripInfo(points) {
    if (points.length !== 0) {
      this._tripInfoComponent = new TripInfo(points);
      this._tripCostComponent = new TripCost(points);
      render(this._infoSectionComponent, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      render(this._infoSectionComponent, this._tripCostComponent, RenderPosition.BEFOREEND);
    }
  }

  _renderSort() {
    if (this._siteSortingComponent !== null) {
      this._siteSortingComponent = null;
    }

    this._siteSortingComponent = new SiteSorting(this._currentSortType);
    this._siteSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(tripEvents, this._siteSortingComponent, RenderPosition.BEFOREEND);
  }

  _renderFilter() {
    if (this._filterComponent !== null) {
      this._filterComponent = null;
    }

    this._filterComponent = new SiteFilter(this._currentFilterType);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    render(filterControl, this._filterComponent, RenderPosition.AFTEREND);
  }

  _renderSiteMode() {
    render(switchControl, this._siteMenuComponent, RenderPosition.AFTEREND);
  }

  _renderEmptyList() {
    render(tripEvents, this._emptyList, RenderPosition.BEFOREEND);
  }

  _renderInfoSection() {
    const points = this._getPoints();
    if (points.length > 0) {
      render(this._tripInfoContainer, this._infoSectionComponent, RenderPosition.AFTERBEGIN);
      this._renderTripInfo(points);
    }
  }

  _renderTripList() {
    const points = this._getFilter();
    this._renderFilter();
    if (points.length === 0) {
      this._renderEmptyList();
      return;
    }
    this._renderSort();
    render(tripEvents, this._tripListContainer, RenderPosition.BEFOREEND);
    points.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderPoint(point) {
    const tripPoint = new PointPresenter(this._tripListContainer, this._handleViewAction, this._handleModeChange);
    tripPoint.init(point);
    this._tripPoint[point.id] = tripPoint;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    remove(this._siteSortingComponent);
    this._clearBoard({resetSortType: true});
    this._renderTripList();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilterType === filterType) {
      return;
    }
    this._currentFilterType = filterType;
    remove(this._filterComponent);
    this._clearBoard();
    this._renderTripList();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._tripPoint[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderTripList();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderTripList();
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._tripPoint)
      .forEach((presenter) => presenter.resetView());
  }

  _clearBoard({resetSortType = false} = {}) {

    Object
      .values(this._tripPoint)
      .forEach((presenter) => presenter.destroy());
    this._tripPoint = {};

    remove(this._siteSortingComponent);
    remove(this._filterComponent);
    remove(this._emptyList);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }

    // if (resetFilterType) {
    //   this._currentFilterType = FilterType.EVERYTHING;
    // }
  }
}
