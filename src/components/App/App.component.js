import '../../style.scss';
import './App.style.scss';
import Header from '../Header/Header.component';
import List from "../List/List.component";
import Table from '../Table/Table.component';
import Chart from '../Chart/Chart.component';
import Map from '../Map/Map.component';
import Footer from '../Footer/Footer.component';

import CountryObserver from '../../observers/CountryObserver';
import SwitcherObserver from '../../observers/SwitcherObserver';
import createElement from '../../utils/createElement';

export default class App {
  constructor(parent) {
    this.parent = parent;
    this.countryObserver = new CountryObserver();
    this.timeSwitcherObserver = new SwitcherObserver();
    this.populationSwitcherObserver = new SwitcherObserver();
    this.casesSwitcherObserver = new SwitcherObserver();

    this.header = new Header();
    this.footer = new Footer();
    this.list = new List(this.countryObserver, this.timeSwitcherObserver, this.populationSwitcherObserver, this.casesSwitcherObserver);
    this.map = new Map(this.countryObserver, this.timeSwitcherObserver, this.populationSwitcherObserver, this.casesSwitcherObserver);
    this.table = new Table(document.body, this.timeSwitcherObserver, this.populationSwitcherObserver);
    this.chart = new Chart(document.body, this.populationSwitcherObserver, this.casesSwitcherObserver);

    this.countryObserver.subscribe(this.map);
    this.countryObserver.subscribe(this.chart);
    this.countryObserver.subscribe(this.table);

    this.mainLeft = createElement('div', 'main__left', this.list.list);
    this.mainCenter = createElement('div', 'main__center', this.map.map);
    this.mainRigth = createElement('div', 'main__rigth', [this.table.table, this.chart.content]);

    this.main = createElement('main', 'main', createElement('div', 'container main-wrapper', [
      this.mainLeft, this.mainCenter, this.mainRigth
    ]));
  }

  createLayout() {
    this.parent.append(this.header.header, this.main, this.footer.footer);
  }
  
  init() {
    this.createLayout();
  }
}