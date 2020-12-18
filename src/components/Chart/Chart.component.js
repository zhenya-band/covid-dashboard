import ChartJS from 'chart.js';
import createElement from "../../utils/createElement";
import './Chart.scss';

const dayOneURL = 'https://api.covid19api.com/total/dayone/country';
const getDayOneURL = (nameCountry) => `${dayOneURL}/${nameCountry}`

class Chart {
  constructor(parentElement) {
    this.content = createElement('div', 'chart', null, parentElement);
    this.canvas = createElement('canvas', 'chart__canvas', null, this.content);

    this.createChart();
  }

  createChart() {
    const ctx = this.canvas.getContext('2d');

    this.chart =  new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: '',
          data: [],
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
}

export default Chart;
