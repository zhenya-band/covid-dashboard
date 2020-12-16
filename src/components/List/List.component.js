import createElement from "../../utils/createElement";
import getData from "../../utils/getData";
import Switcher from '../Switcher/Switcher.component';
import {checkPopulationProps, checkTime, getParametrs} from './List.helpers';

import './List.scss';

const summaryURL = 'https://api.covid19api.com/summary';
const populationURL = 'https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha2Code';
export default class List {
  constructor(timeObserver, populationObserver) {
    this.body = document.querySelector('body');
    
    this.listHeadingTitle = createElement('div', 'list-heading__title', 'Total cases');
    this.listHeadingData =  createElement('div', 'list-heading__data list-heading__data--red');

    this.listHeading = createElement('div', 'list-heading', [this.listHeadingTitle, this.listHeadingData]);
    this.listContent = createElement('ul', 'list__content');
    this.list = createElement('div', 'list', [this.listHeading, this.listSwithers, this.listContent], this.body);
    this.listSearch = createElement('input', 'list-heading__search', null, this.listHeading);

    this.timeSwitcher = new Switcher(this.listHeading, ['all time', 'last day'], (value) => this.updateTime(value));
    this.populationSwitcher = new Switcher(this.listHeading, ['total ', 'per 100.000 population'], (value) => this.updatePopulation(value));
    this.parametersSwitcher = new Switcher(this.listHeading, ['confirmed','death', 'recovered'], (value) => this.updateParametrs(value));

    timeObserver.subscribe(this.timeSwitcher);
    populationObserver.subscribe(this.populationSwitcher);
    
    this.list.addEventListener('click', this.handleClick);
  }

  updateTime(time) {
    this.time = time;
    this.renderHeading();
    this.renderList();
  }

  updatePopulation(populationProps) {
    this.populationProps = populationProps;
    this.renderHeading();
    this.renderList();
  }

  updateParametrs(parameter) {
    this.parameter = parameter;
    this.renderHeading();
    this.renderList();
  }

  getPopulation() {
    getData(populationURL).then((data) => {
      this.population = data;
    });
  }

  renderHeading(countryName) {
    this.listHeadingData.textContent = '';
    const worldPopulaton = 7827000000;
    getData(summaryURL).then(({Countries, Global}) => {
      const parametrs = getParametrs(this.parameter, Global);
      if (countryName) {
        const targetCountry = Countries.find((item) => item.Country === countryName);
        this.listHeadingData.append(`${Math.round(targetCountry[this.timeProp])}`);
      } else {
        this.listHeadingData.append(`${Math.round(checkTime(this.time, parametrs.total, parametrs.new) * checkPopulationProps(this.populationProps, worldPopulaton))}`);
      }
    });
  }

  renderList() {
    this.listContent.innerHTML = '';
    getData(summaryURL).then(({Countries}) => {
      Countries.forEach(({Country, TotalConfirmed, NewConfirmed, CountryCode}) => {
        const {population, flag} = this.population.find((item) => item.alpha2Code === CountryCode ) || 0;
        
        const listItemFlag = createElement('img', 'list-item__flag', null, null, ['src', `${flag}`]);
        const countryName = createElement('div', 'list-item__country', Country);
        const countryData = createElement('div', 'list-item__data', `${Math.round(checkTime(this.time, TotalConfirmed, NewConfirmed) * checkPopulationProps(this.populationProps, population))}`);
        const listItem = createElement('li', 'list-item', [listItemFlag, countryName, countryData]);
        this.listContent.append(listItem);
      });
    });
  }

  // handleClick = (event) => {
  //   const {countryName} = event.target.dataset;
  //   if (countryName) {
  //     this.renderHeading(countryName)
  //   }
  // }


  init() {
    this.getPopulation();
    // this.renderHeading();
    // this.renderList();
  }
}