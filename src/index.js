import 'normalize.css';
import './style.scss';
import App from './components/App/App.component';

const root = document.querySelector('.root');
const app = new App(root).init();
