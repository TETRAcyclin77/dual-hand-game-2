import React, { useEffect, useRef, useState } from 'react';
import { SCENARIOS } from '../data/scenarios.js';

const TYPE_SPEED_MS = 28;

export default function NovelScreen({ scenarioId, onFinished }) {
  const lines = SCENARIOS[scenarioId] ?? [];
  const [lineIndex, setLineIndex] = useState(0);
  const [shown, setShown] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const timerRef = useRef(null);

  const current = lines[lineIndex];

  useEffect(() => {
    if (!current) return;
    setShown('');
    setIsTyping(true);
    let i = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      i += 1;
      setShown(current.text.slice(0, i));
      if (i >= current.text.length) {
        clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, TYPE_SPEED_MS);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIndex, scenarioId]);

  const advance = () => {
    if (isTyping) {
      // タイプ中ならスキップして全文表示
      clearInterval(timerRef.current);
      setShown(current.text);
      setIsTyping(false);
      return;
    }
    if (lineIndex + 1 < lines.length) {
      setLineIndex((i) => i + 1);
    } else {
      onFinished();
    }
  };

  if (!current) return null;

  return (
    <div
      onClick={advance}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        cursor: 'pointer',
        background:
          'linear-gradient(180deg, transparent 0%, transparent 55%, rgba(0,0,0,0.55) 100%)',
      }}
    >
      <div
        style={{
          margin: '0 2rem 2.5rem',
          background: 'var(--bg-panel)',
          border: '1px solid var(--line-hair)',
          borderRadius: 6,
          padding: '1.25rem 1.5rem',
          minHeight: 120,
        }}
      >
        <div
          style={{
            color: 'var(--hand-r)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            marginBottom: '0.6rem',
            letterSpacing: '0.05em',
          }}
        >
          {current.speaker}
        </div>
        <p style={{ margin: 0, lineHeight: 1.8, fontSize: '1rem', minHeight: '3.6rem' }}>
          {shown}
          {isTyping && <span className="novel-cursor">▌</span>}
        </p>
        <div style={{ textAlign: 'right', color: 'var(--text-lo)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
          クリック / タップで進む
        </div>
      </div>
      <style>{`
        .novel-cursor {
          animation: blink 0.9s steps(1) infinite;
          margin-left: 2px;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
