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
- デプロイ用の秘密鍵とAVAX（テストネットトークンは[公式faucet](https://faucet.avax.network/)から取得可能）

### インストール
```bash
# 依存関係のインストール
forge install

# コンパイル
forge build
```

### セキュリティ設定
```bash
# .gitignoreに.envを追加（既に含まれている場合はスキップ）
echo ".env" >> .gitignore

# .envファイルの権限を制限
chmod 600 .env
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

#### `.env`ファイルを作成（推奨）
プロジェクトルートに`.env`ファイルを作成して環境変数を管理：

```bash
# .envファイルを作成（以下の内容をコピー）
cat > .env << 'EOF'
# Private key for deployment (DO NOT commit this to version control)
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# Snowtrace API key for contract verification (オプション)
# SNOWTRACE_API_KEY=your_snowtrace_api_key_here

# Optional: Custom token parameters
TOKEN_NAME="Enhanced ERC20"
TOKEN_SYMBOL="EERC"
TOKEN_CAP=1000000000000000000000000

# RPC URLs (these are already in foundry.toml, but can be overridden)
FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
EOF

# 実際のプライベートキーに置き換え
nano .env
```



#### または直接エクスポート
```bash
export PRIVATE_KEY=your_private_key_here
export FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
```

> **重要**: 実際のプライベートキーは絶対にバージョン管理にコミットしないでください。

### Fuji testnetへのデプロイ

#### `.env`ファイルを使用する場合
```bash
# .envファイルを読み込み
source .env

# 全コントラクトをデプロイ
forge script script/DeployContracts.s.sol:DeployContracts \
  --rpc-url $FUJI_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

# EERC20のみデプロイ
forge script script/DeployEERC20.s.sol:DeployEERC20 \
  --rpc-url $FUJI_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

#### 直接指定する場合
```bash
# 全コントラクトをデプロイ
forge script script/DeployContracts.s.sol:DeployContracts \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
  --private-key 0xYOUR_PRIVATE_KEY \
  --broadcast

# または環境変数を使用
forge script script/DeployContracts.s.sol:DeployContracts \
  --rpc-url $FUJI_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

> **注意**: コントラクトの検証は必要に応じて後で行うことができます。デプロイ時に`--verify`オプションでエラーが発生する場合は、上記のようにオプションを削除してください。

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

### よくあるエラー

#### `--fork-url`エラー
```
error: a value is required for '--fork-url <URL>' but none was supplied
```
このエラーが発生した場合は、以下を確認してください：

1. **環境変数の設定確認**
   ```bash
   echo "FUJI_RPC_URL: $FUJI_RPC_URL"
   echo "PRIVATE_KEY: ${PRIVATE_KEY:0:10}..." # 安全のため一部のみ表示
   ```

2. **.envファイルの読み込み**
   ```bash
   source .env
   ```

3. **直接URLを指定**
   ```bash
   forge script script/DeployContracts.s.sol:DeployContracts \
     --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
     --private-key $PRIVATE_KEY \
     --broadcast
   ```

#### `vm.writeFile`ファイル書き込みエラー
```
vm.writeFile: the path deployment-addresses.json is not allowed to be accessed for write operations
```
このエラーが発生した場合は、以下を確認してください：

1. **foundry.tomlにファイルアクセス権限を追加**
   ```toml
   [profile.default]
   src = "src"
   out = "out" 
   libs = ["lib"]
   solc = "0.8.20"
   fs_permissions = [{ access = "read-write", path = "./" }]
   ```

2. **手動でアドレスをコピー**
   エラーが発生してもデプロイは成功しているので、ターミナル出力から契約アドレスを手動でコピーしてください。

3. **`deployment-addresses.json`を手動作成**
   ```json
   {
     "MockERC20": "0x...",
     "EERCConverter": "0x...",
     "EERC20": "0x...",
     "deployer": "0x..."
   }
   ```

#### コントラクト検証（オプション）
デプロイ後にコントラクトを個別に検証したい場合は、Snowtraceを使用できます：
1. [Snowtrace](https://testnet.snowtrace.io/)にアクセス
2. デプロイされたコントラクトアドレスを検索
3. "Contract"タブから"Verify and Publish"を選択
4. コンパイラ情報とソースコードを入力して手動検証

## ライセンス

MIT License