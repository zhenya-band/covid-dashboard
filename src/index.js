import './style.scss';
import List from "./components/List/List.component";
import Table from './components/Table/Table';

new List().init();
const table = new Table(document.body);

