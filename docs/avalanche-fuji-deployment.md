# Avalanche Fuji EERC20 Contract Deployment Guide

このガイドでは、mvp/フロントエンドと連携するカスタムEERC20コントラクトをAvalanche Fujiテストネットにデプロイする完全な手順を説明します。

## 📋 概要

本プロジェクトでは以下を実装します：
- **EERC20コントラクト**: 暗号化機能を持つERC20トークン
- **Fujiテストネットへのデプロイ**: Foundryを使用
- **フロントエンド統合**: mvp/ディレクトリのReactアプリとの連携
- **ゼロ知識証明対応**: 暗号化取引用のコミット・リビール機能

## 🛠️ 事前準備

### 1. 必要なツール
```bash
# Foundryのインストール (未インストールの場合)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Node.js 18+ (mvp用)
node --version  # v18以上を確認
```

### 2. テストネットAVAXの取得
```bash
# ウォレットアドレスの確認
cd contract
make check-balance

# Fujiフォーセットでテストネットトークンを取得
make get-testnet-tokens
```

### 3. 環境変数の設定
```bash
cd contract
cp .env.example .env

# .envファイルを編集
PRIVATE_KEY=your_private_key_here
```

**重要**: 
- プライベートキーは本番環境では使用しないテスト用のものを使用

## 🚀 デプロイメント手順

### Step 1: 依存関係のインストール
```bash
cd contract
make install
```

### Step 2: コントラクトのビルドとテスト
```bash
# コントラクトのビルド
make build

# テストの実行
make test

# ガス使用量の見積もり
make gas-estimate
```

### Step 3: Fujiテストネットへのデプロイ
```bash
# デプロイの実行
make deploy-fuji
```

成功すると以下の情報が表示されます：
```
EERC20 deployed to: 0x1234...5678
Contract verification command: forge verify-contract...
Add this address to your frontend config: EERC20_TOKEN: 0x1234...5678
```

### Step 4: コントラクトの検証 (必要に応じて)
```bash
# デプロイ時に自動検証されなかった場合
CONTRACT_ADDRESS=0x1234...5678 make verify-fuji
```

## 🔗 フロントエンド統合

### Step 1: コントラクトアドレスの更新
デプロイ後、以下のファイルを更新：

```typescript
// mvp/src/config/fuji-contracts.ts
export const FUJI_CONTRACTS = {
    EERC20_TOKEN: "0xYOUR_DEPLOYED_ADDRESS_HERE", // <- ここを更新
    // ...
} as const;
```

### Step 2: フロントエンドの起動
```bash
cd mvp
npm install
npm run dev
```

### Step 3: ネットワーク設定
MetaMaskに以下のネットワークを追加：

- **Network Name**: Avalanche Fuji C-Chain
- **RPC URL**: https://api.avax-test.network/ext/bc/C/rpc
- **Chain ID**: 43113
- **Currency Symbol**: AVAX
- **Block Explorer**: https://testnet.snowtrace.io/

## 📚 コントラクト機能説明

### 基本的なERC20機能
- `name()`, `symbol()`, `totalSupply()`: 標準的なトークン情報
- `balanceOf(address)`: アドレス残高の確認
- `transfer(to, amount)`: 標準的な送金

### 暗号化機能
- `encryptedMint(to, amount, commitment)`: コミット付きミント
- `encryptedTransfer(from, to, amount, nullifier, commitment, proof)`: ゼロ知識証明付き送金
- `encryptedBurn(from, amount, nullifier, proof)`: ゼロ知識証明付きバーン

### 管理機能
- `setVerifier(verifier)`: 証明検証コントラクトの設定
- `setVerificationEnabled(enabled)`: 検証の有効/無効切り替え

## 🧪 テスト方法

### 1. ユニットテスト
```bash
cd contract
forge test -vv
```

### 2. フォークテスト
```bash
# Fuji環境でのフォークテスト
forge test --fork-url https://api.avax-test.network/ext/bc/C/rpc -vv
```

### 3. フロントエンドテスト
```bash
cd mvp
npm run build
npm run preview
```

## 🔍 デバッグとトラブルシューティング

### よくある問題

1. **ガス不足エラー**
   ```bash
   # 残高確認
   make check-balance
   # フォーセットから追加取得
   make get-testnet-tokens
   ```

2. **コントラクト検証失敗**
   ```bash
   # 手動検証
   CONTRACT_ADDRESS=0x... make verify-fuji
   ```

3. **フロントエンド接続エラー**
   - MetaMaskのネットワーク設定を確認
   - コントラクトアドレスが正しく更新されているか確認

### ログの確認
```bash
# デプロイログの詳細表示
forge script script/DeployEERC20.s.sol --rpc-url fuji --private-key $PRIVATE_KEY -vvv

# SnowTraceでトランザクション確認
# https://testnet.snowtrace.io/tx/YOUR_TX_HASH
```

## 📊 使用可能なMakeコマンド

| コマンド | 説明 |
|---------|------|
| `make help` | 使用可能コマンドの一覧表示 |
| `make install` | 依存関係のインストール |
| `make build` | コントラクトのビルド |
| `make test` | テストの実行 |
| `make deploy-fuji` | Fujiへのデプロイ |
| `make verify-fuji` | コントラクトの検証 |
| `make simulate-deploy` | デプロイのシミュレーション |
| `make gas-estimate` | ガス使用量の見積もり |
| `make check-balance` | ウォレット残高の確認 |
| `make clean` | ビルドアーティファクトのクリーンアップ |

## 🔐 セキュリティ考慮事項

### プライベートキー管理
- `.env`ファイルは決してコミットしない
- 本番環境用とテスト環境用のキーを分ける
- ハードウェアウォレットの使用を推奨

### コントラクトセキュリティ
- デプロイ前に必ずテストを実行
- OpenZeppelinライブラリの使用
- アップグレード機能の慎重な実装

### フロントエンドセキュリティ
- RPC URLの検証
- ユーザー入力の適切な検証
- メタマスク接続の安全な実装

## 📈 次のステップ

1. **メインネットデプロイ**
   ```bash
   make deploy-mainnet
   ```

2. **ゼロ知識証明の実装**
   - Circom回路の実装
   - Verifierコントラクトの開発
   - フロントエンドでの証明生成

3. **UI/UXの改善**
   - エラーハンドリングの強化
   - ローディング状態の改善
   - トランザクション履歴の追加

## 🆘 サポート

問題が発生した場合：

1. **ドキュメントの確認**: [Avalanche公式ドキュメント](https://docs.avax.network/)
2. **ログの確認**: `forge`コマンドに`-vvv`オプションを追加
3. **コミュニティサポート**: [Avalanche Discord](https://chat.avalabs.org/)

## 📄 ファイル構造

```
ava-eerc20/
├── contract/                   # スマートコントラクト
│   ├── src/EERC20.sol         # メインコントラクト
│   ├── script/DeployEERC20.s.sol # デプロイスクリプト
│   ├── test/EERC20.t.sol      # テストファイル
│   ├── foundry.toml           # Foundry設定
│   ├── Makefile               # 便利なコマンド集
│   └── .env.example           # 環境変数テンプレート
├── mvp/                       # フロントエンドアプリ
│   ├── src/config/fuji-contracts.ts # Fuji設定
│   ├── src/hooks/useFujiContract.ts # フック
│   └── ...
└── docs/                      # ドキュメント
    └── avalanche-fuji-deployment.md # このファイル
```

---

このガイドに従うことで、mvp/フロントエンドと完全に統合されたEERC20コントラクトをAvalanche Fujiテストネットに正常にデプロイできます。