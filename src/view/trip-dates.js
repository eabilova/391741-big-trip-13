import dayjs from "dayjs";
import flatpickr from "flatpickr";
import Smart from "./smart.js";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const tripDatesTemplate = (data) => {
  const {time} = data;
  return `<div class="event__field-group  event__field-group--time">
  <label class="visually-hidden" for="event-start-time-1">From</label>
  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${time.currentStartDate}">
  &mdash;
  <label class="visually-hidden" for="event-end-time-1">To</label>
  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${time.currentEndDate}">
  </div>`;
};

export default class TripDates extends Smart {
  constructor(point) {
    super();
    this._data = point;
    this._datepicker = null;

    this._tripStartDateChangeHandler = this._tripStartDateChangeHandler.bind(this);
    this._tripEndDateChangeHandler = this._tripEndDateChangeHandler.bind(this);
    this._setDatePicker();
  }

  getTemplate() {
    return tripDatesTemplate(this._data);
  }

  restoreHandlers() {
    this._setDatePicker();
  }

  destroyFlatpickr() {
    this._datepicker.destroy();
  }

  reset(point) {
    this.updateData(TripDates.parsePointToData(point)
    );
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
            dateFormat: `j/m/Y H:i`,
            defaultDate: this._data.time.currentStartDate,
            onChange: this._tripStartDateChangeHandler
          }
      );
    }
    if (this._data.time.currentEndDate) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`.event__input--time[name="event-end-time"]`),
          {
            dateFormat: `j/m/Y H:i`,
            defaultDate: this._data.time.currentEndDate,
            onChange: this._tripEndDateChangeHandler
          }
      );
    }
  }

  _tripStartDateChangeHandler([userDate]) {
    this._data.time = Object.assign(this._data.time, {
      currentStartDate: dayjs(userDate).hour(23).minute(59).second(59).toISOString(),
    });
    this.updateData(this._data);
  }

  _tripEndDateChangeHandler([userDate]) {
    this._data.time = Object.assign(this._data.time, {
      currentEndDate: dayjs(userDate).hour(23).minute(59).second(59).toISOString(),
    });
    this.updateData(this._data);
  }
}
