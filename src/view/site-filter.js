import Abstract from "./abstract.js";

const createFilterItem = (filter, currentFilterType) => {
  const {type, name} = filter;
  return `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${type === currentFilterType ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${name}">${name.charAt(0).toUpperCase()}${name.slice(1)}</label>
  </div>`;
};

const siteFilterTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters
  .map((filter) => createFilterItem(filter, currentFilterType))
  .join(``);

  return `<form class="trip-filters" action="#" method="get">
  ${filterItemsTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
};

export default class SiteFilter extends Abstract {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return siteFilterTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
