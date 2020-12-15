import createElement from '../../utils/createElement';
import './Switcher.scss';

function Switcher(parentElement, items, listener) {
  let currentIndex = 0;

  const prevButton = createElement('button', '', '<');
  const nextButton = createElement('button', '', '>');
  const currentItem = createElement('p');

  const updateState = () => {
    currentItem.textContent = items[currentIndex];
    listener(items[currentIndex]);
  }

  prevButton.addEventListener('click', () => {
    currentIndex -= 1;
    if (currentIndex < 0) {
      currentIndex = items.length - 1;
    }
    updateState();
  });

  nextButton.addEventListener('click', () => {
    currentIndex += 1;
    if (currentIndex >= items.length) {
      currentIndex = 0;
    }
    updateState();
  });

  createElement('div', 'switcher', [
    prevButton,
    currentItem,
    nextButton,
  ], parentElement);

  updateState();
}

export default Switcher;
