class SwitcherObserver {
  constructor() {
    this.observers = [];
  }

  subscribe(switcher) {
    switcher.setObserver(this);
    this.observers.push(switcher);
  }

  broadcast(indexItem) {
    this.observers.forEach(switcher => switcher.setItem(indexItem));
  }
}

export default SwitcherObserver;
