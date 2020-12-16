import createElement from '../../utils/createElement';
import './Table.scss';

class Table {
  constructor(parentElement) {
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

    this.createTimeSwitcher();
    this.createTotalSwitcher();
    this.loadData();
  }

  createTimeSwitcher() {
    const times = ['all time', 'last day'];
    let currentTimeIndex = 0;
    this.time = times[currentTimeIndex];

    const prevButton = createElement('button', '', '<');
    const nextButton = createElement('button', '', '>');
    const currentState = createElement('p', '', this.time)

    prevButton.addEventListener('click', () => {
      currentTimeIndex -= 1;
      if (currentTimeIndex < 0) {
        currentTimeIndex = times.length - 1;
      }
      this.time = times[currentTimeIndex];
      currentState.textContent = this.time;
      this.updateData();
    });

    nextButton.addEventListener('click', () => {
      currentTimeIndex += 1;
      if (currentTimeIndex >= times.length) {
        currentTimeIndex = 0;
      }
      this.time = times[currentTimeIndex];
      currentState.textContent = this.time;
      this.updateData();
    });

    createElement('div', 'table__switcher', [
      prevButton,
      currentState,
      nextButton,
    ], this.table);
  }

  createTotalSwitcher() {
    const totals = ['total', 'per 100,000 population'];

    let currentIndex = 0;
    this.total = totals[currentIndex];

    const prevButton = createElement('button', '', '<');
    const nextButton = createElement('button', '', '>');
    const currentState = createElement('p', '', this.total)

    prevButton.addEventListener('click', () => {
      currentIndex -= 1;
      if (currentIndex < 0) {
        currentIndex = totals.length - 1;
      }
      this.total = totals[currentIndex];
      currentState.textContent = this.total;
      this.updateData();
    });

    nextButton.addEventListener('click', () => {
      currentIndex += 1;
      if (currentIndex >= totals.length) {
        currentIndex = 0;
      }
      this.total = totals[currentIndex];
      currentState.textContent = this.total;
      this.updateData();
    });

    createElement('div', 'table__switcher', [
      prevButton,
      currentState,
      nextButton,
    ], this.table);
  }

  setCountry(countryName) {
    this.country = this.data.Countries.find((country) => country.Country === countryName);
    this.updateData();
  }

  updateData() {
    this.title.textContent = this.country.Country;

    if (this.dataPopulation) {
      this.population = this.dataPopulation.find((country) => country.name === this.country.Country).population;
    }

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

    if (this.total === 'per 100,000 population') {
      confirmed = Math.floor(confirmed * 100000 / this.population);
      deaths = Math.floor(deaths * 100000 / this.population);
      recovered = Math.floor(recovered * 100000 / this.population);
    }

    this.cases.textContent = confirmed;
    this.deaths.textContent = deaths;
    this.recovered.textContent = recovered;
  }

  loadData() {
    fetch('https://api.covid19api.com/summary', { method: 'GET', redirect: 'follow' })
      .then(response => response.json())
      .then(result => {
        this.data = result;
        this.setCountry('Belarus');
      })
      .catch(error => console.log('error', error));

    fetch('https://restcountries.eu/rest/v2/all?fields=name;population;', { method: 'GET' })
      .then(response => response.json())
      .then((result) => {
        this.dataPopulation = result;
      })
      .catch(error => console.log('error', error));
  }
}

export default Table;
