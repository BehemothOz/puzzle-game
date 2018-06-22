// Filters event for rectangles
let filterRectangle = (target) => {
  return target == `orange` || target == `blue` || target == `red` || target == `green`;
};

// Form an array with the addition of a new element from the source array
let getArrayWithRandomElement = (array) => {
  return array.concat(array[Math.floor(Math.random() * array.length)]);
};

// Blinking rectangles
let playSequence = (state) => {
  if (!state.started || state.ended) return;

  state.expectedClicks.forEach((color, i) => {
    let rect = document.querySelector(`.rectangle[data-color="${color}"]`);

    setTimeout(() => rect.classList.add(`active`), i * 1000);
    setTimeout(() => rect.classList.remove(`active`), (i + 1) * 1000);
  })
};

export { filterRectangle, getArrayWithRandomElement, playSequence };
