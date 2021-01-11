import Abstract from "./abstract.js";
import dayjs from "dayjs";
import {getHumanizedDiff} from "../utils/common.js";

const calculateTripDuartion = (time) => {
  const {startFullDate, endFullDate} = time;
  return getHumanizedDiff(new Date(endFullDate) - new Date(startFullDate));
};

const defineShortDate = (time) => {
  const {startFullDate} = time;

  return dayjs(startFullDate).format(`MMM DD`);
};

const defineStartTime = (time) => {
  const {startFullDate} = time;

  return dayjs(startFullDate).format(`HH:mm`);
};

const defineEndTime = (time) => {
  const {endFullDate} = time;

  return dayjs(endFullDate).format(`HH:mm`);
};

const siteContentListItemTemplate = (point) => {
  const {time, price, isFavorite, type, city} = point;

  const duration = calculateTripDuartion(time);
  const shortDateFormat = defineShortDate(time);
  const startTime = defineStartTime(time);
  const endTime = defineEndTime(time);

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="2019-03-18">${shortDateFormat}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type.charAt(0).toUpperCase()}${type.slice(1)} ${city}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T10:30">${startTime}</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T11:00">${endTime}</time>
      </p>
      <p class="event__duration">${duration}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">

    </ul>
    <button class="event__favorite-btn ${isFavorite ? `event__favorite-btn--active` : ``}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class RoutePoint extends Abstract {
  constructor(point) {
    super();
    this._point = point;
    this._openFormClickHandler = this._openFormClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
  }

  getTemplate() {
    return siteContentListItemTemplate(this._point);
  }

  setOpenFormClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._openFormClickHandler);
  }

  removeOpenFormClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).removeEventListener(`click`, this._openFormClickHandler);
  }

  setFavoriteButtonClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteButtonClickHandler);
  }

  _openFormClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
