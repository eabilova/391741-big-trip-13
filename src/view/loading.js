import Abstract from "./abstract.js";

const createNoPointTemplate = () => {
  return `<p class="trip-events__msg">Loading...</p>`;
};

export default class Loading extends Abstract {
  getTemplate() {
    return createNoPointTemplate();
  }
}
