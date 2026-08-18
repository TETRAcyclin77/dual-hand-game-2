import React from 'react';
import { PCELL } from './CyberGrid.jsx';

function PathLines({ path }) {
  const points = path.map((p) => {
    const [x, y] = p.split(',').map(Number);
    return `${x * PCELL + PCELL / 2},${y * PCELL + PCELL / 2}`;
  });

  return (
    <svg
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      width={PCELL * 5}
      height={PCELL * 5}
    >
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="var(--hand-r)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 6px var(--hand-r))' }}
      />
    </svg>
  );
}

export default React.memo(PathLines);
