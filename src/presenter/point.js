﻿import EditTripForm from "../view/editing-form.js";
import TripPoint from "../view/trip-point.js";
import EventOffer from "../view/event-offer";
import {render, RenderPosition, replace, remove} from "../utils/render";
import TripDates from "../view/trip-dates.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._tripPoint = null;
    this._editTripPoint = null;
    this._mode = Mode.DEFAULT;

    this._handleOpenEditFormClick = this._handleOpenEditFormClick.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
    this._handleExitEditModeClick = this._handleExitEditModeClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._tripPoint;
    const prevPointEditComponent = this._editTripPoint;

    this._tripPoint = new TripPoint(point);
    this._editTripPoint = new EditTripForm(point);

    this._renderOffers(point, this._pointIndex);

    this._tripPoint.setOpenFormClickHandler(this._handleOpenEditFormClick);
    this._tripPoint.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointContainer, this._tripPoint, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripPoint, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editTripPoint, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._tripPoint);
    remove(this._editTripPoint);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _renderOffers(point) {
    const offerContainer = this._tripPoint.getElement().querySelector(`.event__selected-offers`);
    const {extraOffers} = point;
    extraOffers.forEach((offer) => {
      const eventOfferComponent = new EventOffer(offer);
      render(offerContainer, eventOfferComponent, RenderPosition.BEFOREEND);
    });
  }

  _renderDatesEditMode(editTripPoint) {
    this._tripDatesContainer = editTripPoint.getElement().querySelector(`.event__field-group--destination`);
    this._tripDatesEditMode = new TripDates(editTripPoint._data);
    render(this._tripDatesContainer, this._tripDatesEditMode, RenderPosition.AFTEREND);
  }

  _replacePointToForm() {
    this._tripPoint.removeOpenFormClickHandler(this._handleOpenEditFormClick);
    replace(this._editTripPoint, this._tripPoint);
    this._renderDatesEditMode(this._editTripPoint);
    this._editTripPoint.setFormSubmitHandler(this._handleFormSubmit);
    this._editTripPoint.setExitEditModeClickHandler(this._handleExitEditModeClick);
    this._editTripPoint.setDeleteClickHandler(this._handleDeleteClick);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    this._editTripPoint.removeEditClickHandler(this._handleExitEditModeClick);
    this._dateContainers = this._editTripPoint.getElement().querySelector(`.event__field-group--time`);
    this._dateContainers.remove();
    replace(this._tripPoint, this._editTripPoint);
    this._tripPoint.setOpenFormClickHandler(this._handleOpenEditFormClick);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._editTripPoint.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  _handleFormSubmit(point) {
    this._replaceFormToPoint();
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleExitEditModeClick() {
    this._replaceFormToPoint();
  }

  _handleFavoriteButtonClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }

  _handleOpenEditFormClick() {
    this._replacePointToForm();
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }
}
