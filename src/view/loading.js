import AbstractView from "./abstract.js";

const createNoPointTemplate = () => {
  return `<p class="board__no-points">
    Loading...
  </p>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoPointTemplate();
  }
}
