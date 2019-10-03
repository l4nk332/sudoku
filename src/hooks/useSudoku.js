import { useReducer, useEffect } from "react";

import {
  isImmutableSquare,
  shiftFocus,
  updateCell,
  findInitialActiveCell
} from "../utils";
import { ARROW_MAP, DELETE_KEYS, LEVEL_1 } from "../constants";
import { PUZZLES } from "../data/puzzles";

export const ACT = {
  FOCUS_COORDINATE: "FOCUS_COORDINATE",
  UPDATE_COORDINATE: "UPDATE_COORDINATE",
  UNDO: "UNDO",
  REDO: "REDO",
  RESET: "RESET"
};

const pushTimeline = ({ timeline, timelineIdx, frame }) => ({
  timeline: [...timeline.slice(0, timelineIdx + 1), frame],
  timelineIdx: timelineIdx + 1,
  canRedo: false,
  canUndo: true
})

const reducer = (state, { type, payload }) => {
  const { activeCell, puzzle } = state;

  switch (type) {
    case ACT.FOCUS_COORDINATE:
      return isImmutableSquare(PUZZLES[state.level].initial, payload)
        ? state
        : { ...state, activeCell: payload };
    case ACT.UPDATE_COORDINATE:
      if (isImmutableSquare(PUZZLES[state.level].initial, activeCell)) {
        return state
      } else {
        const updatedPuzzle = updateCell(puzzle, activeCell, payload)

        return {
          ...state,
          puzzle: updatedPuzzle,
          ...pushTimeline({
            timeline: state.timeline,
            timelineIdx: state.timelineIdx,
            frame: updatedPuzzle
          })
        }
      }
    case ACT.RESET:
      return {
        ...state,
        puzzle: state.timeline[0],
        ...pushTimeline({
          timeline: state.timeline,
          timelineIdx: state.timelineIdx,
          frame: state.timeline[0]
        })
      }
    case ACT.UNDO:
      return {
        ...state,
        puzzle: state.timeline[state.timelineIdx - 1],
        timelineIdx: state.timelineIdx - 1,
        canUndo: state.timelineIdx - 1 > 0,
        canRedo: true
      }
    case ACT.REDO:
      return {
        ...state,
        puzzle: state.timeline[state.timelineIdx + 1],
        timelineIdx: state.timelineIdx + 1,
        canUndo: true,
        canRedo: state.timelineIdx + 1 < state.timeline.length - 1
      }
    default:
      return state;
  }
};

const useSudoku = () => {
  const initialLevel = LEVEL_1
  const initialPuzzle = PUZZLES[initialLevel].initial

  const [state, dispatch] = useReducer(reducer, {
    level: initialLevel,
    puzzle: initialPuzzle,
    activeCell: findInitialActiveCell(initialPuzzle),
    canUndo: false,
    canRedo: false,
    timeline: [initialPuzzle],
    timelineIdx: 0
  });

  useEffect(() => {
    function setCell({ key, keyCode }) {
      const { activeCell, level } = state;
      const numericKey = Number(key);

      if (numericKey > 0) {
        dispatch({ type: ACT.UPDATE_COORDINATE, payload: numericKey });
      }

      if (DELETE_KEYS.includes(String(keyCode))) {
        dispatch({ type: ACT.UPDATE_COORDINATE, payload: null });
      }

      if (Object.keys(ARROW_MAP).includes(String(keyCode))) {
        dispatch({
          type: ACT.FOCUS_COORDINATE,
          payload: shiftFocus(
            square => !isImmutableSquare(PUZZLES[level].initial, square),
            activeCell,
            ARROW_MAP[keyCode]
          )
        });
      }
    }

    document.body.addEventListener("keydown", setCell);

    return () => {
      document.body.removeEventListener("keydown", setCell);
    };
  });

  return [state, dispatch];
};

export default useSudoku;
