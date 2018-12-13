import React, { useReducer, useEffect } from 'react'

import { condCat } from '../utils'

import './Grid.css'

const FOCUS_COORDINATE = 'FOCUS_COORDINATE'
const UPDATE_COORDINATE = 'UPDATE_COORDINATE'

const solvedPuzzle = [
  [2, 3, 1, 4, 5, 9, 6, 7, 8],
  [4, 5, 7, 6, 3, 8, 9, 2, 1],
  [8, 9, 6, 7, 1, 2, 3, 5, 4],
  [5, 7, 2, 3, 8, 6, 1, 4, 9],
  [3, 6, 4, 1, 7, 9, 2, 8, 5],
  [9, 1, 8, 5, 2, 4, 7, 3, 6],
  [1, 8, 3, 9, 4, 7, 5, 6, 2],
  [6, 2, 9, 8, 5, 3, 4, 1, 7],
  [7, 4, 5, 2, 6, 1, 8, 9, 3]
]

const _ = null

const initialPuzzle = [
  [2, _, _, _, _, _, 6, 7, _],
  [4, 5, _, _, _, _, _, _, 1],
  [_, 9, _, 7, _, _, _, _, _],
  [5, 7, 2, 3, 8, 6, 1, 4, 9],
  [3, 6, 4, 1, 7, 9, 2, 8, 5],
  [9, 1, 8, 5, 2, 4, 7, 3, 6],
  [1, 8, 3, 9, 4, 7, 5, 6, 2],
  [6, 2, 9, 8, 5, 3, 4, 1, 7],
  [7, 4, 5, 2, 6, 1, 8, 9, 3]
]

const initialState = {
  activeSquare: [0, 0],
  puzzle: initialPuzzle
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case FOCUS_COORDINATE:
      return {...state, activeSquare: payload}
    case UPDATE_COORDINATE:
      const { activeSquare, puzzle } = state
      const updatedPuzzle = updateSquare(puzzle, activeSquare, payload)
      console.log(payload, updatedPuzzle)
      return {...state, puzzle: updatedPuzzle}
    default:
      return state
  }
}

const isActive = (x, y, [activeX, activeY]) => (
  x === activeX && y === activeY
)

const getSquare = (x, y, puzzle) => puzzle[x][y]

const updateSquare = (puzzle, [x, y], newValue) => {
  const updatedRow = puzzle[y].map((value, column) => (
    column === x ? newValue : value
  ))

  return [...puzzle.slice(0, y), updatedRow, ...puzzle.slice(y + 1)]
}

const Grid = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    function setSquare(event) {
      const keyValue = Number(event.key)
      if (keyValue > 0) {
        dispatch({type: UPDATE_COORDINATE, payload: keyValue})
      }
    }

    document.body.addEventListener('keypress', setSquare)

    return () => {
      document.body.removeEventListener('keypress', setSquare)
    }
  })

  return (
    <main className='Grid__container'>
      {
        Array(9).fill(0).map((_, y) => (
          <section className='Grid__region' key={y}>
            {
              Array(9).fill(0).map((_, x) => (
                <span
                  className={condCat(
                    'Grid__cell',
                    {'Grid__cell--focused': isActive(x, y, state.activeSquare)}
                  )}
                  onClick={() => {
                    dispatch({type: FOCUS_COORDINATE, payload: [x, y]})
                  }}
                  key={x}
                >{getSquare(x, y, state.puzzle)}</span>
              ))
            }
          </section>
        ))
      }
    </main>
  )
}

export default Grid
