import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useKeyInput } from '../state/useKeyInput.js';
import { useActionState } from '../state/useActionState.js';
import { usePuzzleState } from '../state/usePuzzleState.js';
import { useGameCoordinator } from '../state/useGameCoordinator.js';
import { STAGES } from '../data/stages.js';

import SideViewGrid from './ActionLayer/SideViewGrid.jsx';
import Player from './ActionLayer/Player.jsx';
import KiAttacks from './ActionLayer/KiAttacks.jsx';
import FieldObjects from './ActionLayer/FieldObjects.jsx';

import CyberGrid from './PuzzleLayer/CyberGrid.jsx';
import Nodes from './PuzzleLayer/Nodes.jsx';
import PathLines from './PuzzleLayer/PathLines.jsx';
import PuzzleCursor from './PuzzleLayer/PuzzleCursor.jsx';

import HUDLayer from './HUDLayer.jsx';

const MAX_HP = 100;

const ACTION_VECTORS = { w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
const PUZZLE_VECTORS = { i: [0, -1], k: [0, 1], j: [-1, 0], l: [1, 0] };

export default function GamePlayScreen({ stageNumber, onStageClear }) {
  const stage = STAGES[stageNumber - 1];

  const { pressed, pressedRef } = useKeyInput();
  const [hp] = useState(MAX_HP);

  const {
    playerPos,
    playerStatus,
    kiAttacks,
    fieldObjects,
    tryMove,
    applySpeedBuff,
    warpTo,
    removeFieldObject,
  } = useActionState(stage.fieldObjects, stage.kiAttacks);

  const puzzle = usePuzzleState(stage.puzzle.nodes);

  useGameCoordinator({
    playerPos,
    fieldObjects,
    removeFieldObject,
    applySpeedBuff,
    warpTo,
    activatePuzzle: puzzle.activate,
  });

  // --- アクション層: 押されている間、クールダウンを尊重しながら連続移動 ---
  const rafRef = useRef(null);
  useEffect(() => {
    const loop = () => {
      const keys = pressedRef.current;
      for (const k of Object.keys(ACTION_VECTORS)) {
        if (keys.has(k)) {
          const [dx, dy] = ACTION_VECTORS[k];
          tryMove(dx, dy);
          break; // 1フレーム1方向のみ
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tryMove]);

  // --- パズル層: JIKL は1タップ = 1マス移動（keydownで発火） ---
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (!puzzle.isActive || !(key in PUZZLE_VECTORS)) return;
      const [dx, dy] = PUZZLE_VECTORS[key];
      puzzle.moveCursor(dx, dy);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle.isActive, puzzle.moveCursor]);

  // パズルクリア -> 敵撃破 -> ステージクリア
  useEffect(() => {
    if (!puzzle.isCleared) return;
    const t = setTimeout(() => {
      puzzle.deactivate();
      onStageClear(stageNumber);
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle.isCleared]);

  const gridSize = useMemo(() => ({ width: 640, height: 448 }), []);

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          letterSpacing: '0.3em',
          color: 'var(--text-lo)',
        }}
      >
        STAGE {String(stageNumber).padStart(2, '0')}
      </div>
      <div
        style={{
          position: 'relative',
          width: gridSize.width,
          height: gridSize.height,
          border: '1px solid var(--line-hair)',
          background: 'var(--bg-panel)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {/* ActionLayer */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
          <SideViewGrid />
          <FieldObjects objects={fieldObjects} />
          <KiAttacks attacks={kiAttacks} />
          <Player position={playerPos} status={playerStatus} />
        </div>

        {/* PuzzleLayer: パズル起動アイテムに触れたときのみ前面表示 */}
        {puzzle.isActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              background: 'rgba(10,14,23,0.88)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div style={{ position: 'relative' }}>
              <CyberGrid />
              <Nodes nodes={stage.puzzle.nodes} />
              <PathLines path={puzzle.path} />
              <PuzzleCursor cursor={puzzle.cursor} />
            </div>
            {puzzle.isCleared && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 24,
                  color: 'var(--hand-r)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.1em',
                }}
              >
                ROUTE CONNECTED
              </div>
            )}
          </div>
        )}

        {/* HUD */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 30 }}>
          <HUDLayer
            hp={hp}
            maxHp={MAX_HP}
            playerStatus={playerStatus}
            pressed={pressed}
            puzzleActive={puzzle.isActive}
          />
        </div>
      </div>
    </div>
  );
}
