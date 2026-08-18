import React from 'react';
import { PCELL } from './CyberGrid.jsx';

function PuzzleCursor({ cursor }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: cursor.x * PCELL,
        top: cursor.y * PCELL,
        width: PCELL,
        height: PCELL,
        border: '2px solid var(--hand-r)',
        borderRadius: 6,
        boxShadow: '0 0 14px 2px var(--hand-r)',
        transition: 'left 0.08s linear, top 0.08s linear',
      }}
    />
  );
}

export default React.memo(PuzzleCursor);
