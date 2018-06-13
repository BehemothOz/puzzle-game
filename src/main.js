let app = document.querySelector(`#app`);

// State
let initialState = {
  level: 0,
  pattern: 3,
  start: true,
  end: false
}

let rectangles = [`orange`, `blue`, `red`, `green`]; // 4 rectangels

let headerTemplate = (state) => {
  return `<div class="header">
            <div class="level">Level: <span>${state.level}</span></div>
          </div>`;
}

let startScreen = () => {
  return `<div class="screen-start">
            <h1 class="title">Puzzle</h1>
            <p class="description"><b>Rules.</b> Four colored buttons light up in a certain order. After the drawing is displayed, you need to repeat the template by clicking the buttons in the correct order. The template becomes longer with each successful attempt. The error leads to the end of the game.</p>
            <button class="btn btn-start">Start</button>
          </div>`;
}

let gameScreen = (state) => {
  return `${headerTemplate(state)}
          <div class="screen-rectangles">
            ${rectangles.map(color => `<div class="rectangle ${color}"></div>`).join('')}
          </div>`;
}

let endScreen = () => {
  return `<div class="screen-end">
            <h1 class="title">Game over</h1>
          </div>`;
}

let toggleScreen = (state) => {
  return `<div class="main">
            ${(!state.start && !state.end) ? startScreen() : (state.start && !state.end) ? gameScreen(state) : endScreen()}
          </div>`;
}

let renderScreen = (state) => {
  app.innerHTML = toggleScreen(state);
}

renderScreen(initialState);