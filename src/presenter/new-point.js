import EditTripForm from "../view/editing-form.js";
import {generateId} from "../utils/common.js";
import TripDates from "../view/trip-dates.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

export default class NewPoint {
  constructor(PointListContainer, changeData) {
    this._pointListContainer = PointListContainer;
    this._changeData = changeData;

    this._editPointComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._editPointComponent !== null) {
      return;
    }

    this._editPointComponent = new EditTripForm();
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._editPointComponent, RenderPosition.AFTERBEGIN);
    this._editPointComponent.renderDatesEditMode();

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._editPointComponent === null) {
      return;
    }

    remove(this._editPointComponent);
    this._editPointComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _renderDatesEditMode() {
    this._tripDatesContainer = this._editPointComponent.getElement().querySelector(`.event__field-group--destination`);
    this._tripDatesEditMode = new TripDates();
    render(this._tripDatesContainer, this._tripDatesEditMode, RenderPosition.AFTEREND);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: generateId()}, point)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
