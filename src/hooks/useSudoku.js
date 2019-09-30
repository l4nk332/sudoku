import { useReducer, useEffect } from 'react'

import { isImmutableSquare, shiftFocus, updateCell, findInitialActiveCell } from '../utils'
import { ARROW_MAP, DELETE_KEYS, FOCUS_COORDINATE, UPDATE_COORDINATE, LEVEL_1 } from '../constants'
import { PUZZLES } from '../data/puzzles'

const reducer = (state, { type, payload }) => {
  const { activeCell, puzzle } = state

  switch (type) {
    case FOCUS_COORDINATE:
      return (
        isImmutableSquare(PUZZLES[state.level].initial, payload)
          ? state
          : {...state, activeCell: payload}
      )
    case UPDATE_COORDINATE:
      return (
        isImmutableSquare(PUZZLES[state.level].initial, activeCell)
          ? state
          : {
            ...state,
            puzzle: updateCell(puzzle, activeCell, payload)
          }
      )
    default:
      return state
  }
}

const useSudoku = () => {
  const [state, dispatch] = useReducer(reducer, {
    level: LEVEL_1,
    puzzle: PUZZLES[LEVEL_1].initial,
    activeCell: findInitialActiveCell(PUZZLES[LEVEL_1].initial)
  })

  useEffect(() => {
    function setCell({key, keyCode}) {
      const {activeCell, level} = state
      const numericKey = Number(key)

      if (numericKey > 0) {
        dispatch({type: UPDATE_COORDINATE, payload: numericKey})
      }

      if (DELETE_KEYS.includes(String(keyCode))) {
        dispatch({type: UPDATE_COORDINATE, payload: null})
      }

      if (Object.keys(ARROW_MAP).includes(String(keyCode))) {
        dispatch({
          type: FOCUS_COORDINATE,
          payload: shiftFocus(
            (square) => !isImmutableSquare(PUZZLES[level].initial, square),
            activeCell,
            ARROW_MAP[keyCode]
          )
        })
      }
    }

    document.body.addEventListener('keydown', setCell)

    return () => {
      document.body.removeEventListener('keydown', setCell)
    }
  })

  return [state, dispatch]
}

export default useSudoku
