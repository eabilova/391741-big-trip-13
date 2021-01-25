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
    this._startDatepicker = null;
    this._endDatepicker = null;

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
    this._startDatepicker.destroy();
    this._endDatepicker.destroy();
  }

  reset(point) {
    this.updateData(TripDates.parsePointToData(point)
    );
  }

  _setDatePicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    if (this._data.time.currentStartDate) {
      this._startDatepicker = flatpickr(
          this.getElement().querySelector(`.event__input--time[name="event-start-time"]`),
          {
            dateFormat: `j/m/Y H:i`,
            defaultDate: new Date(this._data.time.currentStartDate) < new Date(this._data.time.currentEndDate) ? this._data.time.currentStartDate: this._data.time.currentEndDate,
            onChange: this._tripStartDateChangeHandler
          }
      );
    }
    if (this._data.time.currentEndDate) {
      this._endDatepicker = flatpickr(
          this.getElement().querySelector(`.event__input--time[name="event-end-time"]`),
          {
            dateFormat: `j/m/Y H:i`,
            defaultDate: new Date(this._data.time.currentEndDate) > new Date(this._data.time.currentStartDate) ? this._data.time.currentEndDate : this._data.time.currentStartDate,
            onChange: this._tripEndDateChangeHandler
          }
      );
    }
  }

  _tripStartDateChangeHandler([userDate]) {
    const startDate = new Date([userDate]) < new Date(this._endDatepicker.config.defaultDate) ? userDate : this._endDatepicker.config.defaultDate;
    this._data.time = Object.assign(this._data.time, {
      currentStartDate: dayjs(startDate).hour(23).minute(59).second(59).toISOString(),
    });
    this.updateData(this._data);
  }

  _tripEndDateChangeHandler([userDate]) {
    const endDate = new Date(userDate) > new Date(this._startDatepicker.config.defaultDate) ? userDate : this._startDatepicker.config.defaultDate;
    this._data.time = Object.assign(this._data.time, {
      currentEndDate: dayjs(endDate).hour(23).minute(59).second(59).toISOString(),
    });
    this.updateData(this._data);
  }
}
