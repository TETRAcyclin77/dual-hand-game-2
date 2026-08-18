import React from 'react';
import { PUZZLE_COLS, PUZZLE_ROWS } from '../../state/usePuzzleState.js';

export const PCELL = 52;

export default function CyberGrid() {
  const lines = [];
  for (let i = 0; i <= PUZZLE_COLS; i++) {
    lines.push(
      <line
        key={`v${i}`}
        x1={i * PCELL}
        y1={0}
        x2={i * PCELL}
        y2={PUZZLE_ROWS * PCELL}
        stroke="var(--hand-r)"
        strokeOpacity="0.18"
      />
    );
  }
  for (let j = 0; j <= PUZZLE_ROWS; j++) {
    lines.push(
      <line
        key={`h${j}`}
        x1={0}
        y1={j * PCELL}
        x2={PUZZLE_COLS * PCELL}
        y2={j * PCELL}
        stroke="var(--hand-r)"
        strokeOpacity="0.18"
      />
    );
  }
  return (
    <svg
      width={PUZZLE_COLS * PCELL}
      height={PUZZLE_ROWS * PCELL}
      style={{ position: 'absolute', inset: 0 }}
    >
      {lines}
    </svg>
  );
}
