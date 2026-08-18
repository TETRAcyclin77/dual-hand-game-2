import React from 'react';
import { CELL } from './SideViewGrid.jsx';

function KiAttacks({ attacks }) {
  return (
    <>
      {attacks.map((a) => (
        <div
          key={a.id}
          style={{
            position: 'absolute',
            left: a.x * CELL + CELL * 0.3,
            top: a.y * CELL + CELL * 0.3,
            width: CELL * 0.4,
            height: CELL * 0.4,
            borderRadius: '50%',
            background: 'var(--danger)',
            boxShadow: '0 0 10px 2px rgba(226,83,76,0.7)',
          }}
        />
      ))}
    </>
  );
}

export default React.memo(KiAttacks);
