import Abstract from "./abstract.js";
import {MenuItem} from "../const.js";

const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-value="${MenuItem.TABLE}">Table</a>
  <a class="trip-tabs__btn" href="#" data-value="${MenuItem.STATISTICS}">Stats</a>
</nav>`;
};

export default class SiteMenu extends Abstract {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  activateTable() {
    this.getElement().querySelector(`[data-value=${MenuItem.TABLE}]`).classList.add(`trip-tabs__btn--active`);
  }

  activateStat() {
    this.getElement().querySelector(`[data-value=${MenuItem.STATISTICS}]`).classList.add(`trip-tabs__btn--active`);
  }

  deactivateTable() {
    this.getElement().querySelector(`[data-value=${MenuItem.TABLE}]`).classList.remove(`trip-tabs__btn--active`);
  }

  deactivateStat() {
    this.getElement().querySelector(`[data-value=${MenuItem.STATISTICS}]`).classList.remove(`trip-tabs__btn--active`);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-value=${menuItem}]`);

    if (item) {
      item.classList.add(`trip-tabs__btn--active`);
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.value);
  }
}
