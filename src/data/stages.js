// 5x5 パズルグリッドのうち、start(0,0) -> goal(4,4) の
// 「右へ4回・下へ4回」の直進ルート上のマスは壁にしない安全地帯として確保する。
const SAFE_PATH = new Set(['0,0', '1,0', '2,0', '3,0', '4,0', '4,1', '4,2', '4,3', '4,4']);

const WALL_POOL = [];
for (let y = 1; y <= 4; y++) {
  for (let x = 0; x <= 3; x++) {
    const key = `${x},${y}`;
    if (!SAFE_PATH.has(key)) WALL_POOL.push({ x, y });
  }
}

/** ステージ番号 (1-10) に応じて難易度（壁の数）が増える puzzle ノードを生成する */
function buildPuzzleNodes(stageNumber) {
  const wallCount = Math.min(stageNumber - 1, WALL_POOL.length);
  const walls = WALL_POOL.slice(0, wallCount).map((w) => ({ ...w, role: 'wall' }));
  return [{ x: 0, y: 0, role: 'start' }, ...walls, { x: 4, y: 4, role: 'goal' }];
}

/** ステージ番号に応じてフィールド上のギミック配置を生成する（10x7グリッド） */
function buildFieldObjects(stageNumber) {
  const objects = [
    {
      id: `f-trigger-${stageNumber}`,
      type: 'puzzleTrigger',
      x: 3 + (stageNumber % 6),
      y: 1 + (stageNumber % 4),
    },
  ];
  if (stageNumber % 2 === 0) {
    objects.push({
      id: `f-speed-${stageNumber}`,
      type: 'speedUp',
      x: (stageNumber * 2) % 10,
      y: stageNumber % 6,
      multiplier: 2,
      durationMs: 5000,
    });
  }
  if (stageNumber % 3 === 0) {
    objects.push({
      id: `f-warp-${stageNumber}`,
      type: 'warp',
      x: (stageNumber + 4) % 10,
      y: (stageNumber + 2) % 7,
      targetX: 1,
      targetY: 5,
    });
  }
  return objects;
}

/** ステージ番号に応じて敵の攻撃（気の攻撃）配置を生成する */
function buildKiAttacks(stageNumber) {
  const count = 1 + (stageNumber % 4);
  return Array.from({ length: count }, (_, i) => ({
    id: `k-${stageNumber}-${i}`,
    x: (i * 2 + stageNumber) % 10,
    y: (i + stageNumber) % 7,
    vector: i % 2 === 0 ? { dx: 0, dy: 1 } : { dx: -1, dy: 0 },
  }));
}

function buildStage(stageNumber) {
  return {
    id: `stage-${stageNumber}`,
    number: stageNumber,
    fieldObjects: buildFieldObjects(stageNumber),
    kiAttacks: buildKiAttacks(stageNumber),
    puzzle: { nodes: buildPuzzleNodes(stageNumber) },
  };
}

export const STAGES = Array.from({ length: 10 }, (_, i) => buildStage(i + 1));
