import React from 'react';

export default function TitleScreen({ hasSave, onStartNew, onContinue }) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5rem',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            letterSpacing: '0.4em',
            color: 'var(--text-lo)',
            marginBottom: '0.75rem',
          }}
        >
          DUAL HAND OPERATION
        </div>
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            display: 'flex',
            gap: '0.4em',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: 'var(--hand-l)' }}>左手起動</span>
          <span style={{ color: 'var(--text-lo)', fontWeight: 400 }}>×</span>
          <span style={{ color: 'var(--hand-r)' }}>右手回路</span>
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', width: 260 }}>
        <button className="title-btn title-btn--primary" onClick={onStartNew}>
          はじめから
        </button>
        <button
          className="title-btn"
          onClick={onContinue}
          disabled={!hasSave}
          style={{ opacity: hasSave ? 1 : 0.35, cursor: hasSave ? 'pointer' : 'not-allowed' }}
        >
          つづきから
        </button>
      </div>

      <p style={{ color: 'var(--text-lo)', fontSize: '0.8rem', maxWidth: 420, textAlign: 'center' }}>
        左手 <KeyHint keys={['W', 'A', 'S', 'D']} color="var(--hand-l)" /> でアクション、
        右手 <KeyHint keys={['J', 'I', 'K', 'L']} color="var(--hand-r)" /> でパズル。
        両方を同時にこなしてください。
      </p>

      <style>{`
        .title-btn {
          background: var(--bg-panel);
          border: 1px solid var(--line-hair);
          color: var(--text-hi);
          padding: 0.85rem 1rem;
          font-size: 1rem;
          letter-spacing: 0.08em;
          border-radius: 4px;
          transition: border-color 0.15s ease, transform 0.1s ease;
        }
        .title-btn:hover:not(:disabled) {
          border-color: var(--hand-r);
          transform: translateY(-1px);
        }
        .title-btn--primary {
          border-color: var(--hand-l);
        }
        .title-btn--primary:hover {
          border-color: var(--hand-l);
          box-shadow: 0 0 0 1px var(--hand-l);
        }
      `}</style>
    </div>
  );
}

function KeyHint({ keys, color }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', verticalAlign: 'middle' }}>
      {keys.map((k) => (
        <kbd
          key={k}
          style={{
            border: `1px solid ${color}`,
            color,
            borderRadius: 3,
            padding: '0 4px',
            fontSize: '0.75rem',
          }}
        >
          {k}
        </kbd>
      ))}
    </span>
  );
}
