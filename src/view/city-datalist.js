import Abstract from "./abstract.js";

const createDataList = (cities) => {
  return cities.map((city) => `<option value="${city}"></option>`).join(``);
}

const createCityListTemplate = (points) => {
  let cities = [];
  points.forEach((point) => cities.push(point.city));
  const dataList = createDataList(cities);
  return `<datalist id="destination-list-1">
  ${dataList}
  </datalist>`.join(``);
};

export default class CityList extends Abstract {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createCityListTemplate(this._points);
  }
}
