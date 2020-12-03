import {createElement} from "../utils/render.js";

export const createEventOffer = (offer) => {
  const {offerName, price} = offer;
  return `<li class="event__offer">
        <span class="event__offer-title">${offerName}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`;
};


export default class EventOffer {
  constructor(offer) {
    this._offer = offer;
    this._element = null;
  }

  getTemplate() {
    return createEventOffer(this._offer);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
