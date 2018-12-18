import React, { useReducer, useEffect } from 'react'

import { condCat } from '../utils'
import { PUZZLES } from '../data/puzzles'

import './Grid.css'

const FOCUS_COORDINATE = 'FOCUS_COORDINATE'
const UPDATE_COORDINATE = 'UPDATE_COORDINATE'

const initialState = {
  activeCell: [0, 0],
  puzzle: PUZZLES.LEVEL_1.initial
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case FOCUS_COORDINATE:
      return {...state, activeCell: payload}
    case UPDATE_COORDINATE:
      const { activeCell, puzzle } = state
      const updatedPuzzle = updateCell(puzzle, activeCell, payload)
      return {...state, puzzle: updatedPuzzle}
    default:
      return state
  }
}

const isActive = (region, cell, [activeRegion, activeCell]) => (
  region === activeRegion && cell === activeCell
)

const getCell = (region, cell, puzzle) => puzzle[region][cell]

const updateCell = (puzzle, [region, cell], newValue) => {
  const updatedRegion = puzzle[region].map((value, regionCell) => (
    regionCell === cell ? newValue : value
  ))

  return [...puzzle.slice(0, region), updatedRegion, ...puzzle.slice(region + 1)]
}

const ARROW_MAP = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  72: 'left',
  75: 'up',
  76: 'right',
  74: 'down'
}

const shiftLeft = (activeCell) => {
  const [region, cell] = activeCell
  const isEdgeRegion = region % 3 === 0
  const isEdgeCell = cell % 3 === 0

  if (isEdgeRegion && isEdgeCell) {
    return [region + 2, cell + 2]
  } else if (isEdgeCell) {
    return [region - 1, cell + 2]
  } else {
    return [region, cell - 1]
  }
}

const shiftUp = (activeCell) => {
  const [region, cell] = activeCell
  const isEdgeRegion = region < 3
  const isEdgeCell = cell < 3

  if (isEdgeRegion && isEdgeCell) {
    return [region + 6, cell + 6]
  } else if (isEdgeCell) {
    return [region - 3, cell + 6]
  } else {
    return [region, cell - 3]
  }
}

const shiftRight = (activeCell) => {
  const [region, cell] = activeCell
  const isEdgeRegion = [2, 5, 8].includes(region)
  const isEdgeCell = [2, 5, 8].includes(cell)

  if (isEdgeRegion && isEdgeCell) {
    return [region - 2, cell - 2]
  } else if (isEdgeCell) {
    return [region + 1, cell - 2]
  } else {
    return [region, cell + 1]
  }
}

const shiftDown = (activeCell) => {
  const [region, cell] = activeCell
  const isEdgeRegion = region > 5
  const isEdgeCell = cell > 5

  if (isEdgeRegion && isEdgeCell) {
    return [region - 6, cell - 6]
  } else if (isEdgeCell) {
    return [region + 3, cell - 6]
  } else {
    return [region, cell + 3]
  }
}

const shiftFocus = (activeCell, direction) => ({
  left: shiftLeft,
  up: shiftUp,
  right: shiftRight,
  down: shiftDown
}[direction](activeCell))

const Grid = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    function setCell({key, keyCode}) {
      const numericKey = Number(key)
      if (numericKey > 0) {
        dispatch({type: UPDATE_COORDINATE, payload: numericKey})
      }

      if (Object.keys(ARROW_MAP).includes(String(keyCode))) {
        dispatch({
          type: FOCUS_COORDINATE,
          payload: shiftFocus(state.activeCell, ARROW_MAP[keyCode])
        })
      }

      if (['8', '88'].includes(String(keyCode))) {
        dispatch({type: UPDATE_COORDINATE, payload: null})
      }
    }

    document.body.addEventListener('keydown', setCell)

    return () => {
      document.body.removeEventListener('keydown', setCell)
    }
  })

  return (
    <main className='Grid__container'>
      {
        Array(9).fill(0).map((_, region) => (
          <section className='Grid__region' key={region}>
            {
              Array(9).fill(0).map((_, cell) => (
                <span
                  className={condCat(
                    'Grid__cell',
                    {'Grid__cell--focused': isActive(region, cell, state.activeCell)}
                  )}
                  onClick={() => {
                    dispatch({type: FOCUS_COORDINATE, payload: [region, cell]})
                  }}
                  key={cell}
                >{getCell(region, cell, state.puzzle)}</span>
              ))
            }
          </section>
        ))
      }
    </main>
  )
}

export default Grid
