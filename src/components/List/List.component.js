import createElement from "../../utils/createElement";
import getData from "../../utils/getData";
import Switcher from "../Switcher/Switcher.component";

import './List.scss';

const summaryURL = 'https://api.covid19api.com/summary';
const populationURL = 'https://restcountries.eu/rest/v2/all?fields=name;population;flag';

function checkPopulationProp(populationProp, population) {
  if (populationProp === 'relative') {
    return 100000 / population;
  }
  return 1;
}

export default class List {
  constructor() {
    this.body = document.querySelector('body');
    
    this.listHeadingTitle = createElement('div', 'list-heading__title', 'Total cases');
    this.listHeadingData =  createElement('div', 'list-heading__data list-heading__data--red');

    this.listHeading = createElement('div', 'list-heading', [this.listHeadingTitle, this.listHeadingData]);

    this.listInputAllTime = createElement('input', 'list-switchers__input', null, null, ['type', 'radio'], ['name', 'time'], ['value', 'allTime'], ['checked', 'true']);
    this.listInputLastDay = createElement('input', 'list-switchers__input', null, null, ['type', 'radio'], ['name', 'time'], ['value', 'lastDay']);
    this.inputAbsolutePopulation = createElement('input', 'list-switchers__input', null, null, ['type', 'radio'], ['name', 'population'], ['value', 'absolute'], ['checked', 'true']);
    this.inputRelativePopulation = createElement('input', 'list-switchers__input', null, null, ['type', 'radio'], ['name', 'population'], ['value', 'relative']);
    
    this.listSwithers = createElement('div', 'list-switchers', 
      [createElement('label', 'list-switchers__label', [this.listInputAllTime, 'all time']),
      createElement('label', 'list-switchers__label', [this.listInputLastDay, 'last day']),
      createElement('label', 'list-switchers__label', [this.inputAbsolutePopulation, 'all population']),
      createElement('label', 'list-switchers__label', [this.inputRelativePopulation, 'per 100.000 population']),

    ]);

    this.listContent = createElement('ul', 'list__content');
    this.list = createElement('div', 'list', [this.listHeading, this.listSwithers, this.listContent], this.body);

    this.timeProp = 'allTime';
    this.populationProp = 'absolute';

    this.listInputAllTime.addEventListener('change', this.changeTimeProp);
    this.listInputLastDay.addEventListener('change', this.changeTimeProp);

    this.inputAbsolutePopulation.addEventListener('change', this.changePopulationProp);
    this.inputRelativePopulation.addEventListener('change', this.changePopulationProp);
    
    this.list.addEventListener('click', this.handleClick);
    // Switcher(this.list, ['all time', 'last day'], (value) => this.renderHeading(value));
  }

  getPopulation() {
    getData(populationURL).then((data) => {
      this.population = data;
    });
  }
  
  changeTimeProp = (event) => {
    this.timeProp = event.target.value;
    this.renderList();
    this.renderHeading();
  }

  changePopulationProp = (event) => {
    this.populationProp = event.target.value;
    this.renderList();
    this.renderHeading();
  }

  renderHeading(countryName) {
    this.listHeadingData.textContent = '';
    getData(summaryURL).then((data) => {
      if (countryName) {
        const targetCountry = data.Countries.find((item) => item.Country === countryName);
        this.listHeadingData.append(`${Math.floor(targetCountry[this.timeProp])}`);
      } else {
        this.listHeadingData.append(`${data.Global.NewConfirmed}`);
      }
    });
  }

  renderList() {
    let i = 0;
    this.listContent.innerHTML = '';
    getData(summaryURL).then(({Countries}) => {
      Countries.forEach(({Country, TotalConfirmed, NewConfirmed}) => {
        const {population, flag} = this.population.find((item) => item.name === Country ) || 0;
        console.log(i+=1);
        
        if (this.timeProp === 'allTime') {
          const listItemFlag = createElement('img', 'list-item__flag', null, null, ['src', `${flag}`]);
          const countryName = createElement('div', 'list-item__country', Country);
          const countryData = createElement('div', 'list-item__data', `${Math.floor(TotalConfirmed * checkPopulationProp(this.populationProp, population))}`);
          const listItem = createElement('li', 'list-item', [listItemFlag, countryName, countryData]);
          this.listContent.append(listItem);
        } else {
          const listItem = createElement('li', 'list-item', 
            `${Country} ${Math.floor(NewConfirmed * checkPopulationProp(this.populationProp, population))}`, null, ['countryName', Country]);
          this.listContent.append(listItem);
        }
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
    this.renderHeading();
    this.renderList();
  }
}