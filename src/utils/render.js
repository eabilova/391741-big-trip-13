export const render = (container, template, place) => {
  container.insertAdjacentElement(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getRandomInteger = (min = 0, max = 1) => {
  const minCeiling = Math.ceil(Math.min(min, max));
  const maxFlooring = Math.floor(Math.max(min, max));

  return Math.floor(minCeiling + Math.random() * (maxFlooring - minCeiling + 1));
};
