import * as R from 'ramda';

import { map, filter, scan, flatMap, delay } from 'rxjs/operators';
import { Observable, Subject, fromEvent, pipe, of, from, merge, interval } from 'rxjs';


// State
let initialState = {
  rectangles: [`orange`, `blue`, `red`, `green`],
  expectedClicks: [`orange`, `blue`, `red`, `green`],
  actualClicks: [],
  score: 0,
  started: true,
  ended: false,

  glare: {}
// '    {
//       name: `orange`,
//       glare: false,
//     },
//     {
//       name: `blue`,
//       glare: false,
//     },
//     {
//       name: `red`,
//       glare: false,
//     },
//     {
//       name: `green`,
//       glare: false,
//     }'
//   ],
}

// DOM
let renderGameScreen = (state) => {
  return `<div class="screen-rectangles">
            ${state.rectangles
              .map(color => `<div class="rectangle ${color}
                ${color == state.glare.name && state.glare.glare ? 'active': ''}" data-color="${color}"></div>`)
              .join('')
            }
          </div>`;
}

let renderToDom = (state) => {
  app.innerHTML = renderGameScreen(state);
}

// Call
renderToDom(initialState);




// Blick
let makePayload = (n) => {
  return R.range(0, n).map((x, i) => {
    return i % 2 ? false : true;
  })
}

// console.log(makePayload(8))

let withPauses = (payload, t1, t2) => {
  return payload.reduce((z, x, i) => {
    return [...z, [x, ((Math.ceil(i / 2) * t1) + Math.floor(i / 2) * t2)]]
    // return [...z, [x]]
    // console.log(`z: ` + z);
    // console.log(`x: ` + x);
    // console.log(`i: ` + i);
  }, [])
}


let qwerty = (ps2) => {
  return initialState.expectedClicks.map(x => console.log(x))
}

let makeBlinking = (state, n, t1, t2) => {
// let makeBlinking = () => {

  // console.log(state)

  // let ps1 = makePayload(n) // [true, false, true, false...{2 * N times}]
  // let ps2 = withPauses(ps1, t1, t2) // [[true, 0], [false, 10], [true, 60], [false, 70] ...]
  // let ps3 = qwerty(ps2);

  let qq = [[`orange`, true, 0], [`orange`, false, 1000], [`blue`, true, 3000], [`blue`, false, 4000]];
  // let qq = [[true, 0], [false, 1000], [true, 3000], [false, 4000]];
  // console.log(ps2);

  // return from(ps2).pipe(
  return from(qq).pipe(
    // flatMap(([x, d]) => of(x).pipe(delay(d))),
    flatMap(([x, d, z]) => of({name: x, glare: d}).pipe(delay(z))),
  ) // 1-0---1-0---1-0--->
}

// let blink$ = makeBlinking(initialState, 8, 1000, 2000) // 10 is a BRIGHT delay; 50 is a MUTED delay
let blink$ = makeBlinking();

let blink$2 = blink$.pipe(
  map(obj => function startGame(state) {
    return Object.assign({}, state, {glare: obj});
    // console.log(obj);
  })
)

  // State block (depends on action)
let state$ = blink$2.pipe(
  scan((state, changeFun) => changeFun(state), initialState)
)

state$.subscribe(x => {
  console.log(x)
  renderToDom(x);
  // initialState.expectedClicks.forEach((color) => {
  //   let rect = document.querySelector(`.rectangle[data-color="${color}"]`);
  //   x(rect)
  //   // console.log(rect)
  // })
  
  // console.log(x, new Date().toISOString())
})
