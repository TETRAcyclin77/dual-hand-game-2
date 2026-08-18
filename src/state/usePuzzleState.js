import { useCallback, useMemo, useState } from 'react';

export const PUZZLE_COLS = 5;
export const PUZZLE_ROWS = 5;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const keyOf = (x, y) => `${x},${y}`;

/**
 * パズルパートの状態管理。
 * JIKL でカーソルを動かし、start ノードから goal ノードまで
 * 経路（path）を繋ぐと isCleared になる。
 */
export function usePuzzleState(nodes) {
  const [isActive, setIsActive] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [path, setPath] = useState([]);
  const [isCleared, setIsCleared] = useState(false);

  const startNode = useMemo(() => nodes.find((n) => n.role === 'start'), [nodes]);
  const goalNode = useMemo(() => nodes.find((n) => n.role === 'goal'), [nodes]);
  const blocked = useMemo(
    () => new Set(nodes.filter((n) => n.role === 'wall').map((n) => keyOf(n.x, n.y))),
    [nodes]
  );

  const activate = useCallback(() => {
    if (!startNode) return;
    setIsActive(true);
    setIsCleared(false);
    setCursor({ x: startNode.x, y: startNode.y });
    setPath([keyOf(startNode.x, startNode.y)]);
  }, [startNode]);

  const deactivate = useCallback(() => {
    setIsActive(false);
  }, []);

  /** JIKL カーソル移動: i=上 j=左 k=下 l=右 */
  const moveCursor = useCallback(
    (dx, dy) => {
      if (!isActive || isCleared) return;
      setCursor((c) => {
        const nx = clamp(c.x + dx, 0, PUZZLE_COLS - 1);
        const ny = clamp(c.y + dy, 0, PUZZLE_ROWS - 1);
        if (blocked.has(keyOf(nx, ny))) return c; // 壁は通れない
        setPath((p) => (p[p.length - 1] === keyOf(nx, ny) ? p : [...p, keyOf(nx, ny)]));
        if (goalNode && nx === goalNode.x && ny === goalNode.y) {
          setIsCleared(true);
        }
        return { x: nx, y: ny };
      });
    },
    [isActive, isCleared, blocked, goalNode]
  );

  return {
    isActive,
    isCleared,
    cursor,
    path,
    activate,
    deactivate,
    moveCursor,
  };
}
