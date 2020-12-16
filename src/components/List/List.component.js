import createElement from "../../utils/createElement";
import getData from "../../utils/getData";
import Switcher from '../Switcher/Switcher.component';
import SwitcherObserver from '../../SwitcherObserver';

import './List.scss';

const summaryURL = 'https://api.covid19api.com/summary';
const populationURL = 'https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha2Code';

function checkPopulationProp(populationProp, population) {
  if (populationProp === 'relative') {
    return 100000 / population;
  }
  return 1;
}

function checkTime(time, TotalConfirmed, NewConfirmed) {
  return time === 'all time' ? TotalConfirmed : NewConfirmed;
}

export default class List {
  constructor() {
    this.body = document.querySelector('body');
    
    this.listHeadingTitle = createElement('div', 'list-heading__title', 'Total cases');
    this.listHeadingData =  createElement('div', 'list-heading__data list-heading__data--red');

    this.listHeading = createElement('div', 'list-heading', [this.listHeadingTitle, this.listHeadingData]);
    this.listContent = createElement('ul', 'list__content');
    this.list = createElement('div', 'list', [this.listHeading, this.listSwithers, this.listContent], this.body);

    this.timeSwitcher = new Switcher(this.listHeading, ['all time', 'last day'], (value) => this.updateTime(value));

    this.timeProp = 'allTime';
    this.populationProp = 'absolute';
    
    this.list.addEventListener('click', this.handleClick);
  }

  updateTime(time) {
    this.time = time;
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
    getData(summaryURL).then(({Countries, Global: {NewConfirmed, TotalConfirmed}}) => {
      if (countryName) {
        const targetCountry = Countries.find((item) => item.Country === countryName);
        this.listHeadingData.append(`${Math.floor(targetCountry[this.timeProp])}`);
      } else {
        this.listHeadingData.append(`${checkTime(this.time, TotalConfirmed, NewConfirmed)}`);
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
        const countryData = createElement('div', 'list-item__data', `${Math.floor(checkTime(this.time, TotalConfirmed, NewConfirmed) * checkPopulationProp(this.populationProp, population))}`);
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
    this.renderList();
  }
}