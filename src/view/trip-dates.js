import Abstract from "./abstract.js";
import dayjs from "dayjs";
import flatpickr from "flatpickr";
import SmartView from "./smart.js";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const TripDatesTemplate = (data) => {
  const {time} = data;
  return `<label class="visually-hidden" for="event-start-time-1">From</label>
  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${time.currentStartDate}">
  &mdash;
  <label class="visually-hidden" for="event-end-time-1">To</label>
  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${time.currentEndDate}">`;
};

export default class TripDates extends SmartView {
  constructor(point) {
    super();
    console.log(point);
    this._data = TripDates.parsePointToData(point);
    this._datepicker = null;

    this._tripStartDateChangeHandler = this._tripStartDateChangeHandler.bind(this);
    this._tripEndDateChangeHandler = this._tripEndDateChangeHandler.bind(this);
    this._setDatePicker();
  }

  getTemplate() {
    return TripDatesTemplate(this._data)
  }

  _setDatePicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    if (this._data.time.currentStartDate) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`.event__input--time[name="event-start-time"]`),
          {
            dateFormat: `j/m/y H:i`,
            defaultDate: this._data.time.startFullDate,
            onChange: this._tripStartDateChangeHandler
          }
      );
    }
    if (this._data.time.currentEndDate) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`.event__input--time[name="event-end-time"]`),
          {
            dateFormat: `j/m/y H:i`,
            defaultDate: this._data.time.endFullDate,
            onChange: this._tripEndDateChangeHandler
          }
      );
    }
  }

  _tripStartDateChangeHandler([userDate]) {
    this._data.time = Object.assign(this._data.time, {
      startFullDate: dayjs(userDate).hour(23).minute(59).second(59).toDate().format(`DD/MM/YY HH:MM`),
    });
      this.updateData(this._data)
  };

  _tripEndDateChangeHandler([userDate]) {
    this._data.time = Object.assign(this._data.time, {
      endFullDate: dayjs(userDate).hour(23).minute(59).second(59).toDate().format(`DD/MM/YY HH:MM`),
    });
      this.updateData(this._data)
  };

  restoreHandlers() {
    this._setDatePicker();
  }

  reset(point) {
    this.updateData(
        EditingForm.parsePointToData(point)
    );
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          time: {
            ...point.time,
            currentStartDate: point.time.startFullDate,
            currentEndDate: point.time.endFullDate
          }
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.currentStartDate;
    delete data.currentEndDate;

    return data;
  }
}
