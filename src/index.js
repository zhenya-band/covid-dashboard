import './style.scss';
import List from "./components/List/List.component";
import Table from './components/Table/Table';
import Chart from './components/Chart/Chart.component';
import CountryObserver from './CountryObserver';
import SwitcherObserver from './SwitcherObserver';

const countryObserver = new CountryObserver();
const timeSwitcherObserver = new SwitcherObserver();
const populationSwitcherObserver = new SwitcherObserver();

new List(countryObserver, timeSwitcherObserver, populationSwitcherObserver).init();
const table = new Table(document.body, timeSwitcherObserver, populationSwitcherObserver);
const chart = new Chart(document.body);

countryObserver.subscribe(table);
