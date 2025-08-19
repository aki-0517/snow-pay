import {
  type CompatiblePublicClient,
  type CompatibleWalletClient,
  useEERC,
} from "@avalabs/eerc-sdk";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useReadContract,
} from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { Dashboard } from "../components/wallet/Dashboard";
import { OperationsModal } from "../components/wallet/OperationsModal";
import { CIRCUIT_CONFIG, CONTRACTS } from "../config/contracts";
import { DEMO_TOKEN_ABI as erc20Abi } from "../pkg/constants";

type OperationType = "deposit" | "withdraw" | "transfer" | null;

export function SnowPay() {
  const [currentOperation, setCurrentOperation] = useState<OperationType>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient({ chainId: avalancheFuji.id });

  // Use EERC SDK correctly
  const {
    isRegistered,
    isDecryptionKeySet,
    generateDecryptionKey,
    register,
    useEncryptedBalance,
  } = useEERC(
    publicClient as CompatiblePublicClient,
    walletClient as CompatibleWalletClient,
    CONTRACTS.EERC_CONVERTER, // Use converter mode
    CIRCUIT_CONFIG
  );

  // Use encrypted balance hook
  const {
    decryptedBalance,
    deposit,
    withdraw,
    privateTransfer,
    refetchBalance,
  } = useEncryptedBalance(CONTRACTS.ERC20);

  // Get ERC20 balance for forms (regular DMT balance)
  const { data: erc20Balance } = useReadContract({
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
    address: CONTRACTS.ERC20,
  }) as { data: bigint };

  // Get balance - use decrypted balance for Total Balance (e.DMT)
  const encryptedBalance = decryptedBalance ?? 0n;
  // Use ERC20 balance for forms (DMT)
  const formBalance = erc20Balance ?? 0n;

  const handleGenerateKey = async () => {
    if (!generateDecryptionKey || !isConnected) return;
    
    try {
      setIsGeneratingKey(true);
      await generateDecryptionKey();
      toast.success("Decryption key generated successfully!");
    } catch (error) {
      console.error("Key generation failed:", error);
      toast.error("Key generation failed. Please try again.");
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleRegister = async () => {
    if (!register || !isConnected) return;
    
    try {
      setIsRegistering(true);
      await register();
      toast.success("Registration completed successfully!");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleOperationSuccess = () => {
    setCurrentOperation(null);
    toast.success("Transaction completed successfully!");
    refetchBalance();
  };

  // Create EERC operations object for the modal
  const eercOperations = {
    deposit,
    withdraw,
    privateTransfer,
  };

  return (
    <>
      <Dashboard
        balance={encryptedBalance}
        isConnected={isConnected}
        isDecryptionKeySet={isDecryptionKeySet}
        isRegistered={isRegistered}
        isGeneratingKey={isGeneratingKey}
        isRegistering={isRegistering}
        onGenerateKey={handleGenerateKey}
        onRegister={handleRegister}
        onDeposit={() => setCurrentOperation("deposit")}
        onWithdraw={() => setCurrentOperation("withdraw")}
        onTransfer={() => setCurrentOperation("transfer")}
      />
      
      <OperationsModal
        operation={currentOperation}
        onClose={() => setCurrentOperation(null)}
        eerc={eercOperations}
        onSuccess={handleOperationSuccess}
        balance={formBalance}
      />
    </>
  );
}