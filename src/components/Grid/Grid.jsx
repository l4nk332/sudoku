import React from "react";

import useSudoku from "../../hooks/useSudoku";
import { condCat, isImmutableSquare, getCell, isActive } from "../../utils";
import { FOCUS_COORDINATE } from "../../constants";
import { PUZZLES } from "../../data/puzzles";

import "./Grid.css";

const Grid = () => {
  const [state, dispatch] = useSudoku();
  const { activeCell, level } = state;

  return (
    <main className="Grid__container">
      {Array(9)
        .fill(0)
        .map((_, region) => (
          <section className="Grid__region" key={region}>
            {Array(9)
              .fill(0)
              .map((_, cell) => (
                <span
                  className={condCat("Grid__cell", {
                    "Grid__cell--focused":
                      activeCell !== null && isActive(region, cell, activeCell),
                    "Grid__cell--immutable": isImmutableSquare(
                      PUZZLES[level].initial,
                      [region, cell]
                    )
                  })}
                  onClick={() => {
                    dispatch({
                      type: FOCUS_COORDINATE,
                      payload: [region, cell]
                    });
                  }}
                  key={cell}
                >
                  {getCell(region, cell, state.puzzle)}
                </span>
              ))}
          </section>
        ))}
    </main>
  );
};

export default Grid;
