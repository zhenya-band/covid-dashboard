import './style.scss';
import List from "./components/List/List.component";
import Table from './components/Table/Table';
import SwitcherObserver from './SwitcherObserver';

const timeSwitcherObserver = new SwitcherObserver();
new List(timeSwitcherObserver).init();
const table = new Table(document.body, timeSwitcherObserver);

