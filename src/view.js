let renderHeaderTemplate = (state) => {
  return `<div class="header">
            <div class="level">Score: <span>${state.score}</span></div>
          </div>`;
}

let renderStartScreen = () => {
  return `<div class="screen-start">
            <h1 class="title">Puzzle</h1>
            <p class="description"><b>Rules.</b> Four colored buttons light up in a certain order. After the drawing is displayed, you need to repeat the template by clicking the buttons in the correct order. The template becomes longer with each successful attempt. The error leads to the end of the game.</p>
            <button class="btn btn-start">Start</button>
          </div>`;
}

let renderGameScreen = (state) => {
  return `${renderHeaderTemplate(state)}
          <div class="screen-rectangles">
            ${state.rectangles.map(color => `<div class="rectangle ${color}" data-color="${color}"></div>`).join('')}
          </div>`;
}

let renderEndScreen = () => {
  return `<div class="screen-end">
            <h1 class="title">Game over</h1>
          </div>`;
}

let renderSelectedScreen = (state) => {
  return `<div class="main">
            ${(!state.started && !state.ended) ? renderStartScreen() : (state.started && !state.ended) ? renderGameScreen(state) : renderEndScreen()}
          </div>`;
}

let renderToDom = (state) => {
  app.innerHTML = renderSelectedScreen(state);
}

export { renderToDom };