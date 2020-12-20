class CountryObserver {
  constructor() {
    this.observers = [];
  }

  subscribe(subscriber) {
    this.observers.push(subscriber);
  }

  broadcast(countryCode) {
    this.observers.forEach((subscriber) => subscriber.setCountry(countryCode));
  }
}

export default CountryObserver;
