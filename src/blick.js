import * as R from 'ramda';

import { map, filter, scan, flatMap, delay, elementAt } from 'rxjs/operators';
import { Observable, Subject, fromEvent, pipe, of, from, merge, interval } from 'rxjs';


// State
// let initialState = {
//   rectangles: [`orange`, `blue`, `red`, `green`],
//   expectedClicks: [`orange`, `blue`, `red`, `green`],
//   actualClicks: [],
//   score: 0,
//   started: true,
//   ended: false,

//   glare: {}
// }

// DOM
// let renderGameScreen = (state) => {
//   return `<div class="screen-rectangles">
//             ${state.rectangles
//               .map(color => `<div class="rectangle ${color}
//                 ${color == state.glare.name && state.glare.glare ? 'active': ''}" data-color="${color}"></div>`)
//               .join('')
//             }
//           </div>`;
// }

// let renderToDom = (state) => {
//   app.innerHTML = renderGameScreen(state);
// }

// Call
// renderToDom(initialState);





let makePayload = (n) => {
  return R.range(0, n).map((x, i) => {
    return i % 2 ? false : true;
  })
}

let addTargetBlink = (payload, targets) => {
  let index = 0;

  return payload.map((elem, i) => {
    if (i % 2 == 0 && i != 0 ) index += 1;
    return [targets[index], elem];
  })
}

let withPauses = (payload, t1, t2) => {
  return payload.reduce((z, x, i) => {
    return [...z, [...x, ((Math.ceil(i / 2) * t1) + Math.floor(i / 2) * t2)]]
  }, [])
}

export let makeBlinking = (state, n, t1, t2) => {
  let ps1 = makePayload(n) // [true, false, true, false...{2 * N times}]
  let ps2 = addTargetBlink(ps1, state); // [[target, true], [target, false], [target, true], [target, false]...{2 * N times}]
  let ps3 = withPauses(ps2, t1, t2) // [[target, true, 0], [target, false, 10], [target, true, 60], [target, false, 70] ...]

  return from(ps3).pipe(
    flatMap(([x, d, z]) => of({name: x, glare: d}).pipe(delay(z))),
  )
}

// let blink$ = makeBlinking(initialState.expectedClicks, initialState.expectedClicks.length * 2, 1000, 1000 );

// let blinkAction$ = blink$.pipe(
//   map(obj => function startGame(state) {
//     return Object.assign({}, state, {glare: obj});
//   })
// )

// let state$ = blinkAction$.pipe(
//   scan((state, changeFun) => changeFun(state), initialState)
// )

// state$.subscribe(x => {
//   renderToDom(x);
// })
