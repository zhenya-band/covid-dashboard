import createElement from "../../utils/createElement";
import getData from "../../utils/getData";

import './List.scss';

const summaryURL = 'https://api.covid19api.com/summary';
const populationURL = 'https://restcountries.eu/rest/v2/all?fields=name;population;';

function checkPopulationProp(populationProp, population) {
  if (populationProp === 'relative') {
    return 100000 / population;
  }
  return 1;
}

export default class List {
  constructor() {
    this.body = document.querySelector('body');
    this.listHeading = createElement('div', 'list__heading');
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
    getData(summaryURL).then((data) => {
      this.listHeading.textContent = '';
      const headingText = this.timeProp === 'allTime' ? 'Total confirmed' : 'Last day confirmed';
      const timeRequest =  this.timeProp === 'allTime' ? 'TotalConfirmed' : 'NewConfirmed';

      if (countryName) {
        const targetCountry = data.Countries.find((item) => item.Country === countryName);
        this.listHeading.append(`${headingText} ${Math.floor(targetCountry[timeRequest])}`);
      } else {
        this.listHeading.append(`${headingText} ${data.Global.NewConfirmed}`);
      }
    });
  }

  renderList() {
    this.listContent.innerHTML = '';
    getData(summaryURL).then(({Countries}) => {
      Countries.forEach(({Country, TotalConfirmed, NewConfirmed}) => {
        const {population} = this.population.find((item) => item.name === Country) || 0;
        if (this.timeProp === 'allTime') {
          const listItem = createElement('li', 'list__item', 
            `${Math.floor(TotalConfirmed * checkPopulationProp(this.populationProp, population))} ${Country}`, null, ['countryName', Country]);
          this.listContent.append(listItem);
        } else {
          const listItem = createElement('li', 'list__item', 
            `${Math.floor(NewConfirmed * checkPopulationProp(this.populationProp, population))} ${Country}`, null, ['countryName', Country]);
          this.listContent.append(listItem);
        }
      });
    });
  }

  handleClick = (event) => {
    const {countryName} = event.target.dataset;
    if (countryName) {
      this.renderHeading(countryName)
    }
  }


  init() {
    this.getPopulation();
    this.renderHeading();
    this.renderList();
  }
}