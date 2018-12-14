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
      console.log(payload, updatedPuzzle)
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

const Grid = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    function setCell(event) {
      const keyValue = Number(event.key)
      if (keyValue > 0) {
        dispatch({type: UPDATE_COORDINATE, payload: keyValue})
      }
    }

    document.body.addEventListener('keypress', setCell)

    return () => {
      document.body.removeEventListener('keypress', setCell)
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
