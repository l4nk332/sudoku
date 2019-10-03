import React from "react";

import { condCat, isImmutableSquare, getCell, isActive } from "../../utils";
import { PUZZLES } from "../../data/puzzles";

import "./Grid.css";

const Grid = ({ activeCell, level, puzzle, onCellClick }) => (
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
                  onCellClick([region, cell]);
                }}
                key={cell}
              >
                {getCell(region, cell, puzzle)}
              </span>
            ))}
        </section>
      ))}
  </main>
);

export default Grid;
