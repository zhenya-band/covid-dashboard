import '../../style.scss';
import './App.style.scss';
import List from "../List/List.component";
import Table from '../Table/Table';
import Chart from '../Chart/Chart.component';
import Header from '../Header/Header.component';

import CountryObserver from '../../observers/CountryObserver';
import SwitcherObserver from '../../observers/SwitcherObserver';
import createElement from '../../utils/createElement';
// import Map from './components/Map/Map';

export default class App {
  constructor(parent) {
    this.parent = parent;
    this.countryObserver = new CountryObserver();
    this.timeSwitcherObserver = new SwitcherObserver();
    this.populationSwitcherObserver = new SwitcherObserver();


    this.header = new Header();
    this.list = new List(this.countryObserver, this.timeSwitcherObserver, this.populationSwitcherObserver);
    this.map = createElement('div', 'map');
    this.table = new Table(document.body, this.timeSwitcherObserver, this.populationSwitcherObserver);
    this.chart = new Chart(document.body, this.populationSwitcherObserver);

    this.countryObserver.subscribe(this.chart);
    this.countryObserver.subscribe(this.table);

    this.mainLeft = createElement('div', 'main__left', this.list.list);
    this.mainCenter = createElement('div', 'main__center', this.map);
    this.mainRigth = createElement('div', 'main__rigth', [this.table.table, this.chart.content]);

    this.main = createElement('main', 'main', createElement('div', 'container main-wrapper', [
      this.mainLeft, this.mainCenter, this.mainRigth
    ]));
  }

  createLayout() {
    this.parent.append(this.header.header, this.main);
  }
  
  

  init() {
    this.createLayout();
  }
}