import * as R from "ramda";

import { map, flatMap, filter, buffer, take, bufferCount, sequenceEqual, scan, subscribeOn, mapTo, publishReplay, refCount } from 'rxjs/operators';
import { Observable, Subject, fromEvent, pipe, of, from, merge } from 'rxjs';


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
  customСlicks: [],
  score: 0,
  started: true,
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
            <button class="btn btn-end">End</button>
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
  // initGame(state);
}

renderToDom(initialState);



/*
  Logics app
*/

let filterRectangle = (target) => {
  return target == `orange` || target == `blue` || target == `red` || target == `green`;
}

let click$ = fromEvent(document, `click`);

/*
  Block intents
*/

let intents = {
  startGame$: click$.pipe(
    filter(event => event.target.classList.contains(`btn-start`)),
    map(_ => true)
  ),

  solveStep$: click$.pipe(
    filter(event => filterRectangle(event.target.dataset.color)),
    map(event => event.target),
    map(elem => elem.dataset.color)
  ),

  endGame$: click$.pipe(
    filter(event => event.target.classList.contains(`btn-end`)),
    map(_ => true)
  )
}


/*
  Action block (depends on intents)
*/
// let qq = new Subject();

let action$ = merge(
  intents.startGame$.pipe(
    map(_ => function startGame(state) {
      return Object.assign({}, state, {started: true})
    })
  ),

  // intents.solveStep$.pipe(
  //   map(_ => function(state) {
  //     return Object.assign({}, state, {score: state.score + 1})
  //   })
  // ),

  intents.endGame$.pipe(
    map(_ => function endGame(state) {
      return Object.assign({}, state, {ended: true})
    })
  ),


  intents.solveStep$.pipe(
    map(color => function(state) {
      return Object.assign({}, state, {customСlicks: state.customСlicks.concat(color)})
    })
  ),
)


/*
  Subject
*/

let actionPool$ = new Subject()
let actions$ = merge(actionPool$, action$)



/*
  State block (depends on action)
*/

let state$ = actions$.pipe(
  scan((state, changeFun) => changeFun(state), initialState)
)

state$.subscribe(state => {
  console.log(state);

  if (state.customСlicks >= state.expectedClicks) {
    console.log(`true`);

    actionPool$.next((state) => Object.assign({}, state, {ended: true}))    
  }

  renderToDom(state);
})

/*
  Render block
*/

// state$.subscribe(state => 
//   renderToDom(state)
//   // console.log(state)
// );
