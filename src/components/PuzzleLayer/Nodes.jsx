import React from 'react';
import { PCELL } from './CyberGrid.jsx';

const NODE_STYLE = {
  start: { color: 'var(--hand-r)', label: 'IN' },
  goal: { color: '#9a8cff', label: 'OUT' },
  wall: { color: 'var(--danger)', label: '' },
};

function Nodes({ nodes }) {
  return (
    <>
      {nodes.map((n) => {
        const style = NODE_STYLE[n.role];
        return (
          <div
            key={`${n.x}-${n.y}-${n.role}`}
            style={{
              position: 'absolute',
              left: n.x * PCELL,
              top: n.y * PCELL,
              width: PCELL,
              height: PCELL,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div
              style={{
                width: n.role === 'wall' ? '70%' : '55%',
                height: n.role === 'wall' ? '70%' : '55%',
                borderRadius: n.role === 'wall' ? 4 : '50%',
                border: `2px solid ${style.color}`,
                background: n.role === 'wall' ? 'rgba(226,83,76,0.15)' : 'transparent',
                display: 'grid',
                placeItems: 'center',
                fontSize: '0.6rem',
                color: style.color,
              }}
            >
              {style.label}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default React.memo(Nodes);
