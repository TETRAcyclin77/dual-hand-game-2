import React from 'react';
import { TOTAL_STAGES } from '../state/useAppProgress.js';

export default function StageSelectScreen({ clearedStages, maxUnlockedStage, onChooseStage }) {
  const stages = Array.from({ length: TOTAL_STAGES }, (_, i) => i + 1);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            letterSpacing: '0.35em',
            color: 'var(--text-lo)',
            marginBottom: '0.5rem',
          }}
        >
          STAGE SELECT
        </div>
        <h2 style={{ fontSize: '1.6rem' }}>
          <span style={{ color: 'var(--hand-l)' }}>挑戦する</span>
          <span style={{ color: 'var(--text-lo)', fontWeight: 400 }}> エリアを選択</span>
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 88px)',
          gap: '0.9rem',
        }}
      >
        {stages.map((n) => {
          const isCleared = clearedStages.includes(n);
          const isUnlocked = n <= maxUnlockedStage;
          return (
            <button
              key={n}
              disabled={!isUnlocked}
              onClick={() => onChooseStage(n)}
              style={{
                position: 'relative',
                height: 88,
                borderRadius: 6,
                border: `1px solid ${
                  isCleared ? 'var(--hand-r)' : isUnlocked ? 'var(--hand-l)' : 'var(--line-hair)'
                }`,
                background: 'var(--bg-panel)',
                color: isUnlocked ? 'var(--text-hi)' : 'var(--text-lo)',
                fontSize: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.4,
                transition: 'transform 0.1s ease, box-shadow 0.15s ease',
                boxShadow: isCleared ? '0 0 12px rgba(79,224,200,0.35)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (isUnlocked) e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>{n}</span>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                {isCleared ? 'CLEAR' : isUnlocked ? 'READY' : 'LOCK'}
              </span>
            </button>
          );
        })}
      </div>

      <p style={{ color: 'var(--text-lo)', fontSize: '0.78rem' }}>
        クリア済みの最大ステージの次まで挑戦できます。
      </p>
    </div>
  );
}
