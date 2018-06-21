function initGame(state) {
  // Вспомогательная функция: фильтрация кликов (только на прямоугольниках)
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
  let sequenceComparison$ = clickRectangle$.pipe(
    bufferCount(state.expectedClicks.length),
    flatMap(sequence => {
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