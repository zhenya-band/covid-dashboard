import './style.scss';
import List from "./components/List/List.component";
import Table from './components/Table/Table';
import CountryObserver from './CountryObserver';
import SwitcherObserver from './SwitcherObserver';
import './components/Map/Map'

const countryObserver = new CountryObserver();
const timeSwitcherObserver = new SwitcherObserver();
const populationSwitcherObserver = new SwitcherObserver();

new List(countryObserver, timeSwitcherObserver, populationSwitcherObserver).init();
const table = new Table(document.body, timeSwitcherObserver, populationSwitcherObserver);

countryObserver.subscribe(table);
