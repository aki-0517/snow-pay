# EERC Contracts

Privacy-preserving ERC20 token system using zero-knowledge proofs for Avalanche Fuji testnet.

## 概要

このプロジェクトには、プライベートトークン転送を可能にする2つのスマートコントラクトが含まれています：

- **EERCConverter**: 既存のERC20トークンをプライベート転送可能な形式に変換
- **EERC20**: 暗号化機能を内蔵したスタンドアロンERC20トークン

## コントラクト構成

### EERCConverter.sol
- ERC20トークンのデポジット・引き出し
- ユーザー登録（復号化キーハッシュ）
- ゼロ知識証明を使用したプライベート転送
- 監査機能（コンプライアンス対応）

### EERC20.sol
- 暗号化機能付きERC20トークン
- コミット・nullifier システム
- ゼロ知識証明検証機能（プレースホルダー実装）

## セットアップ

### 前提条件
- [Foundry](https://book.getfoundry.sh/) がインストール済み
- Avalanche Fuji testnetのRPC URL
- デプロイ用の秘密鍵とAVAX

### インストール
```bash
# 依存関係のインストール
forge install

# コンパイル
forge build
```

## テスト実行

### 全テスト実行
```bash
forge test
```

### 詳細出力でテスト実行
```bash
forge test -vv
```

### 特定のコントラクトのテスト
```bash
forge test --match-contract EERCConverterTest
forge test --match-contract EERC20Test
forge test --match-contract IntegrationTest
```

### ガス使用量測定
```bash
forge snapshot
```

## デプロイ

### 環境変数設定
```bash
export PRIVATE_KEY=your_private_key_here
export RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
```

### Fuji testnetへのデプロイ
```bash
# 全コントラクトをデプロイ
forge script script/DeployContracts.s.sol:DeployContracts \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify

# EERC20のみデプロイ
forge script script/DeployEERC20.s.sol:DeployEERC20 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### ローカル開発環境
```bash
# ローカルノード起動
anvil

# ローカルにデプロイ
forge script script/DeployContracts.s.sol:DeployContracts \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

## MVPとの統合

デプロイ後、生成される`deployment-addresses.json`ファイルから契約アドレスを取得し、`mvp/src/config/contracts.ts`を更新してください：

```typescript
export const CONTRACTS = {
  EERC_CONVERTER: "0x...", // EERCConverterのアドレス
  ERC20: "0x...",          // 既存のERC20トークンアドレス（またはMockERC20）
} as const;
```

## 主要機能

### EERCConverter
```solidity
// ユーザー登録
function register(bytes32 decryptionKeyHash, bytes calldata proof) external

// トークンデポジット
function deposit(uint256 amount, bytes32 commitment, bytes calldata proof) external

// プライベート転送
function transfer(address to, bytes32 nullifierHash, bytes32 commitment, bytes calldata proof) external

// トークン引き出し
function withdraw(uint256 amount, bytes32 nullifierHash, bytes calldata proof) external
```

### EERC20
```solidity
// 暗号化ミント
function encryptedMint(address to, uint256 amount, bytes32 commitment) external onlyOwner

// 暗号化転送
function encryptedTransfer(address from, address to, uint256 amount, bytes32 nullifierHash, bytes32 commitment, bytes calldata proof) external

// 暗号化バーン
function encryptedBurn(address from, uint256 amount, bytes32 nullifierHash, bytes calldata proof) external
```

## セキュリティ

- すべてのコントラクトはOpenZeppelinライブラリを使用
- ReentrancyGuard実装済み
- 適切なアクセス制御
- 包括的なテストカバレッジ

## トラブルシューティング

### コンパイルエラー
```bash
# 依存関係の再インストール
forge clean
forge install
```

### テスト失敗
```bash
# 詳細なエラー出力
forge test -vvv --match-test testFailingFunction
```

### デプロイ失敗
- 十分なAVAXトークンがあることを確認
- 秘密鍵とRPC URLが正しいことを確認
- ガス制限を増やす: `--gas-limit 3000000`

## ライセンス

MIT License