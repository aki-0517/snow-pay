import { FaTimes } from "react-icons/fa";
import { SimpleDeposit } from "../forms/SimpleDeposit";
import { SimpleWithdraw } from "../forms/SimpleWithdraw";
import { SimpleTransfer } from "../forms/SimpleTransfer";

type OperationType = "deposit" | "withdraw" | "transfer" | null;

interface OperationsModalProps {
  operation: OperationType;
  onClose: () => void;
  eerc: any; // EERC SDK instance
  onSuccess: () => void;
  balance?: bigint; // ERC20 balance for deposit
  encryptedBalance?: bigint; // Encrypted balance for send/withdraw
  prefilledAddress?: string; // Pre-filled recipient address for transfer
}

export function OperationsModal({ operation, onClose, eerc, onSuccess, balance, encryptedBalance, prefilledAddress }: OperationsModalProps) {
  if (!operation) return null;

  const titles = {
    deposit: "Deposit Funds",
    withdraw: "Withdraw Funds",
    transfer: "Send Payment"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-snow-bg rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-snow-dark">
            {titles[operation]}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-snow-gray" />
          </button>
        </div>
        
        <div className="p-6">
          {operation === "deposit" && (
            <SimpleDeposit eerc={eerc} onSuccess={onSuccess} balance={balance} />
          )}
          {operation === "withdraw" && (
            <SimpleWithdraw eerc={eerc} onSuccess={onSuccess} balance={encryptedBalance} />
          )}
          {operation === "transfer" && (
            <SimpleTransfer eerc={eerc} onSuccess={onSuccess} balance={encryptedBalance} prefilledAddress={prefilledAddress} />
          )}
        </div>
      </div>
    </div>
  );
}