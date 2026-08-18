import React from 'react';
import { useAppProgress } from './state/useAppProgress.js';
import TitleScreen from './components/TitleScreen.jsx';
import NovelScreen from './components/NovelScreen.jsx';
import StageSelectScreen from './components/StageSelectScreen.jsx';
import GamePlayScreen from './components/GamePlayScreen.jsx';

export default function App() {
  const {
    screen,
    scenarioId,
    selectedStage,
    clearedStages,
    maxUnlockedStage,
    hasSave,
    startNewGame,
    continueGame,
    goToScreen,
    chooseStage,
    markStageCleared,
  } = useAppProgress();

  // ノベルパート終了 -> ステージ選択画面へ
  const handleNovelFinished = () => {
    goToScreen('stageSelect');
  };

  // ステージクリア -> 進捗を state として保存 -> ステージ選択画面へ戻る
  const handleStageClear = (stageNumber) => {
    markStageCleared(stageNumber);
    goToScreen('stageSelect');
  };

  return (
    <div className="app-root">
      {screen === 'title' && (
        <TitleScreen hasSave={hasSave} onStartNew={startNewGame} onContinue={continueGame} />
      )}
      {screen === 'novel' && (
        <NovelScreen scenarioId={scenarioId} onFinished={handleNovelFinished} />
      )}
      {screen === 'stageSelect' && (
        <StageSelectScreen
          clearedStages={clearedStages}
          maxUnlockedStage={maxUnlockedStage}
          onChooseStage={chooseStage}
        />
      )}
      {screen === 'game' && (
        <GamePlayScreen stageNumber={selectedStage} onStageClear={handleStageClear} />
      )}
    </div>
  );
}
