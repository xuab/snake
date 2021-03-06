import R from 'ramda'
import { mod, randomElement, range } from './utils.js'

const point = R.curry((x, y) => ({ x, y }))

const allPoints = (cols, rows) => R.chain(
  (x) => R.map(point(x), range(rows)),
  range(cols),
)

const direction = {
  NORTH: point(0, -1),
  SOUTH: point(0, 1),
  WEST: point(-1, 0),
  EAST: point(1, 0),
}

export const initialState = {
  snake: [point(2, 2)],
  apple: point(5, 5),
  move: direction.EAST,
  score: 0,
}

const addMove = R.curry((direction, state) =>
  isValidMove(direction, state.move)
    ? { ...state, move: direction }
    : state
)

const isValidMove = (direction, move) =>
  direction.x + move.x !== 0 && direction.y + move.y !== 0

export const up = addMove(direction.NORTH)
export const left = addMove(direction.WEST)
export const down = addMove(direction.SOUTH)
export const right = addMove(direction.EAST)

const nextSnake = R.curry((cols, rows, state) =>
  willCrash(cols, rows, state)
    ? initialState
    : willEat(nextHead(cols, rows, state), state.apple)
      ? {
          ...state,
          score: state.score + 1,
          snake: [nextHead(cols, rows, state), ...state.snake],
        }
      : {
          ...state,
          snake: [nextHead(cols, rows, state), ...R.dropLast(1, state.snake)],
        }
)

const willEat = R.equals
const willCrash = (cols, rows, state) =>
  R.find(R.equals(nextHead(cols, rows, state)))(state.snake)

const nextHead = (cols, rows, { move, snake }) =>
  point(
    mod(cols, R.head(snake).x + move.x),
    mod(rows, R.head(snake).y + move.y)
  )

const nextApple = R.curry((cols, rows, state) =>
  willEat(R.head(state.snake), state.apple)
    ? { ...state, apple: randomPoint(cols, rows, state) }
    : state
)

const randomPoint = (cols, rows, state) => R.pipe(
  allPoints,
  R.filter((p) => !state.snake.some(R.equals(p))),
  randomElement,
)(cols, rows)

export const step = R.curry((cols, rows, state) =>
  R.pipe(nextSnake(cols, rows), nextApple(cols, rows))(state)
)
