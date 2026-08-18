import React from 'react';
import { CELL } from './SideViewGrid.jsx';

const APPEARANCE = {
  puzzleTrigger: { glyph: '⌬', color: 'var(--hand-r)' },
  speedUp: { glyph: '▲', color: 'var(--hand-l)' },
  warp: { glyph: '◈', color: '#9a8cff' },
};

function FieldObjects({ objects }) {
  return (
    <>
      {objects.map((o) => {
        const look = APPEARANCE[o.type] ?? { glyph: '?', color: 'var(--text-lo)' };
        return (
          <div
            key={o.id}
            title={o.type}
            style={{
              position: 'absolute',
              left: o.x * CELL,
              top: o.y * CELL,
              width: CELL,
              height: CELL,
              display: 'grid',
              placeItems: 'center',
              fontSize: '1.4rem',
              color: look.color,
              textShadow: `0 0 10px ${look.color}`,
              animation: 'field-object-pulse 1.6s ease-in-out infinite',
            }}
          >
            {look.glyph}
          </div>
        );
      })}
      <style>{`
        @keyframes field-object-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default React.memo(FieldObjects);
