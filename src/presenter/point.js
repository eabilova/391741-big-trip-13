import EditTripForm from "../view/editing-form.js";
import TripPoint from "../view/trip-point.js";
import EventOffer from "../view/event-offer";
import {render, RenderPosition, replace, remove} from "../utils/render";
import TripDates from "../view/trip-dates.js";

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

    this._clickHandler = this._clickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._tripPoint;
    const prevPointEditComponent = this._editTripPoint;

    this._tripPoint = new TripPoint(point);
    this._editTripPoint = new EditTripForm(point);

    this._renderOffers(point, this._pointIndex);

    this._tripPoint.setClickHandler(this._clickHandler);
    this._tripPoint.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);

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
    this._tripDatesContainer = editTripPoint.getElement().querySelector(`.event__field-group--time`);
    this._tripDatesEditMode = new TripDates(editTripPoint._data);
    render(this._tripDatesContainer, this._tripDatesEditMode, RenderPosition.BEFOREEND);
  }

  _replacePointToForm() {
    replace(this._editTripPoint, this._tripPoint);
    this._renderDatesEditMode(this._editTripPoint);
    this._editTripPoint.setFormSubmitHandler(this._formSubmitHandler);
    this._editTripPoint.setEditClickHandler(this._editClickHandler);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    this._editTripPoint.removeEditClickHandler(this._editClickHandler);
    replace(this._tripPoint, this._editTripPoint);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._editTripPoint.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  _formSubmitHandler(point) {
    this._replaceFormToPoint();
    this._changeData(point);
  }

  _editClickHandler() {
    this._replaceFormToPoint();
  }

  _favoriteButtonClickHandler() {
    this._changeData(
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }

  _clickHandler() {
    this._replacePointToForm();
  }
}
