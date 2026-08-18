import React from 'react';
import { CELL } from './SideViewGrid.jsx';

function Player({ position, status }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x * CELL,
        top: position.y * CELL,
        width: CELL,
        height: CELL,
        transition: 'left 0.09s linear, top 0.09s linear',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        style={{
          width: CELL * 0.6,
          height: CELL * 0.6,
          borderRadius: 6,
          background: 'var(--hand-l)',
          boxShadow:
            status.speedMultiplier > 1
              ? '0 0 16px 4px var(--hand-l)'
              : '0 0 8px 1px rgba(242,166,90,0.5)',
        }}
      />
    </div>
  );
}

export default React.memo(Player);
