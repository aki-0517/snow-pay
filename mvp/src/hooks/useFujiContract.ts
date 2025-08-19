import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { FUJI_CONTRACTS } from '../config/fuji-contracts';

// EERC20 ABI (essential functions)
const EERC20_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol", 
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view", 
    "type": "function"
  },
  {
    "inputs": [
      {"type": "address", "name": "to"},
      {"type": "uint256", "name": "amount"}
    ],
    "name": "transfer",
    "outputs": [{"type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "address", "name": "to"},
      {"type": "uint256", "name": "amount"},
      {"type": "bytes32", "name": "commitment"}
    ],
    "name": "encryptedMint",
    "outputs": [],
    "stateMutability": "nonpayable", 
    "type": "function"
  },
  {
    "inputs": [
      {"type": "address", "name": "from"},
      {"type": "address", "name": "to"},
      {"type": "uint256", "name": "amount"},
      {"type": "bytes32", "name": "nullifierHash"},
      {"type": "bytes32", "name": "commitment"},
      {"type": "bytes", "name": "proof"}
    ],
    "name": "encryptedTransfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "address", "name": "from"},
      {"type": "uint256", "name": "amount"},
      {"type": "bytes32", "name": "nullifierHash"},
      {"type": "bytes", "name": "proof"}
    ],
    "name": "encryptedBurn", 
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export interface TokenInfo {
  name: string;
  symbol: string;
  totalSupply: bigint;
  userBalance: bigint;
}

export const useFujiContract = () => {
  const { address } = useAccount();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  // Read token info
  const { data: name } = useContractRead({
    address: FUJI_CONTRACTS.EERC20_TOKEN as `0x${string}`,
    abi: EERC20_ABI,
    functionName: 'name',
  });

  const { data: symbol } = useContractRead({
    address: FUJI_CONTRACTS.EERC20_TOKEN as `0x${string}`,
    abi: EERC20_ABI, 
    functionName: 'symbol',
  });

  const { data: totalSupply } = useContractRead({
    address: FUJI_CONTRACTS.EERC20_TOKEN as `0x${string}`,
    abi: EERC20_ABI,
    functionName: 'totalSupply',
  });

  const { data: userBalance } = useContractRead({
    address: FUJI_CONTRACTS.EERC20_TOKEN as `0x${string}`,
    abi: EERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  // Update token info when data changes
  useEffect(() => {
    if (name && symbol && totalSupply !== undefined) {
      setTokenInfo({
        name: name as string,
        symbol: symbol as string,
        totalSupply: totalSupply as bigint,
        userBalance: (userBalance as bigint) || 0n,
      });
    }
  }, [name, symbol, totalSupply, userBalance]);

  // Write functions
  const { config: transferConfig } = usePrepareContractWrite({
    address: FUJI_CONTRACTS.EERC20_TOKEN as `0x${string}`,
    abi: EERC20_ABI,
    functionName: 'transfer',
  });

  const { write: transfer, isLoading: isTransferring } = useContractWrite(transferConfig);

  const { config: encryptedTransferConfig } = usePrepareContractWrite({
    address: FUJI_CONTRACTS.EERC20_TOKEN as `0x${string}`,
    abi: EERC20_ABI,
    functionName: 'encryptedTransfer',
  });

  const { write: encryptedTransfer, isLoading: isEncryptedTransferring } = useContractWrite(encryptedTransferConfig);

  return {
    tokenInfo,
    contract: {
      address: FUJI_CONTRACTS.EERC20_TOKEN,
      abi: EERC20_ABI,
    },
    functions: {
      transfer,
      encryptedTransfer,
      isTransferring,
      isEncryptedTransferring,
    },
  };
};