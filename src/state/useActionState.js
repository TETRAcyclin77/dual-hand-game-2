import { useCallback, useRef, useState } from 'react';

export const GRID_COLS = 10;
export const GRID_ROWS = 7;
const BASE_MOVE_COOLDOWN_MS = 200;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/**
 * アクションパートの状態。
 * 「速さ」はキー入力のクールダウン（Tick間隔）を操作することで実装する。
 * 通常: 移動後 200ms 入力ブロック。speedUp 中: 100ms に短縮。
 */
export function useActionState(initialFieldObjects = [], initialKiAttacks = []) {
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [playerStatus, setPlayerStatus] = useState({
    speedMultiplier: 1,
    isInvincible: false,
  });
  const [kiAttacks, setKiAttacks] = useState(initialKiAttacks);
  const [fieldObjects, setFieldObjects] = useState(initialFieldObjects);

  const lastMoveAt = useRef(0);
  const speedTimeoutRef = useRef(null);

  const currentCooldownMs = useCallback(() => {
    return BASE_MOVE_COOLDOWN_MS / playerStatus.speedMultiplier;
  }, [playerStatus.speedMultiplier]);

  /** WASD 1タップ分の移動。クールダウン中は無視する。 */
  const tryMove = useCallback(
    (dx, dy) => {
      const now = performance.now();
      if (now - lastMoveAt.current < currentCooldownMs()) return false;
      lastMoveAt.current = now;
      setPlayerPos((p) => ({
        x: clamp(p.x + dx, 0, GRID_COLS - 1),
        y: clamp(p.y + dy, 0, GRID_ROWS - 1),
      }));
      return true;
    },
    [currentCooldownMs]
  );

  /** speedUp バフ: クールダウンを半減させ、durationMs 後に元に戻す */
  const applySpeedBuff = useCallback((multiplier = 2, durationMs = 5000) => {
    setPlayerStatus((s) => ({ ...s, speedMultiplier: multiplier }));
    if (speedTimeoutRef.current) clearTimeout(speedTimeoutRef.current);
    speedTimeoutRef.current = setTimeout(() => {
      setPlayerStatus((s) => ({ ...s, speedMultiplier: 1 }));
    }, durationMs);
  }, []);

  const warpTo = useCallback((x, y) => {
    setPlayerPos({ x: clamp(x, 0, GRID_COLS - 1), y: clamp(y, 0, GRID_ROWS - 1) });
  }, []);

  const removeFieldObject = useCallback((id) => {
    setFieldObjects((list) => list.filter((o) => o.id !== id));
  }, []);

  return {
    playerPos,
    playerStatus,
    kiAttacks,
    fieldObjects,
    setKiAttacks,
    setFieldObjects,
    tryMove,
    applySpeedBuff,
    warpTo,
    removeFieldObject,
  };
}
