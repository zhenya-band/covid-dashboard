import ChartJS from 'chart.js';
import Switcher from '../Switcher/Switcher.component';
import createElement from '../../utils/createElement';
import getData from '../../utils/getData';
import { getSlugCountry, getDates, getCases, getCasesPer100th } from './Chart.helpers';
import './Chart.scss';

const countriesURL = 'https://api.covid19api.com/countries';

const dayOneURL = 'https://api.covid19api.com/total/dayone/country';
const getDayOneURL = (nameCountry) => `${dayOneURL}/${nameCountry}`

const getPopulationURL = (countryCode) => `https://restcountries.eu/rest/v2/alpha/${countryCode}?fields=population;`; 

class Chart {
  constructor(parentElement, populationObserver) {
    this.content = createElement('div', 'chart', null, parentElement);
    this.canvas = createElement('canvas', 'chart__canvas');
    createElement('div', 'chart__container', this.canvas, this.content);

    this.createChart();

    this.populationSwitcher = new Switcher(this.content, ['total', 'per 100,000 population'], this.updatePopulation);
    this.parametersSwitcher = new Switcher(this.content, ['confirmed','deaths', 'recovered'], this.updateCase);
    
    populationObserver.subscribe(this.populationSwitcher);

    this.getCountries();
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
          backgroundColor: 'red',
          borderWidth: 0,
          barPercentage: 1,
          categoryPercentage: 1,
          barThickness: 5,
          maxBarThickness: 8,
          minBarLength: 2,
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

  getCountries() {
    getData(countriesURL)
      .then((data) => {
        this.countries = data;
        this.setCountry('BY');
      });
  }

  setCountry(countryCode) {
    const slugCountry = getSlugCountry(this.countries, countryCode);
    getData(getDayOneURL(slugCountry))
      .then((dayOneData) => {
        this.dayOneData = dayOneData;
        getData(getPopulationURL(countryCode))
          .then((populationData) => {
            this.population = populationData.population;
            this.updateData();
          });
      });
  }

  updatePopulation = (population) => {
    this.populationParameter = population;
    this.updateData();
  };

  updateCase = (cases) => {
    this.cases = cases;
    this.updateData();
  };

  updateData() {
    if (!this.dayOneData || !this.populationParameter) return;

    const dates = getDates(this.dayOneData);
    let cases = getCases(this.dayOneData, this.cases);

    if (this.populationParameter === 'per 100,000 population') {
      cases = getCasesPer100th(cases, this.population);
    }
    
    this.updateChart(dates, cases, this.cases);
  }

  updateChart(labels, data, label) {
    this.chart.data.datasets[0].label = label;
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }
}

export default Chart;
