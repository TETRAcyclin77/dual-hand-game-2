import React from 'react';
import { ACTION_KEYS, PUZZLE_KEYS } from '../state/useKeyInput.js';

const ACTION_LABELS = { w: '↑', a: '←', s: '↓', d: '→' };
const PUZZLE_LABELS = { i: '↑', j: '←', k: '↓', l: '→' };

export default function HUDLayer({ hp, maxHp, playerStatus, pressed, puzzleActive }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <HpBar hp={hp} maxHp={maxHp} />
        {playerStatus.speedMultiplier > 1 && (
          <div
            style={{
              background: 'var(--bg-panel)',
              border: '1px solid var(--hand-l)',
              color: 'var(--hand-l)',
              padding: '0.3rem 0.6rem',
              borderRadius: 4,
              fontSize: '0.75rem',
            }}
          >
            SPEED x{playerStatus.speedMultiplier}
          </div>
        )}
      </div>

      {/* signature: 左手/右手 同時入力インジケーター */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem' }}>
        <HandIndicator
          title="LEFT / ACTION"
          color="var(--hand-l)"
          keys={ACTION_KEYS}
          labels={ACTION_LABELS}
          pressed={pressed}
          dimmed={false}
        />
        <HandIndicator
          title="RIGHT / PUZZLE"
          color="var(--hand-r)"
          keys={PUZZLE_KEYS}
          labels={PUZZLE_LABELS}
          pressed={pressed}
          dimmed={!puzzleActive}
        />
      </div>
    </div>
  );
}

function HpBar({ hp, maxHp }) {
  const ratio = Math.max(0, hp / maxHp);
  return (
    <div style={{ width: 180 }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-lo)', marginBottom: 2 }}>HP</div>
      <div style={{ height: 10, background: 'var(--bg-panel)', borderRadius: 4, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${ratio * 100}%`,
            background: ratio > 0.35 ? 'var(--hand-l)' : 'var(--danger)',
            transition: 'width 0.2s ease',
          }}
        />
      </div>
    </div>
  );
}

function HandIndicator({ title, color, keys, labels, pressed, dimmed }) {
  // 十字配置: 上段中央=w/i, 下段=a s d / j k l
  const layout = [
    [null, keys[0], null],
    [keys[1], keys[2], keys[3]],
  ];
  return (
    <div style={{ opacity: dimmed ? 0.3 : 1, textAlign: 'center' }}>
      <div style={{ fontSize: '0.65rem', color, letterSpacing: '0.15em', marginBottom: 4 }}>
        {title}
      </div>
      {layout.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 4 }}>
          {row.map((k, ci) =>
            k ? (
              <div
                key={ci}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 4,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '0.7rem',
                  border: `1px solid ${color}`,
                  color: pressed.has(k) ? 'var(--bg-void)' : color,
                  background: pressed.has(k) ? color : 'transparent',
                  boxShadow: pressed.has(k) ? `0 0 10px ${color}` : 'none',
                  transition: 'all 0.05s ease',
                }}
              >
                {labels[k]}
              </div>
            ) : (
              <div key={ci} style={{ width: 26, height: 26 }} />
            )
          )}
        </div>
      ))}
    </div>
  );
}
