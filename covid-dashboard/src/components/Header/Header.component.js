import createElement from "../../utils/createElement";

import './Header.style.scss';

export default class Header {
  constructor() {
    this.container = createElement('div', 'container');
    this.title = createElement('h1', 'header__title', 'Covid Dashboard', this.container);
    this.header = createElement('header', 'header', this.container);
  }
}