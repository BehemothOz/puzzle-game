import { map, flatMap, filter, buffer, take, bufferCount, sequenceEqual } from 'rxjs/operators';
import { Observable, fromEvent, pipe, of, from, merge } from 'rxjs';


let app = document.querySelector(`#app`);

// State
/*
  rectangles - кол-во прямоугольников на экране
  expectedClicks - ожидаемая последовательность кликов (будет увеличиваться / будет проверятся с пользовательской последовательностью)
  score - счет (увеличиваетсяна единицу)
  started - начало игры (true - старт игры)
  ended - конец игры (true - конец игры)

  TODO - окончание игры как win
*/
let initialState = {
  rectangles: [`orange`, `blue`, `red`, `green`],
  expectedClicks: [`orange`, `blue`, `red`, `green`],
  score: 0,
  started: false,
  ended: false
}



/*
  Render screens
*/

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
  initGame(state);
}

renderToDom(initialState);



/*
  Logics app
*/

function initGame(state) {

  // Вспомогательная функци: фильтрация кликов (только на прямоугольниках)
  let filterRectangle = (target) => {
    return target == `orange` || target == `blue` || target == `red` || target == `green`;
  }

  // Stream clicks on document
  let clickDocument$ = fromEvent(document, `click`);

  // Stream click button start
  let clickButtonStart$ = clickDocument$.pipe(
      filter(event => event.target.classList.contains(`btn-start`)),
      map(_ => true)
    );

  // Stream filtered clicks on document (rectangle)
  let filteredClickRectangle$ = clickDocument$.pipe(
      filter(event => filterRectangle(event.target.dataset.color))
    );

  // Stream selected rectangle
  let clickRectangle$ = filteredClickRectangle$.pipe(
      map(event => event.target),
      map(elem => elem.dataset.color)
    );

  // Comparison with the expected sequence
  // Uses the state: expectedClicks.length and expectedClicks
  let sequenceComparison$ = clickRectangle$.pipe(bufferCount(state.expectedClicks.length), flatMap(sequence => {
    return from(state.expectedClicks).pipe(sequenceEqual(from(sequence)))
  }));


  // Subscribe (start)
  clickButtonStart$.subscribe(result => {
    // Copy init state + change started
    let newState = Object.assign({}, state, {started: true});

    renderToDom(newState);
  })

  // Subscribe (game process)
  sequenceComparison$.subscribe(result => {
    let newState;
    
    if (result) {
      newState = Object.assign({}, state, {
        score: state.score + 1,
        started: true
      });

      renderToDom(newState);
    }

    if (!result) {
      newState = Object.assign({}, state, {ended: true});

      renderToDom(newState);
    }
  })

}
