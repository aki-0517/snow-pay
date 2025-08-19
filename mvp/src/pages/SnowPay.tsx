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
} from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { Dashboard } from "../components/wallet/Dashboard";
import { OperationsModal } from "../components/wallet/OperationsModal";
import { CIRCUIT_CONFIG, CONTRACTS } from "../config/contracts";

type OperationType = "deposit" | "withdraw" | "transfer" | null;

export function SnowPay() {
  const [currentOperation, setCurrentOperation] = useState<OperationType>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  
  const { isConnected } = useAccount();
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

  // Get balance - use decrypted balance from the hook
  const balance = decryptedBalance ?? 0n;

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
        balance={balance}
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
      />
    </>
  );
}