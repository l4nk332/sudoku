import React, { useCallback } from "react";

import useSudoku, { ACT } from "../hooks/useSudoku";

import { Grid } from "../components";

const Sudoku = () => {
  const [
    { activeCell, level, puzzle, canRedo, canUndo },
    dispatch
  ] = useSudoku();

  const undo = useCallback(() => dispatch({ type: ACT.UNDO }));
  const redo = useCallback(() => dispatch({ type: ACT.REDO }));
  const reset = useCallback(() => dispatch({ type: ACT.RESET }));
  const onCellClick = useCallback(coord =>
    dispatch({ type: ACT.FOCUS_COORDINATE, payload: coord })
  );

  return (
    <section>
      <section>
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
        <button onClick={reset}>Reset</button>
      </section>
      <Grid {...{ activeCell, level, puzzle, onCellClick }} />
    </section>
  );
};

export default Sudoku;
