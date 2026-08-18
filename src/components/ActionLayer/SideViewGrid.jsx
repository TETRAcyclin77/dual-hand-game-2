import React from 'react';
import { GRID_COLS, GRID_ROWS } from '../../state/useActionState.js';

export const CELL = 64;

export default function SideViewGrid() {
  const cells = [];
  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      cells.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: 'absolute',
            left: x * CELL,
            top: y * CELL,
            width: CELL,
            height: CELL,
            border: '1px solid var(--line-hair)',
          }}
        />
      );
    }
  }
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: GRID_COLS * CELL,
        height: GRID_ROWS * CELL,
      }}
    >
      {cells}
    </div>
  );
}
