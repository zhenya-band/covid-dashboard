import createElement from "../utils/createElement";
import getData from "../utils/getData";

const summaryURl = 'https://api.covid19api.com/summary';

export default class mainList {
  constructor() {
    this.body = document.querySelector('body');
    this.heading = createElement('div', 'heading', '',this.body);
    this.list = createElement('ul', 'list', null, this.body);

    this.body.addEventListener('click', this.handleClick);
  }

  renderHeading(countryName) {
    getData(summaryURl).then((data) => {
      this.heading.textContent = '';
      if (countryName) {
        const res =  data.Countries.find((item) => item.Country === countryName);
        this.heading.append(res.TotalConfirmed);
      } else {
        this.heading.append(data.Global.TotalConfirmed);
      }
    });
  }

  renderCountries() {
    getData(summaryURl).then(({Countries}) => {
      Countries.forEach(({Country, TotalConfirmed}) => {
        const li = createElement('li', 'list__item', `${Country} ${TotalConfirmed}`, this.list, ['countryName', Country]);
      });
    });
  }

  handleClick = (event) => {
    const {countryName} = event.target.dataset;
    if (countryName) {
      this.renderHeading(countryName)
    }
  }


  init() {
    this.renderHeading();
    this.renderCountries();
  }
}