import ChartJS from 'chart.js';
import Switcher from '../Switcher/Switcher.component';
import createElement from '../../utils/createElement';
import getData from '../../utils/getData';
import { getSlugCountry, getDates, getCases, getWorldDates, getWorldCases, getDailyCases,  getCasesPer100th } from './Chart.helpers';
import './Chart.style.scss';

const worldPopulaton = 7827000000;

const countriesURL = 'https://api.covid19api.com/countries';
const dayOneWorldURL = 'https://covid19-api.org/api/timeline';
const dayOneURL = 'https://api.covid19api.com/total/dayone/country';
const getDayOneURL = (nameCountry) => `${dayOneURL}/${nameCountry}`

const getPopulationURL = (countryCode) => `https://restcountries.eu/rest/v2/alpha/${countryCode}?fields=name;population;`; 

class Chart {
  constructor(parentElement, populationObserver) {
    this.content = createElement('div', 'chart', null, parentElement);
    this.canvas = createElement('canvas', 'chart__canvas');
    createElement('div', 'chart__container', this.canvas, this.content);
    this.resizeBtn = createElement('div', 'resize', '', this.content);


    this.createChart();

    this.populationSwitcher = new Switcher(this.content, ['total', 'per 100,000 population'], this.updatePopulation);
    this.parametersSwitcher = new Switcher(this.content, ['confirmed','deaths', 'recovered'], this.updateCase);
    this.dailySwitcher = new Switcher(this.content, ['all cases','daily cases'], this.updateDaily);

    populationObserver.subscribe(this.populationSwitcher);
    
    this.resizeBtn.addEventListener('click', this.resize);

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
        this.setCountry('World');
      });
  }

  setCountry(countryCode) {
    this.countryCode = countryCode;

    if (countryCode === 'World') {
      getData(dayOneWorldURL)
        .then((dayOneWorldData) => {
          this.dayOneData = dayOneWorldData.reverse();
          this.population = worldPopulaton;
          this.updateData();
        });
    } else {
      const slugCountry = getSlugCountry(this.countries, countryCode);
      getData(getDayOneURL(slugCountry))
        .then((dayOneData) => {
          this.dayOneData = dayOneData;
          getData(getPopulationURL(countryCode))
            .then((populationData) => {
              this.population = populationData.population;
              this.nameCountry = populationData.name;
              this.updateData();
            });
        }); 
    }
  }

  updatePopulation = (population) => {
    this.populationParameter = population;
    this.updateData();
  };

  updateCase = (cases) => {
    this.cases = cases;
    this.updateData();
  };
  
  updateDaily = (daily) => {
    this.daily = daily;
    this.updateData();
  }

  updateData() {
    if (!this.dayOneData || !this.population) return;

    let title = '';
    let dates = [];
    let cases = [];

    if (this.countryCode === 'World') {
      title = `World - ${this.cases}`;
      dates = getWorldDates(this.dayOneData);
      cases = getWorldCases(this.dayOneData, this.cases);
    } else {
      title = `${this.nameCountry} - ${this.cases}`;
      dates = getDates(this.dayOneData);
      cases = getCases(this.dayOneData, this.cases);
    }

    if (this.daily === 'daily cases') {
      cases = getDailyCases(cases);
    }

    if (this.populationParameter === 'per 100,000 population') {
      cases = getCasesPer100th(cases, this.population);
    }
    
    this.updateChart(dates, cases, title);
  }

  updateChart(labels, data, label) {
    this.chart.data.datasets[0].label = label;
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }

  resize = () => {
    this.content.classList.toggle('chart--large');
  }
}

export default Chart;
