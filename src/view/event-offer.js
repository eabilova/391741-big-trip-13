export const createEventOffer = (offer) => {
  const {offerName, price} = offer;
  return `<li class="event__offer">
        <span class="event__offer-title">${offerName}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`;
};
