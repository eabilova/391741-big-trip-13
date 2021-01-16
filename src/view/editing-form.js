import {EVENT_TYPES} from "../const.js";
import {offerList, destinationList} from "../main.js";
import dayjs from "dayjs";
import he from "he";
import SmartView from "./smart.js";
import TripDates from "../view/trip-dates.js";
import {generateDescription, generatePhotoList, generateId} from "../utils/common.js";
import {render, RenderPosition} from "../utils/render.js";

const editingEventTypeFormTemplate = (currentType, isDisabled) => {
  return EVENT_TYPES.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase()}${type.slice(1)}</label>
  </div>`).join(``);
};

const addPhotos = (currentPhotos) => {
  return currentPhotos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join(``);
};

const addDestinationDescription = (currentDestinationDescription, currentPhotos) => {
  const photos = addPhotos(currentPhotos);
  let description;

  if (currentDestinationDescription.length > 0 || currentPhotos.length > 0) {
    description = `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${currentDestinationDescription}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${currentPhotos.length > 0 ? photos : ``}
      </div>
    </div>`;
  }
  return description;
};

const identifySelectedOffers = (currentType, currentOffers, isDisabled) => {
  const selectedTypeOffer = offerList.find((offer) => offer.type === currentType);
  const selectedType = selectedTypeOffer.type;
  const selectedOffers = selectedTypeOffer.offers;

  return selectedOffers.map((offer, index) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${selectedType}-${index}" type="checkbox" value="${offer.title}" name="event-offer-${selectedType}-${index}" ${currentOffers.find((currentOffer) => currentOffer.title === offer.title) ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
      <label class="event__offer-label" for="event-offer-${selectedType}-${index}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join(``);
};

const generateDataList = () => {
  return destinationList.map((destination) => `<option value="${destination.name}"></option>`).join(``);
};

const BLANK_POINT = {
  id: generateId(),
  type: `taxi`,
  city: ``,
  extraOffers: [],
  destinationDescription: ``,
  photoLinks: [],
  time: {
    startFullDate: dayjs(new Date()).toISOString(),
    endFullDate: dayjs(new Date()).toISOString(),
  },
  price: 0,
};

const editingFormTemplate = (data) => {
  const {type, currentType, currentDestinationDescription, currentPhotos, currentCity, currentPrice, currentOffers, isDisabled, isSaving, isDeleting} = data;
  const eventType = editingEventTypeFormTemplate(currentType, isDisabled);
  const checkOffers = identifySelectedOffers(currentType, currentOffers, isDisabled);
  const description = addDestinationDescription(currentDestinationDescription, currentPhotos);
  const datalist = generateDataList();
  const isSubmitDisabled = currentType && !type;

  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
        ${eventType}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${he.encode(currentType)}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentCity}" list="destination-list-1" ${isDisabled ? `disabled` : ``}>
      <datalist id="destination-list-1">
      ${datalist}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${currentPrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? `disabled` : ``}>Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
    ${checkOffers ? `<h3 class="event__section-title  event__section-title--offers">Offers</h3>` : ``}
      <div class="event__available-offers">
      ${checkOffers}
      </div>
    </section>
    <section class="event__section  event__section--destination">
    ${description ? description : ``}
    </section>
  </section>
</form>`;
};

export default class EditingForm extends SmartView {
  constructor(point = BLANK_POINT) {
    super();

    this._selectedOffers = [];
    this._data = EditingForm.parsePointToData(point);
    this._exitEditModeClickHandler = this._exitEditModeClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offerSelectionHandler = this._offerSelectionHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return editingFormTemplate(this._data);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  setExitEditModeClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._exitEditModeClickHandler);
  }

  removeEditClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).removeEventListener(`click`, this._exitEditModeClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  renderDatesEditMode() {
    this._tripDatesContainer = this.getElement().querySelector(`.event__field-group--destination`);
    this._tripDatesEditMode = new TripDates(this._data);
    render(this._tripDatesContainer, this._tripDatesEditMode, RenderPosition.AFTEREND);
  }

  reset(point) {
    this.updateData(EditingForm.parsePointToData(point));
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setExitEditModeClickHandler(this._callback.editClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _exitEditModeClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditingForm.parseDataToPoint(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditingForm.parseDataToPoint(this._data));
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      currentType: evt.target.value,
      currentOffers: [],
    });
    this.renderDatesEditMode();
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      currentCity: evt.target.value,
      currentDestinationDescription: generateDescription(),
      currentPhotos: generatePhotoList()
    });
    this.renderDatesEditMode();
  }

  _priceChangeHandler(evt) {
    const validNumber = new RegExp(/^[0-9]+$/);
    if (evt.target.value.match(validNumber)) {
      this.updateData({
        currentPrice: evt.target.value,
      });
      this.renderDatesEditMode();
    } else {
      evt.preventDefault();
    }
  }

  _offerSelectionHandler(evt) {
    evt.preventDefault();
    this._selectedOffers = this._data.currentOffers;

    const type = this._data.currentType;
    const data = offerList.find((offer) => offer.type === type);
    const index = this._selectedOffers.indexOf(data.offers[evt.target.value]);
    if (index > -1) {
      this._selectedOffers.splice(index, 1);
    } else {
      let selectedOffer;
      offerList.forEach((pointOffer) => {
        pointOffer.offers.forEach((offer) => {
          if (offer.title === evt.target.value) {
            selectedOffer = offer;
          }
        })
      });
      this._selectedOffers.push(selectedOffer);
    }
    this.updateData({
      currentOffers: this._selectedOffers
    });
    this.renderDatesEditMode();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`change`, this._typeChangeHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);
    this.getElement()
    .querySelector(`.event__input--price`)
    .addEventListener(`change`, this._priceChangeHandler);
    this.getElement()
    .querySelector(`.event__available-offers`)
    .addEventListener(`change`, this._offerSelectionHandler);
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          currentType: point.type,
          currentCity: point.city,
          currentDestinationDescription: point.destinationDescription,
          currentPhotos: point.photoLinks,
          currentPrice: point.price,
          currentOffers: point.extraOffers,
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    data.type = data.currentType ? data.currentType : `taxi`;
    data.destinationDescription = data.currentDestinationDescription ? data.currentDestinationDescription : ``;
    data.photoLinks = data.currentPhotos ? data.currentPhotos : [];
    data.city = data.currentCity ? data.currentCity : ``;
    data.price = data.currentPrice ? data.currentPrice : 0;
    data.extraOffers = data.currentOffers ? data.currentOffers : [];

    delete data.currentType;
    delete data.currentDestinationDescription;
    delete data.currentPhotos;
    delete data.currentCity;
    delete data.currentPrice;
    delete data.currentOffers;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
