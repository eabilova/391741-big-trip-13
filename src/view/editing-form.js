import {EVENT_TYPES, OFFERS, PHOTO_NUMBER} from "../const.js";
import {getRandomInteger} from "../utils/common.js";
import dayjs from "dayjs";
import Abstract from "./abstract.js";

const editingEventTypeFormTemplate = (currentType) => {
  return EVENT_TYPES.map((type)=> `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase()}${type.slice(1)}</label>
  </div>`).join(``);
};

const addPhotos = (point) => {
  let {photosAmount} = point;
  const photos = [];
  while (photosAmount) {
    let randomNumber = getRandomInteger(PHOTO_NUMBER.min, PHOTO_NUMBER.max);
    photos[photosAmount] = `<img class="event__photo" src="http://picsum.photos/248/152?r=${randomNumber}.jpg" alt="Event photo">`;
    photosAmount--;
  }

  return photos.join(``);
};

const identifySelectedOffers = (currentOffers) => {
  return OFFERS.map((offer) => `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${currentOffers.find((currentOffer) => currentOffer.id === offer.id) ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${offer.id}-1">
            <span class="event__offer-title">${offer.offerName}</span>
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

const editingFormTemplate = (point = {}) => {
  const {type, extraOffers, city, time, price, destinationDescription} = point;
  const eventType = editingEventTypeFormTemplate(type);
  const checkOffers = identifySelectedOffers(extraOffers);
  const photos = addPhotos(point);

  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
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
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
      <datalist id="destination-list-1">
        <option value="Amsterdam"></option>
        <option value="Geneva"></option>
        <option value="Chamonix"></option>
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${time.startFullDate}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${time.endFullDate}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${checkOffers}
      </div>
    </section>
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationDescription}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photos}
        </div>
      </div>
    </section>
  </section>
</form>`;
};

export default class EditingForm extends Abstract {
  constructor(point = BLANK_POINT) {
    super();
    this._point = point;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
  }

  getTemplate() {
    return editingFormTemplate(this._point);
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
    this._callback.formSubmit(this._point);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }
}
