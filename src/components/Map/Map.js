import createElement from '../../utils/createElement';
import getData from '../../utils/getData';
import Switcher from '../Switcher/Switcher.component';
import './Map.scss';

const url = 'https://corona.lmao.ninja/v2/countries';
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpbmFrYXVsaXR6aGFoYSIsImEiOiJja2lvaXhqa3Qwd3J6MnJvNTl5NmFiMDAxIn0.ZfGumpCeXpfbt3l63dYTLw';

export default class Map {
  constructor() {
    this.map = createElement('div', 'map_element');
    this.mapContainer = createElement('div', null, null, this.map, ['id', 'map']);

    this.timeSwitcher = new Switcher(this.map, ['all time', 'last day'], this.updateTime);
    this.populationSwitcher = new Switcher(this.map, ['total ', 'per 100.000 population'], this.updatePopulation);
    this.parametersSwitcher = new Switcher(this.map, ['confirmed','death', 'recovered'], this.updateCases);

    this.createMap();
    this.getCountries();
  }

  updateTime = (time) => {
    this.time = time;
    this.updateDate();
  };

  updatePopulation = (population) => {
    this.population = population;
    this.updateDate();
  };

  updateCases = (cases) => {
    this.cases = cases;
    this.updateDate();
  };

  createMap() {
    this.markers = [];
    this.mapBox = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v10',
      zoom: 4,
      center: [28, 53]
    });
    this.mapBox.on('load', (event) => {
      event.target.resize();
    });
  }

  getMarkerColor = (cases, maxCases) => {
    const correctionFactor = 0.2;
    return `rgb(255, ${255 * (cases / (correctionFactor * maxCases))} ,0)`;
  };

  getCountries() {
    getData(url).then(data => {
      this.data = data;
      this.updateDate();
    })
  }

  updateDate() {
    if (!this.data) return;

    this.markers.forEach((marker1) => marker1.remove());
    
    const caseArray = [];

    this.data.forEach((country) => {
      const cases = this.getCases(country);
      caseArray.push(cases);
    });

    const maxCases = Math.max(...caseArray);

    this.data.forEach((country, index) => {
      const marker = new mapboxgl.Marker({
        color: this.getMarkerColor(caseArray[index], maxCases)
      })
        .setLngLat([country.countryInfo.long, country.countryInfo.lat])
        .setPopup(this.createPopup(country.country, caseArray[index]))
        .addTo(this.mapBox);

      this.markers.push(marker);
    });
  }

  createPopup(countryName, cases) {
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnMove: true
    });
    popup.setHTML(`
      <p>${countryName}</p>
      <p>${this.cases}</p>
      <p>${this.population}</p>
      <p>${this.time}</p>
      <p>${cases}</p>
    `);
    
    popup.on('open', (e) => {
      // console.log(e);
    });

    return popup;
  }

  getCases(country) {
    let currentCases = 0;

    if (this.time === 'all time') {
      if (this.cases === 'confirmed') {
        currentCases = country.cases;
      } else if (this.cases === 'death') {
        currentCases = country.deaths;
      } else if (this.cases === 'recovered') {
        currentCases = country.recovered;
      }
    } else if (this.time === 'last day') {
      if (this.cases === 'confirmed') {
        currentCases = country.todayCases;
      } else if (this.cases === 'death') {
        currentCases = country.todayDeaths;
      } else if (this.cases === 'recovered') {
        currentCases = country.todayRecovered;
      }
    }

    if (this.population === 'per 100.000 population') {
      const perPopulation = 100000;
      if (country.population !== 0) {
        currentCases = Math.round(currentCases * perPopulation / country.population);
      }
    }

    return currentCases;
  }
}
