import Abstract from "./abstract.js";

const createSiteContentListTemplate = () => {
  return `<ul class="trip-events__list">
</ul>`;
};

export default class RouteList extends Abstract {
  getTemplate() {
    return createSiteContentListTemplate();
  }
}
