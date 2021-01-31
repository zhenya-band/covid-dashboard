import createElement from "../../utils/createElement";

import './Footer.style.scss';

export default class Footer {
  constructor() {
    this.container = createElement('div', 'container footer-wrapper');
    this.listItem1 = createElement('li', 'footer__list-item', 
      createElement('a', null, 'zhenya-band', null, ['href', 'https://github.com/zhenya-band']));

    this.listItem2 = createElement('li', 'footer__list-item', 
      createElement('a', null, 'LazouskiKiryl', null, ['href', 'https://github.com/LazouskiKiryl']));

    this.listItem3 = createElement('li', 'footer__list-item', 
      createElement('a', null, 'Adelheid483', null, ['href', 'https://github.com/Adelheid483']));

    this.list = createElement('ul', 'footer__list', [this.listItem1, this.listItem2, this.listItem3], this.container);
    this.logo = createElement('a', 'footer__logo', 
      createElement('img', null, null, null, ['src', 'assets/img/rss-logo.svg']), this.container, ['href', 'https://rs.school/js/']);
    this.year = createElement('div', 'footer__year', '2020', this.container);
    this.footer = createElement('footer', 'footer', this.container);
  }
}