import 'normalize.css';
// import './vars.scss';
import './style.scss';
// import List from "./components/List/List.component";
// import Table from './components/Table/Table';
// import Chart from './components/Chart/Chart.component';
// import CountryObserver from './observers/CountryObserver';
// import SwitcherObserver from './observers/SwitcherObserver';
// import './components/Map/Map';


import App from './components/App/App.component';

// const countryObserver = new CountryObserver();
// const timeSwitcherObserver = new SwitcherObserver();
// const populationSwitcherObserver = new SwitcherObserver();

// new List(countryObserver, timeSwitcherObserver, populationSwitcherObserver).init();
// const table = new Table(document.body, timeSwitcherObserver, populationSwitcherObserver);
// const chart = new Chart(document.body, populationSwitcherObserver);

// countryObserver.subscribe(table);
// countryObserver.subscribe(chart);
const root = document.querySelector('.root');

const app = new App(root).init();
