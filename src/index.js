import './style.scss';
import List from "./components/List/List.component";
import Table from './components/Table/Table';
import SwitcherObserver from './SwitcherObserver';
import './components/Map/Map'

const timeSwitcherObserver = new SwitcherObserver();
const populationSwitcherObserver = new SwitcherObserver();

new List(timeSwitcherObserver, populationSwitcherObserver).init();
const table = new Table(document.body, timeSwitcherObserver, populationSwitcherObserver);

