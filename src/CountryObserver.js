class CountryObserver {
  constructor() {
    this.observers = [];
  }

  subscribe(subscriber) {
    this.observers.push(subscriber);
  }

  broadcast(nameCountry) {
    this.observers.forEach((subscriber) => subscriber.setCountry(nameCountry));
  }
}

export default CountryObserver;
