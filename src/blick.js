import * as R from 'ramda';

import { map, filter, scan, flatMap, delay } from 'rxjs/operators';
import { Observable, Subject, fromEvent, pipe, of, from, merge, interval } from 'rxjs';

import initialState from './data';
import { filterRectangle, getArrayWithRandomElement, playSequence } from './helpers';
import { renderToDom } from './view';

// Anonymous function to prevent the filling of global space
(() => {

  let app = document.querySelector(`#app`);
  let click$ = fromEvent(document, `click`);
  
  renderToDom(initialState);


  // // Block intents
  // let intents = {
  //   startGame$: click$.pipe(
  //     filter(event => event.target.classList.contains(`btn-start`)),
  //     map(_ => true)
  //   ),

  //   solveStep$: click$.pipe(
  //     filter(event => filterRectangle(event.target.dataset.color)),
  //     map(event => event.target),
  //     map(elem => elem.dataset.color)
  //   ),

  //   endGame$: click$.pipe(
  //     filter(event => event.target.classList.contains(`btn-end`)),
  //     map(_ => true)
  //   )
  // }


  // // Action block (depends on intents)
  // let action$ = merge(
  //   intents.startGame$.pipe(
  //     map(_ => function startGame(state) {
  //       return Object.assign({}, state, {started: true})
  //     })
  //   ),

  //   intents.solveStep$.pipe(
  //     map(color => function(state) {
  //       return Object.assign({}, state, {actualClicks: state.actualClicks.concat(color)})
  //     })
  //   )
  // )


  // // Subject
  // let actionPool$ = new Subject();
  // let actions$ = merge(actionPool$, action$);


  // // State block (depends on action)
  // let state$ = actions$.pipe(
  //   scan((state, changeFun) => changeFun(state), initialState)
  // )


  // // Render block
  // state$.subscribe(state => {
  //   console.log(state);
  //   renderToDom(state);

  //   if (!R.isEmpty(state.actualClicks)) {

  //     if (R.startsWith(state.actualClicks, state.expectedClicks) && state.actualClicks.length == state.expectedClicks.length) {
  //       actionPool$.next((state) => {
  //         return Object.assign(
  //           {},
  //           state,
  //           {
  //             expectedClicks: getArrayWithRandomElement(state.expectedClicks),
  //             actualClicks: [],
  //             score: state.score + 1 
  //           }
  //         )
  //       });
  //     }
      
  //     else if (!R.startsWith(state.actualClicks, state.expectedClicks)) {
  //       actionPool$.next((state) => {
  //         return Object.assign(
  //           {},
  //           state,
  //           {
  //             actualClicks: [],
  //             ended: true
  //           }
  //         )
  //       });
  //     }
  //   }
  // });

  // let makePayload = (n) => {
  //   return R.range(0, n).map((x, i) => {
  //     return i % 2 ? true : false;
  //   })
  // }

  // console.log(makePayload(8))
  
  // let withPauses = (payload, t1, t2) => {
  //   return payload.reduce((z, x, i) => {
  //     return [...z, [x, ((Math.ceil(i / 2) * t1) + Math.floor(i / 2) * t2)]]
  //     // return [...z, [x]]
  //     // console.log(`z: ` + z);
  //     // console.log(`x: ` + x);
  //     // console.log(`i: ` + i);
  //   }, [])
  // }
  

  // console.log(withPauses(makePayload(6), 10, 50))
  
  // let makeBlinking = (n, t1, t2) => {
  //   let ps1 = makePayload(n) // [true, false, true, false...{2 * N times}]
  //   let ps2 = withPauses(ps1, t1, t2) // [[true, 0], [false, 10], [true, 60], [false, 70] ...]
  //   return from(ps2).pipe(
  //     flatMap(([x, d]) => of(x).pipe(delay(d))),
  //   ) // 1-0---1-0---1-0--->
  // }
  
  // let blink$ = makeBlinking(8, 1000, 2000) // 10 is a BRIGHT delay; 50 is a MUTED delay
  
  // blink$.subscribe(x => {
  //   // initialState.expectedClicks.forEach((color) => {
  //   //   let rect = document.querySelector(`.rectangle[data-color="${color}"]`);
  //   //   x(rect)
  //   //   // console.log(rect)
  //   // })
    
  //   console.log(x, new Date().toISOString())
  // })

})();