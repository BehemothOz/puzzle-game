// State

/*
  rectangles - кол-во прямоугольников на экране
  expectedClicks - ожидаемая последовательность кликов (будет увеличиваться / будет проверятся с пользовательской последовательностью)
  actualClicks - последовательность, вводимая пользователем
  score - счет (увеличиваетсяна единицу)
  started - начало игры (true - старт игры)
  ended - конец игры (true - конец игры)

  TODO - окончание игры как win
*/

let initialState = {
  rectangles: [`orange`, `blue`, `red`, `green`],
  expectedClicks: [`orange`, `blue`, `red`, `green`],
  actualClicks: [],
  score: 0,
  started: true,
  ended: false,

  glare: {}
}

export default initialState;
