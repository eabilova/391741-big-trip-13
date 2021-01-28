import {BAR_HEIGHT, StatTitle, StatFormat} from "../const.js";
import Smart from "./smart.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {makeItemsUniq, getTotalPriceByTypes, getTotalCountByTypes, getTotalDurationCountByTypes} from "../utils/statistics.js";

const renderStatisticsTemplate = (ctx, uniqueTypeList, dataValues, title, format) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueTypeList,
      datasets: [{
        data: dataValues,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: format
        }
      },
      title: {
        display: true,
        text: title,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderPriceChart = (moneyCtx, uniqueTypeList, points) => {
  const priceTotalByTypes = getTotalPriceByTypes(points, uniqueTypeList);
  renderStatisticsTemplate(moneyCtx, uniqueTypeList, priceTotalByTypes, StatTitle.MONEY, StatFormat.MONEY);
};

const renderTransportChart = (typeCtx, uniqueTypeList, points) => {
  const transportTotalCountByTypes = getTotalCountByTypes(points, uniqueTypeList);
  renderStatisticsTemplate(typeCtx, uniqueTypeList, transportTotalCountByTypes, StatTitle.TYPE, StatFormat.TYPE);
};

const renderTimeSpentChart = (timeCtx, uniqueTypeList, points) => {
  const durationTotalCountByType = getTotalDurationCountByTypes(points, uniqueTypeList);
  renderStatisticsTemplate(timeCtx, uniqueTypeList, durationTotalCountByType, StatTitle.TIME, StatFormat.TIME);
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item statistics__item--money">
    <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--transport">
    <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--time-spend">
    <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
  </div>
</section>`;
};

export default class Statistics extends Smart {
  constructor(points) {
    super();

    this._data = points;

    this._priceChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this._priceChart || this._transportChart || this._timeChart) {
      this._priceChart = null;
      this._transportChart = null;
      this._timeChart = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._priceChart || this._transportChart || this._timeChart) {
      this._priceChart = null;
      this._transportChart = null;
      this._timeChart = null;
    }

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);


    const typeList = this._data.map((point) => point.type.toUpperCase());
    const uniqueTypeList = makeItemsUniq(typeList);

    moneyCtx.height = BAR_HEIGHT * uniqueTypeList.length;
    typeCtx.height = BAR_HEIGHT * uniqueTypeList.length;
    timeCtx.height = BAR_HEIGHT * uniqueTypeList.length;


    this._priceChart = renderPriceChart(moneyCtx, uniqueTypeList, this._data);
    this._transportChart = renderTransportChart(typeCtx, uniqueTypeList, this._data);
    this._timeChart = renderTimeSpentChart(timeCtx, uniqueTypeList, this._data);
  }
}
