import createElement from "../../utils/createElement";
import getData from "../../utils/getData";
import Switcher from '../Switcher/Switcher.component';
import {checkPopulationProps, checkTime, getParametrs, getParametrsByCountry} from './List.helpers';

import './List.scss';

const summaryURL = 'https://api.covid19api.com/summary';
const populationURL = 'https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha2Code';
export default class List {
  constructor(countryObserver, timeObserver, populationObserver) {
    // this.body = document.querySelector('body');
    this.countryObserver = countryObserver;
    
    this.listHeadingTitle = createElement('div', 'list-heading__title', 'Total cases');
    this.listHeadingData =  createElement('div', 'list-heading__data list-heading__data--red');

    this.listHeading = createElement('div', 'list-heading', [this.listHeadingTitle, this.listHeadingData]);
    this.listContent = createElement('ul', 'list__content');
    this.list = createElement('div', 'list', [this.listHeading, this.listSwithers, this.listContent]);
    this.listSearch = createElement('input', 'list-heading__search', null, this.listHeading, ['placeholder', 'search']);
    this.resizeBtn = createElement('div', 'list-resize', '+', this.list);

    this.timeSwitcher = new Switcher(this.listHeading, ['all time', 'last day'], this.updateTime);
    this.populationSwitcher = new Switcher(this.listHeading, ['total ', 'per 100.000 population'], this.updatePopulation);
    this.parametersSwitcher = new Switcher(this.listHeading, ['confirmed','death', 'recovered'], this.updateParametrs);

    timeObserver.subscribe(this.timeSwitcher);
    populationObserver.subscribe(this.populationSwitcher);
    
    this.listSearch.addEventListener('input', this.search);
    this.list.addEventListener('click', this.handleClick);
    this.resizeBtn.addEventListener('click', this.resize);

    getData(summaryURL).then((data) => {
      this.data = data;
      this.renderHeading();
      this.renderList();
    });

    getData(populationURL).then((data) => {
      this.population = data;
    })
  }

  updateTime = (time) => {
    this.time = time;
    this.renderHeading();
    this.renderList();
  }

  updatePopulation = (populationProps) => {
    this.populationProps = populationProps;
    this.renderHeading();
    this.renderList();
  }

  updateParametrs = (parameter) => {
    this.parameter = parameter;
    this.renderHeading();
    this.renderList();
  }

  resize = () => {
    this.list.classList.toggle('list--large');
  }

  renderHeading(listData) {
    this.listHeadingData.textContent = '';
    const worldPopulaton = 7827000000;
    getData(summaryURL).then(({Global}) => {
      const parametrs = getParametrs(this.parameter, Global);
      if (listData) {
        this.listHeadingData.textContent = listData; 
      } else {
        this.listHeadingData.append(`${Math.round(checkTime(this.time, parametrs.total, parametrs.new) * checkPopulationProps(this.populationProps, worldPopulaton))}`);
      }
    });
  }

  renderList() {
    if (!this.data || !this.population) return;
    this.listContent.innerHTML = '';
    const listItems = [];
    // getData(summaryURL).then(({Countries}) => {
      this.data.Countries.forEach(({Country, NewConfirmed, TotalConfirmed, NewDeaths, TotalDeaths, NewRecovered, TotalRecovered, CountryCode}) => {
        const {population, flag} = this.population.find((item) => item.alpha2Code === CountryCode ) || 0;

        const parametrs = getParametrsByCountry(this.parameter, NewConfirmed, TotalConfirmed, NewDeaths, TotalDeaths, NewRecovered, TotalRecovered);

        const listItemFlag = createElement('img', 'list-item__flag', null, null, ['src', `${flag}`]);
        const countryName = createElement('div', 'list-item__country', Country);
        const countryData = createElement('div', 'list-item__data', 
          `${Math.round(checkTime(this.time, parametrs.total, parametrs.new) * checkPopulationProps(this.populationProps, population))}`);

        const listItem = createElement('li', 'list-item', [listItemFlag, countryName, countryData], null, ['code', `${CountryCode}`]);
        listItems.push(listItem);
        Array.from(listItems)
        .sort((a, b) => b.lastChild.textContent - a.lastChild.textContent)
        .forEach((item) => this.listContent.append(item))
      });
    // });
  }

  search = (event) => {
    const searchValue = event.target.value.trim().toLowerCase();
    const listItems = document.querySelectorAll('.list-item');
    if (searchValue !== '') {
      listItems.forEach((item) => {
        const itemText = item.querySelector('.list-item__country').innerText.toLowerCase();
        if (itemText.search(searchValue) === -1) {
          item.classList.add('hide');
        } else {
          item.classList.remove('hide');
        }
      })
    } else {
        listItems.forEach((item) => {
        item.classList.remove('hide');
      });
    }
  }

  handleClick = (event) => {
    const listItem = event.target.closest('.list-item');
    if (listItem) {
      const listItemData = listItem.lastChild.textContent;
      this.renderHeading(listItemData);
      const {code} = listItem.dataset;
        if (code) {
          this.countryObserver.broadcast(code);
        }
    }
  }
}