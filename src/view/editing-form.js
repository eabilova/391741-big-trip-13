import {EVENT_TYPES, OFFERS} from "../const.js";
import dayjs from "dayjs";
import SmartView from "./smart.js";
import {generateDescription, generatePhotoList} from "../utils/common.js";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";


const editingEventTypeFormTemplate = (currentType) => {
  return EVENT_TYPES.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase()}${type.slice(1)}</label>
  </div>`).join(``);
};

const addPhotos = (currentPhotos) => {
  return currentPhotos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``);
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

const identifySelectedOffers = (currentType, currentOffers) => {
  const selectedTypeOffer = OFFERS.find((offer) => offer.type === currentType);

  return Object.values(selectedTypeOffer.offers).map((offer) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${currentOffers.find((currentOffer) => currentOffer.id === offer.id) ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${offer.id}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join(``);
};

const BLANK_POINT = {
  type: `taxi`,
  city: ``,
  extraOffers: [],
  destinationDescription: ``,
  time: {
    startFullDate: dayjs(new Date()).format(`DD/MM/YY HH:MM`),
    endFullDate: dayjs(new Date()).format(`DD/MM/YY HH:MM`),
  },
  price: ` `,
};

const editingFormTemplate = (data) => {
  const {type, extraOffers, time, price, currentType, currentDestinationDescription, currentPhotos, currentCity} = data;
  const eventType = editingEventTypeFormTemplate(currentType);
  const checkOffers = identifySelectedOffers(currentType, extraOffers);
  const description = addDestinationDescription(currentDestinationDescription, currentPhotos);
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
        ${currentType}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentCity}" list="destination-list-1">
      <datalist id="destination-list-1">
        <option value="Amsterdam"></option>
        <option value="Geneva"></option>
        <option value="Chamonix"></option>
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${time.currentStartDate}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${time.currentEndDate}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
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
    this._data = EditingForm.parsePointToData(point);
    this._datepicker = null;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._tripStartDateChangeHandler = this._tripStartDateChangeHandler.bind(this);
    this._tripEndDateChangeHandler = this._tripEndDateChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  getTemplate() {
    return editingFormTemplate(this._data);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  removeEditClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).removeEventListener(`click`, this._editClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditingForm.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      currentType: evt.target.value,
      extraOffers: [],
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      currentCity: evt.target.value,
      currentDestinationDescription: generateDescription(),
      currentPhotos: generatePhotoList()
    });
  }

  _setDatePicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    if (this._data.time.currentStartDate) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`.event__input--time[name="event-start-time"]`),
          {
            dateFormat: `j/m/y H:i`,
            defaultDate: this._data.time.startFullDate,
            onChange: this._tripStartDateChangeHandler
          }
      );
    }
    if (this._data.time.currentEndDate) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`.event__input--time[name="event-end-time"]`),
          {
            dateFormat: `j/m/y H:i`,
            defaultDate: this._data.time.endFullDate,
            onChange: this._tripEndDateChangeHandler
          }
      );
    }
  }

  _tripStartDateChangeHandler([userDate]) {
    this._data.time = Object.assign({
      time: {
        ...this._data.time,
        startFullDate: dayjs(userDate).hour(23).minute(59).second(59).toDate(),
      }
      });
      this.updateData(this._data.time)
  };

  _tripEndDateChangeHandler([userDate]) {
    this._data.time = Object.assign({
      time: {
        ...this._data.time,
        endFullDate: dayjs(userDate).hour(23).minute(59).second(59).toDate(),
      }
      });
      this.updateData(this._data.time)
  };

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`change`, this._typeChangeHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  reset(point) {
    this.updateData(
        EditingForm.parsePointToData(point)
    );
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
          time: {
            ...point.time,
            currentStartDate: point.time.startFullDate,
            currentEndDate: point.time.endFullDate
          }
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    if (!data.currentType) {
      data.type = `taxi`;
    }

    if (!data.currentDestinationDescription) {
      data.destinationDescription = ``;
    }

    if (!data.currentPhotos) {
      data.photoLinks = [];
    }

    delete data.currentType;
    delete data.currentDestinationDescription;
    delete data.currentPhotos;

    return data;
  }
}
