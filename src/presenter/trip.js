import InfoSection from "../view/trip-info-section.js";
import TripInfo from "../view/trip-route.js";
import TripCost from "../view/trip-cost.js";
import LoadingView from "../view/loading.js";
import SiteSorting from "../view/sorting.js";
import PointPresenter, {State as PointPresenterViewState} from "./point.js";
import EmptyList from "../view/no-points";
import TripList from "../view/content-list.js";
import NewPointPresenter from "./new-point.js";
import {filter} from "../utils/filter.js";
import {tripEvents} from "../main.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {SortType, UpdateType, UserAction, FilterType} from "../const.js";
import {getPointsDuration} from "../utils/common.js";

export default class Trip {
  constructor(tripInfoContainer, pointsModel, filterModel, api) {
    this._tripInfoContainer = tripInfoContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._tripPoint = {};
    this._currentSortType = SortType.DAY;
    this._isLoading = true;
    this._api = api;

    this._siteSortingComponent = null;
    this._tripInfoComponent = null;
    this._tripCostComponent = null;

    this._infoSectionComponent = new InfoSection();
    this._tripListContainer = new TripList();
    this._emptyList = new EmptyList();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._newPointPresenter = new NewPointPresenter(this._tripListContainer, this._handleViewAction);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTripList();
  }

  destroy() {
    this._clearTripList({resetSortType: true});

    remove(this._tripListContainer);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointPresenter.init(callback);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filtredPoints.sort((a, b) => new Date(a.time.startFullDate) - new Date(b.time.startFullDate));
      case SortType.EVENT:
        return filtredPoints.sort((a, b) => a.type - b.type);
      case SortType.TIME:
        return filtredPoints.sort((a, b) => getPointsDuration(a) - getPointsDuration(b));
      case SortType.PRICE:
        return filtredPoints.sort((a, b) => a.price - b.price);
      case SortType.OFFER:
        return filtredPoints.sort((a, b) => a.extraOffers - b.extraOffers);
    }
    return filtredPoints;
  }

  _renderTripInfo(points) {
    const sortedByDatePoints = points.slice().sort((a, b) => new Date(a.time.startFullDate) - new Date(b.time.startFullDate));
    if (this._tripInfoComponent) {
      remove(this._tripInfoComponent);
    }

    if (this._tripCostComponent) {
      remove(this._tripCostComponent);
    }

    this._tripInfoComponent = new TripInfo(sortedByDatePoints);
    this._tripCostComponent = new TripCost(points);
    render(this._infoSectionComponent, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._infoSectionComponent, this._tripCostComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._siteSortingComponent) {
      remove(this._siteSortingComponent);
    }

    this._siteSortingComponent = new SiteSorting(this._currentSortType);
    this._siteSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(tripEvents, this._siteSortingComponent, RenderPosition.BEFOREEND);
  }

  _renderEmptyList() {
    render(tripEvents, this._emptyList, RenderPosition.BEFOREEND);
  }

  _renderInfoSection(points) {
    render(this._tripInfoContainer, this._infoSectionComponent, RenderPosition.AFTERBEGIN);
    this._renderTripInfo(points);
  }

  _renderTripList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();

    if (points.length === 0) {
      this._renderEmptyList();
      return;
    }
    this._renderInfoSection(points);
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

  _renderLoading() {
    render(tripEvents, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearTripList();
    this._renderTripList();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._tripPoint[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
        .then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
        .catch(() => {
          this._tripPoint[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_POINT:
        this._newPointPresenter.setSaving();
        this._api.addPoint(update)
        .then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
        .catch(() => {
          this._newPointPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_POINT:
        this._tripPoint[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
        .then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
        .catch(() => {
          this._tripPoint[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._tripPoint[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTripList();
        this._renderTripList();
        break;
      case UpdateType.MAJOR:
        this._clearTripList({resetSortType: true});
        this._renderTripList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTripList();
        break;
    }
  }

  _handleModeChange() {
    this._newPointPresenter.destroy();
    Object
      .values(this._tripPoint)
      .forEach((presenter) => presenter.resetView());
  }

  _clearTripList({resetSortType = false} = {}) {
    if (this._newPointPresenter) {
      this._newPointPresenter.destroy();
    }

    Object
      .values(this._tripPoint)
      .forEach((presenter) => presenter.destroy());
    this._tripPoint = {};

    remove(this._siteSortingComponent);
    remove(this._loadingComponent);
    remove(this._emptyList);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }
}
