import Abstract from "./abstract.js";

const tripInfoSectionTemplate = () => {
  return `<section class="trip-main__trip-info  trip-info">
  </section>`;
};

export default class InfoSection extends Abstract {
  getTemplate() {
    return tripInfoSectionTemplate();
  }
}
