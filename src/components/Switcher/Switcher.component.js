import createElement from '../../utils/createElement';
import './Switcher.scss';

class Switcher {
  constructor(parentElement, items, listener) {
    this.listener = listener;
    this.items = items;
    this.currentIndex = 0;

    const prevButton = createElement('button', '', '<');
    const nextButton = createElement('button', '', '>');
    this.currentItem = createElement('p');

    prevButton.addEventListener('click', () => {
      this.currentIndex -= 1;
      if (this.currentIndex < 0) {
        this.currentIndex = this.items.length - 1;
      }
      this.updateItem();
    });

    nextButton.addEventListener('click', () => {
      this.currentIndex += 1;
      if (this.currentIndex >= this.items.length) {
        this.currentIndex = 0;
      }
      this.updateItem();
    });

    createElement('div', 'switcher', [
      prevButton,
      this.currentItem,
      nextButton,
    ], parentElement);

    this.updateItem();
  }

  updateItem() {
    if (this.observer) {
      this.observer.broadcast(this.currentIndex);
    } else {
      this.currentItem.textContent = this.items[this.currentIndex];
      this.listener(this.items[this.currentIndex]);
    }
  }

  setItem(index) {
    this.currentIndex = index;
    this.currentItem.textContent = this.items[index];
    this.listener(this.items[this.currentIndex]);
  }

  setObserver(observer) {
    this.observer = observer;
  }
}

export default Switcher;
