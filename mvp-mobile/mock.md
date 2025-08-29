# React Native Migration - Mock Implementations

This document lists all the functionality that was converted to mock/demo implementations during the migration from `mvp/` to `mvp-mobile/` due to React Native compatibility issues.

## =� Removed Dependencies

### Web3/Blockchain Libraries
- **@avalabs/eerc-sdk**: Core EERC functionality - not compatible with React Native Hermes engine
- **viem**: Ethereum client library - uses Node.js specific APIs not available in React Native
- **wagmi**: React hooks for Ethereum - depends on zustand which has `import.meta` issues in Hermes
- **@tanstack/react-query**: State management - transitively depends on zustand

### UI Libraries
- **@reown/appkit & @reown/appkit-adapter-wagmi**: Web-specific wallet connection UI - no stable React Native equivalent

### Crypto/ZK Libraries  
- **@darkforest_eth/hashing**: Cryptographic hashing - may work but removed to avoid complexity
- **@zk-kit/baby-jubjub**: Elliptic curve operations - may work but removed to avoid complexity
- **@zk-kit/poseidon-cipher**: Zero-knowledge cryptography - may work but removed to avoid complexity
- **circomlibjs**: Circuit compilation - may work but removed to avoid complexity


## <� Mock Implementations

### 1. Wallet Connection (`src/AppKitProvider.tsx`)
**Original**: Used @reown/appkit for wallet connection with full WagmiProvider setup
```typescript
// Original implementation with full wagmi config and wallet connectors
const wagmiAdapter = new WagmiAdapter({ networks, projectId, ssr: true });
```

**Mock**: Simplified provider that just passes children through
```typescript
export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### 2. EERC SDK Integration (`src/pages/SnowPay.tsx`, `src/pages/EERC.tsx`)
**Original**: Full EERC SDK integration with encrypted balance management
```typescript
const { isRegistered, isDecryptionKeySet, generateDecryptionKey, register, useEncryptedBalance } = useEERC(
  publicClient, walletClient, CONTRACTS.EERC_CONVERTER, CIRCUIT_CONFIG
);
```

**Mock**: Simulated state and delayed promises
```typescript
const [isDecryptionKeySet, setIsDecryptionKeySet] = useState(false);
const [isRegistered, setIsRegistered] = useState(false);
const totalBalance = 5000000n; // Fixed demo balance

const handleGenerateKey = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  setIsDecryptionKeySet(true);
};
```

### 3. Balance Formatting (`src/components/wallet/BalanceCard.tsx`)
**Original**: Used viem's formatUnits for precise decimal handling
```typescript
const formattedBalance = formatUnits(balance * 1000000n, 6);
```

**Mock**: Simple JavaScript number conversion
```typescript
const formattedBalance = (Number(balance) / 1000000).toFixed(6);
```

### 4. Transaction Operations (`src/components/forms/Simple*.tsx`)
**Original**: Used viem's parseUnits for amount parsing
```typescript
const parsedAmount = parseUnits(amount, 6);
```

**Mock**: Manual BigInt conversion
```typescript
const parsedAmount = BigInt(Math.floor(parseFloat(amount) * 1000000));
```

### 5. Network Configuration
**Original**: Used wagmi chain configurations
```typescript
const publicClient = usePublicClient({ chainId: avalancheFuji.id });
```

**Mock**: Hardcoded demo values
```typescript
const isConnected = true; // Always connected
const address = "0x1234567890123456789012345678901234567890";
```

## =' Files Modified

### Core Application
- `src/AppKitProvider.tsx` � Simplified provider without wagmi
- `src/pages/SnowPay.tsx` � Removed EERC SDK, added mock operations  
- `src/pages/EERC.tsx` � Removed wagmi hooks, added demo state

### Components  
- `src/components/wallet/BalanceCard.tsx` � Removed viem formatting
- `src/components/forms/SimpleTransfer.tsx` � Removed viem parsing
- `src/components/forms/SimpleDeposit.tsx` � Removed viem parsing
- `src/components/forms/SimpleWithdraw.tsx` � Removed viem parsing
- `src/components/features/QRPayment.tsx` � Removed wagmi, added demo address

### Configuration
- `babel.config.js` � Added `unstable_transformImportMeta: true`
- `app/(tabs)/_layout.tsx` � Updated tab labels to "Wallet" and "Privacy"

## � Known Limitations

1. **No Real Blockchain Connectivity**: All transactions are simulated
2. **No Persistent State**: App state resets on restart  
3. **No Real Wallet Integration**: Cannot connect to actual wallets
4. **No Cryptographic Operations**: ZK proofs and encryption are mocked
5. **No Real Balance Queries**: Uses hardcoded demo balances

## =� Production Implementation Guide

To restore real functionality:

1. **Use ethers.js React Native**: More compatible than viem for mobile
2. **WalletConnect v2**: For real mobile wallet connections
3. **AsyncStorage**: For persistent state management
4. **Custom BigInt utils**: For proper decimal handling
5. **Test crypto libraries**: Many zk-kit packages may work in React Native

This provides a working React Native demo showcasing the UI/UX structure for future real implementation.