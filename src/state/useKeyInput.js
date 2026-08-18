import { useEffect, useRef, useState } from 'react';

export const ACTION_KEYS = ['w', 'a', 's', 'd'];
export const PUZZLE_KEYS = ['j', 'i', 'k', 'l'];

/**
 * WASD（左手・アクション）と JIKL（右手・パズル）の同時押下を
 * 取りこぼしなく検知するための入力管理フック。
 *
 * - pressed: 現在押されているキーの Set（描画用 state。HUD表示などに使う）
 * - pressedRef: 同じ内容を持つ ref。ゲームループ内で毎フレーム最新値を
 *   同期的に読みたい場合（state の非同期更新を待たない）に使う。
 */
export function useKeyInput() {
  const [pressed, setPressed] = useState(() => new Set());
  const pressedRef = useRef(new Set());

  useEffect(() => {
    const normalize = (e) => e.key.toLowerCase();

    const onKeyDown = (e) => {
      const key = normalize(e);
      if (![...ACTION_KEYS, ...PUZZLE_KEYS].includes(key)) return;
      if (pressedRef.current.has(key)) return; // 押しっぱなし連打対策
      pressedRef.current.add(key);
      setPressed(new Set(pressedRef.current));
    };

    const onKeyUp = (e) => {
      const key = normalize(e);
      if (!pressedRef.current.has(key)) return;
      pressedRef.current.delete(key);
      setPressed(new Set(pressedRef.current));
    };

    // タブ切り替え等でキーが上がったまま検出できなくなる対策
    const onBlur = () => {
      pressedRef.current.clear();
      setPressed(new Set());
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return {
    pressed, // Set<string> - 再レンダリングに使う
    pressedRef, // Set<string> - ループ内の即時参照に使う
    isActionActive: (dir) => pressed.has(dir),
    isPuzzleActive: (dir) => pressed.has(dir),
  };
}
