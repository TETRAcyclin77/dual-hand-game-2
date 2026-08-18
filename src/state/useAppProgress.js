import { useCallback, useMemo, useState } from 'react';

const SAVE_KEY = 'dual-hand-game-save';
export const TOTAL_STAGES = 10;

function readSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('セーブデータの読み込みに失敗しました', e);
    return null;
  }
}

function writeSave(data) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('セーブデータの保存に失敗しました', e);
  }
}

/**
 * アプリ全体の進行管理。
 * screen: 'title' | 'novel' | 'stageSelect' | 'game'
 * clearedStages: クリア済みステージ番号（1-10）の配列。
 *   選択可能な最大ステージ = クリア済みの最大値 + 1（未クリアなら 1 のみ開放）。
 */
export function useAppProgress() {
  const initialSave = useMemo(() => readSave(), []);

  const [screen, setScreen] = useState('title');
  const [scenarioId, setScenarioId] = useState('intro');
  const [selectedStage, setSelectedStage] = useState(1);
  const [clearedStages, setClearedStages] = useState(() => initialSave?.clearedStages ?? []);
  const [hasSave, setHasSave] = useState(() => !!initialSave);

  const maxUnlockedStage = useMemo(() => {
    if (clearedStages.length === 0) return 1;
    return Math.min(TOTAL_STAGES, Math.max(...clearedStages) + 1);
  }, [clearedStages]);

  const startNewGame = useCallback(() => {
    setClearedStages([]);
    setSelectedStage(1);
    setScenarioId('intro');
    setScreen('novel');
  }, []);

  const continueGame = useCallback(() => {
    const save = readSave();
    if (!save) return startNewGame();
    setClearedStages(save.clearedStages ?? []);
    setScreen('stageSelect');
  }, [startNewGame]);

  const goToScreen = useCallback((next) => setScreen(next), []);

  const chooseStage = useCallback((stageNumber) => {
    setSelectedStage(stageNumber);
    setScreen('game');
  }, []);

  /** ステージクリア時に呼ぶ。クリア済み一覧に追加し localStorage へ保存する。 */
  const markStageCleared = useCallback(
    (stageNumber) => {
      setClearedStages((prev) => {
        const next = prev.includes(stageNumber) ? prev : [...prev, stageNumber];
        writeSave({ clearedStages: next, screen: 'stageSelect' });
        setHasSave(true);
        return next;
      });
    },
    []
  );

  return {
    screen,
    scenarioId,
    selectedStage,
    clearedStages,
    maxUnlockedStage,
    hasSave,
    setScenarioId,
    startNewGame,
    continueGame,
    goToScreen,
    chooseStage,
    markStageCleared,
  };
}
