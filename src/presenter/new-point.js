import EditTripForm from "../view/editing-form.js";
import {remove, render, Position} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";
import {newEventButton, renderNewPointForm} from "../main.js";

export default class NewPoint {
  constructor(PointListContainer, changeData) {
    this._pointListContainer = PointListContainer;
    this._changeData = changeData;

    this._editPointComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCloseFormClick = this._handleCloseFormClick.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;
    if (this._editPointComponent) {
      return;
    }

    this._editPointComponent = new EditTripForm();
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._editPointComponent.setExitEditModeClickHandler(this._handleCloseFormClick);
    this._editPointComponent.updateData({
      isNew: true
    });
    render(this._pointListContainer, this._editPointComponent, Position.AFTERBEGIN);
    this._editPointComponent.renderDatesEditMode();

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._editPointComponent === null) {
      return;
    }

    if (this._destroyCallback) {
      this._destroyCallback();
    }

    remove(this._editPointComponent);
    this._editPointComponent.removeFlatpickr();
    this._editPointComponent = null;
    newEventButton.disabled = false;
    newEventButton.addEventListener(`click`, renderNewPointForm);

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._editPointComponent.updateData({
      isDisabled: true,
      isSaving: true,
      isNew: false
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._editPointComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
        isNew: false
      });
    };

    this._editPointComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    if (!point.time.currentStartDate || !point.time.currentEndDate) {
      point.time = Object.assign(point.time, {
        currentStartDate: point.time.startFullDate,
        currentEndDate: point.time.endFullDate,
      });
    }
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleCloseFormClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
