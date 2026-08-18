# 両手同時マルチタスクゲーム（Dual Hand Operation）

要件定義書（v3）をもとに生成した React + Vite プロジェクトです。
左手（WASD）でアクション、右手（JIKL）でパズルを同時並行に操作するブラウザゲームの
最小プレイ可能プロトタイプが動きます。

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

## 遊び方

1. タイトル画面で「はじめから」（または保存済みデータがあれば「つづきから」）を選択
2. ノベルパートを読み進める（クリック/タップで送り、タップでタイプ中の文章をスキップ）
3. **ステージ選択画面**: 1〜10 のステージが並び、クリア済みの最大ステージの次まで選択可能
   （初回は 1 のみ、1 をクリアすると 2 が開放……という形で最大 10 まで解放されます）
4. ゲームパート
   - `W A S D`（左手）でフィールド上の自機を移動
   - パズル起動アイテム（⌬）に触れるとパズルレイヤーが前面に出現
   - `J I K L`（右手）でパズルのカーソルを操作し、IN から OUT までルートを繋ぐとクリア
   - `▲`（speedUp）に触れると移動クールダウンが半減（一定時間で元に戻る）
   - `◈`（warp）に触れると指定座標へ強制移動
5. パズルクリアで敵撃破 → ステージクリア扱いとなり、クリア状況を `localStorage` に保存
   → ステージ選択画面に戻り、次のステージが選べるようになる

## フォルダ構成

```
dual-hand-game/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                 # エントリーポイント
    ├── App.jsx                  # 画面遷移管理（Title / Novel / StageSelect / Game）
    ├── styles/
    │   └── global.css           # デザイントークン（左手=amber / 右手=cyan）
    ├── state/                   # ロジック層（フック）
    │   ├── useAppProgress.js    # 画面状態・クリア済みステージ・localStorage セーブ/ロード
    │   ├── useKeyInput.js       # WASD/JIKL 同時押下の検知
    │   ├── useActionState.js    # 自機座標・ステータス・攻撃・FieldObject 管理
    │   ├── usePuzzleState.js    # パズルのカーソル・経路・クリア判定
    │   └── useGameCoordinator.js# 自機とFieldObjectの衝突判定・効果分岐
    ├── data/
    │   ├── scenarios.js         # ノベルパートの会話データ（配列＋タイピング演出）
    │   └── stages.js            # 1〜10ステージ分のギミック/敵/パズル配置を自動生成
    └── components/
        ├── TitleScreen.jsx
        ├── NovelScreen.jsx
        ├── StageSelectScreen.jsx# 1〜10のステージ選択（未解放はLOCK表示）
        ├── GamePlayScreen.jsx   # InputManager 相当のロジックとレイヤー合成
        ├── HUDLayer.jsx         # HP・バフ表示＋左右の手の入力インジケーター
        ├── ActionLayer/
        │   ├── SideViewGrid.jsx
        │   ├── Player.jsx
        │   ├── KiAttacks.jsx
        │   └── FieldObjects.jsx # puzzleTrigger/speedUp/warp を共通形式で描画
        └── PuzzleLayer/
            ├── CyberGrid.jsx
            ├── Nodes.jsx
            ├── PathLines.jsx
            └── PuzzleCursor.jsx
```

## 実装メモ（要件定義 5章対応）

- **速さの実装**: `useActionState.tryMove` が `performance.now()` と直前移動時刻の差分を
  クールダウン（通常 200ms / speedUp 中 100ms）と比較するグリッドベースの実装です。
- **FieldObject の汎用化**: `useGameCoordinator` が座標一致を検知し、
  `switch (hit.type)` で `puzzleTrigger` / `speedUp` / `warp` の効果を分岐します。
  新しいギミックは `stages.js` にオブジェクトを追加し、switch に1ケース足すだけで拡張できます。
- **同時入力**: `useKeyInput` が keydown/keyup を Set で管理し、
  アクション用の rAF ループ（連続移動）とパズル用の keydown ハンドラ（1タップ1マス）を
  独立させることで、WASD と JIKL の同時操作を取りこぼしなく処理します。
- **セーブ/ロード**: `useAppProgress` が `localStorage`（キー: `dual-hand-game-save`）に
  `clearedStages`（クリア済みステージ番号の配列）を保存し、タイトルの「つづきから」で復元します。
- **ステージ選択の解放ロジック**: `maxUnlockedStage = min(10, クリア済み最大値 + 1)` で算出し、
  それ以下のステージ番号のみ `StageSelectScreen` でクリックできます。
  `GamePlayScreen` はパズルクリアを検知すると `onStageClear(stageNumber)` を呼び、
  `App.jsx` → `useAppProgress.markStageCleared` が `clearedStages` を更新・保存してから
  ステージ選択画面に戻ります。

## デザイン方針

- 背景はほぼ黒（`#0A0E17`）のタクティカルな画面に、左手＝アンバー（`#F2A65A`）／
  右手＝シアン（`#4FE0C8`）の2系統アクセントで「二重の意識」を視覚化しています。
- 見出しは Chakra Petch、本文・HUD は JetBrains Mono を使用し、
  グリッド／回路という題材にモノスペースの規則性を合わせています。
- サイン要素として HUD 下部に「左手・右手の同時押下インジケーター」を配置し、
  実際に押しているキーが光ることで、このゲームの核である "二重操作" を常時可視化しています。

## 今後の拡張ポイント

- 敵の攻撃（KiAttacks）と自機の当たり判定・HPダメージ処理は未実装（要件定義にはロジックの
  骨組みのみ記載のため、フィールドの土台だけ用意しています）。
- `playerStatus.isInvincible` はステータス項目として用意済みですが、
  発火条件（被弾時の無敵時間など）は未接続です。
- ステージは `data/stages.js` に配列で追加していくだけで増やせます。
