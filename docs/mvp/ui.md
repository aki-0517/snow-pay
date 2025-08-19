# SnowPay Wallet UI実装計画

## 1. 現在のUI分析

### 1.1. 既存UIの特徴
- **サイバーパンク風テーマ**: 緑色ベース、黒背景、モノスペースフォント
- **技術的表現**: 暗号学的詳細説明、開発者向け情報が多い
- **複雑な情報構造**: モード切り替え、詳細な技術情報の表示

### 1.2. 既存コンポーネント構造
```
App.tsx
├── Logo (3dent)
├── EERC.tsx (メインページ)
│   ├── ConverterMode / StandaloneMode
│   │   ├── Operations
│   │   │   ├── Deposit
│   │   │   ├── Withdraw  
│   │   │   └── Transfer
│   │   └── 残高表示
│   └── 各種設定・登録UI
```

### 1.3. 現在の課題
- **専門用語過多**: 一般ユーザーには理解困難
- **情報密度が高い**: 重要な機能が埋もれている
- **ワークフロー不明確**: 何をすべきか分からない
- **ブランディング不統一**: eERC技術デモの印象

## 2. SnowPay Wallet UI設計方針

### 2.1. デザイン哲学
**"シンプル・直感的・セキュア"**
- 一般ユーザーが迷わず使える
- 金融アプリとしての信頼感
- プライバシー保護の安心感

### 2.2. ターゲットユーザー体験
1. **新規ユーザー**: 「簡単にプライベート送金できそう」
2. **利用中ユーザー**: 「残高確認・送金が迷わずできる」
3. **上級ユーザー**: 「詳細情報にもアクセス可能」

## 3. UI改善計画

### 3.1. ブランディング変更
**現在** → **変更後**
- ロゴ: "3dent" → "SnowPay"
- アイコン: Trident → Snow/Wallet icon
- カラー: サイバーグリーン → より落ち着いた青系グラデーション
- テーマ: 技術デモ → 金融ウォレット

### 3.2. メインページ構造刷新

#### 現在の構造
```
[長い技術説明]
[ウォレット接続]
[キー生成]
[登録]
[複雑なモード切り替え]
[詳細な暗号化情報]
[操作パネル]
```

#### 新しい構造
```
[SnowPayロゴ・簡潔な説明]
[ウォレット接続ステータス]
[現在の残高（大きく表示）]
[主要アクション（送金・入金・出金）]
[設定・詳細情報（折りたたみ）]
```

### 3.3. ユーザーフロー改善

#### Step 1: 初回セットアップ
- **現在**: 技術説明 → 接続 → キー生成 → 登録
- **改善後**: 簡潔な説明 → ワンクリック開始 → ガイド付きセットアップ

#### Step 2: 日常利用
- **現在**: モード確認 → 詳細読解 → 操作選択
- **改善後**: 残高確認 → アクション選択 → 実行

### 3.4. コンポーネント設計

#### 3.4.1. ウォレットダッシュボード
```tsx
// 新しいDashboard コンポーネント
<Dashboard>
  <BalanceCard 
    balance={decryptedBalance}
    token="USDC"
    isPrivate={true}
  />
  <QuickActions>
    <SendButton />
    <DepositButton />
    <WithdrawButton />
  </QuickActions>
</Dashboard>
```

#### 3.4.2. 送金フロー簡素化
```tsx
// 改善された Transfer コンポーネント
<SimpleTransfer>
  <ContactPicker /> {/* 新機能: 連絡先選択 */}
  <AmountInput />
  <ConfirmButton />
</SimpleTransfer>
```

#### 3.4.3. セットアップウィザード
```tsx
// 新しい SetupWizard コンポーネント
<SetupWizard>
  <Step1ConnectWallet />
  <Step2GenerateKey />
  <Step3Register />
  <Step4FirstDeposit />
</SetupWizard>
```

## 4. 具体的な実装変更

### 4.1. 色彩設計
```js
// tailwind.config.js の更新
colors: {
  // 現在のサイバーパンク風から金融アプリ風へ
  'snow-primary': '#1e40af',     // 深い青
  'snow-secondary': '#3b82f6',   // 明るい青  
  'snow-accent': '#06b6d4',      // シアン
  'snow-success': '#10b981',     // 緑
  'snow-warning': '#f59e0b',     // オレンジ
  'snow-danger': '#ef4444',      // 赤
  'snow-gray': '#6b7280',        // グレー
  'snow-dark': '#1f2937',        // ダーク
  'snow-light': '#f8fafc',       // ライト
}
```

### 4.2. Typography改善
```css
/* より読みやすいフォント設定 */
.text-primary { 
  @apply text-snow-dark text-base leading-relaxed;
}
.text-secondary {
  @apply text-snow-gray text-sm;
}
.heading {
  @apply text-snow-dark font-semibold text-xl;
}
```

### 4.3. レイアウト改善
- **現在**: 技術情報が上部に大量表示
- **改善**: 重要な機能を上部、詳細は折りたたみ

### 4.4. モバイル対応強化
- **レスポンシブデザイン**: スマートフォンでの使いやすさ向上
- **タッチフレンドリー**: ボタンサイズとタップ領域の最適化

## 5. 段階的実装計画

### Phase 1: 基本UI改善（最小限の変更）
1. **ロゴ・ブランディング変更**
   - Logo.tsx の更新
   - アプリ名変更

2. **Converterモード専用化**
   - モード切り替えUI削除
   - 不要な説明文削除

3. **レイアウト整理**
   - 重要な情報の上部配置
   - 詳細情報の折りたたみ

### Phase 2: ユーザビリティ向上
1. **ダッシュボード作成**
   - 残高の大きな表示
   - クリアなアクションボタン

2. **送金フロー改善**
   - より分かりやすい入力フォーム
   - エラーメッセージの改善

3. **セットアップ改善**
   - ウィザード形式の導入
   - プログレス表示

### Phase 3: 高度な機能
1. **連絡先機能**
   - アドレス帳
   - ニックネーム設定

2. **履歴表示**
   - 取引履歴
   - フィルタリング機能

3. **詳細設定**
   - プライバシー設定
   - 表示設定

## 6. ファイル構造

### 新しいコンポーネント
```
src/components/
├── wallet/
│   ├── Dashboard.tsx          # メインダッシュボード
│   ├── BalanceCard.tsx        # 残高表示カード
│   ├── QuickActions.tsx       # アクションボタン群
│   └── SetupWizard.tsx        # セットアップガイド
├── forms/
│   ├── SimpleTransfer.tsx     # 簡素化された送金フォーム
│   ├── ContactPicker.tsx      # 連絡先選択
│   └── AmountInput.tsx        # 金額入力
└── layout/
    ├── Header.tsx             # 更新されたヘッダー
    ├── Logo.tsx               # SnowPayロゴ
    └── Layout.tsx             # 新しいレイアウト
```

### 更新が必要なファイル
```
mvp/src/
├── App.tsx                    # レイアウト構造変更
├── pages/EERC.tsx             # SnowPay.tsx にリネーム・大幅修正
├── components/eerc/ConverterMode.tsx  # UI簡素化
└── tailwind.config.js         # 色彩テーマ更新
```

## 7. 実装優先度

### 高優先度（即座に実装）
- [ ] ロゴ・ブランディング変更
- [ ] Converterモード専用化
- [ ] 基本レイアウト整理


この計画に基づいて、技術的なeERCデモから一般ユーザー向けのSnowPay Walletへと段階的に変貌させることができます。

※ UIは全部英語にして。