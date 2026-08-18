import { useEffect } from 'react';

/**
 * 自機と fieldObjects の衝突判定・効果分岐を担当するコーディネーター。
 * FieldObject は { id, type, x, y, ...payload } の共通形で管理し、
 * type ごとに switch で効果を分岐させる（ギミック追加が容易になる設計）。
 */
export function useGameCoordinator({
  playerPos,
  fieldObjects,
  removeFieldObject,
  applySpeedBuff,
  warpTo,
  activatePuzzle,
}) {
  useEffect(() => {
    const hit = fieldObjects.find((o) => o.x === playerPos.x && o.y === playerPos.y);
    if (!hit) return;

    switch (hit.type) {
      case 'puzzleTrigger': {
        activatePuzzle();
        removeFieldObject(hit.id);
        break;
      }
      case 'speedUp': {
        applySpeedBuff(hit.multiplier ?? 2, hit.durationMs ?? 5000);
        removeFieldObject(hit.id);
        break;
      }
      case 'warp': {
        // 自分自身を消してから飛ぶ（無限ループ防止）
        removeFieldObject(hit.id);
        warpTo(hit.targetX, hit.targetY);
        break;
      }
      default:
        break;
    }
    // playerPos が変わるたびに再評価する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerPos.x, playerPos.y]);
}
