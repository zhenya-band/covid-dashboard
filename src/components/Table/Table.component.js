import createElement from '../../utils/createElement';
import getData from '../../utils/getData';
import Switcher from '../Switcher/Switcher.component';
import { getPopulation, getCasesPer100th } from './Table.helpers';
import './Table.style.scss';

class Table {
  constructor(parentElement, timeObserver, populationObserver) {
    this.table = createElement('div', 'table', null, parentElement);
    
    this.title = createElement('p', 'table__title', '-', this.table);
    this.cases = createElement('p', '', '-');
    this.deaths = createElement('p', '', '-');
    this.recovered = createElement('p', '', '-');
    
    const content = createElement('div', 'table__content', null, this.table);

    createElement('div', 'table__cases', [
      createElement('p', '', 'Cases'),
      this.cases
    ], content);

    createElement('div', 'table__deaths', [
      createElement('p', '', 'Deaths'),
      this.deaths
    ], content);

    createElement('div', 'table__recovered', [
      createElement('p', '', 'Recovered'),
      this.recovered
    ], content);

    this.resizeBtn = createElement('div', 'resize', '', this.table);
    
    this.timeSwitcher = new Switcher(this.table, ['all time', 'last day'], (value) => this.updateTime(value));
    timeObserver.subscribe(this.timeSwitcher);

    this.populationSwitcher = new Switcher(this.table, ['total', 'per 100,000 population'], (value) => this.updatePopulation(value));
    populationObserver.subscribe(this.populationSwitcher);

    this.resizeBtn.addEventListener('click', this.resize);
    this.loadData();
  }

  setCountry(countryCode) {
    if (!this.data) return;

    if (countryCode === "World") {
      this.country = {
        ...this.data.Global,
        Country: 'World'
      }
    } else {
      this.country = this.data.Countries.find((country) => country.CountryCode === countryCode);
    }

    this.updateData();
  }

  updateTime(time) {
    this.time = time;
    this.updateData();
  }

  updatePopulation(population) {
    this.total = population;
    this.updateData();
  }

  updateData() {
    if (!this.data || !this.dataPopulation) return;

    if (this.country === 'World') {
      this.title.textContent = this.country
    }
    this.title.textContent = this.country.Country;

    let confirmed = 0;
    let deaths = 0;
    let recovered = 0;

    if (this.time === 'all time') {  
      confirmed = this.country.TotalConfirmed;
      deaths = this.country.TotalDeaths;
      recovered = this.country.TotalRecovered;
    } else if (this.time === 'last day') {
      confirmed = this.country.NewConfirmed;
      deaths = this.country.NewDeaths;
      recovered = this.country.NewRecovered;
    }

    this.population = getPopulation(this.dataPopulation, this.country);

    if (this.total === 'per 100,000 population') {
      confirmed = getCasesPer100th(confirmed, this.population);
      deaths = getCasesPer100th(deaths, this.population);
      recovered = getCasesPer100th(recovered, this.population);
    }

    this.cases.textContent = confirmed;
    this.deaths.textContent = deaths;
    this.recovered.textContent = recovered;
  }

  loadData() {
    getData('https://api.covid19api.com/summary')
      .then((result) => {
        this.data = result;
        getData('https://restcountries.eu/rest/v2/all?fields=name;population;')
          .then((resultPopulation) => {
            this.dataPopulation = resultPopulation;
            this.setCountry('World');
          });
      });
  }

  resize = () => {
    this.table.classList.toggle('table--large');
  }
}

export default Table;
