import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPaperPlane } from "react-icons/fa";
import { parseUnits, formatUnits } from "viem";

interface SimpleTransferProps {
  eerc: {
    privateTransfer?: (recipient: string, amount: bigint) => Promise<any>;
  };
  onSuccess: () => void;
  balance?: bigint;
  prefilledAddress?: string;
}

export function SimpleTransfer({ eerc, onSuccess, balance, prefilledAddress }: SimpleTransferProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Set prefilled address when component mounts or prefilledAddress changes
  useEffect(() => {
    if (prefilledAddress) {
      setRecipient(prefilledAddress);
    }
  }, [prefilledAddress]);
  
  const formattedBalance = balance ? formatUnits(balance * 1000000n, 6) : "0.00";
  
  const handleMaxClick = () => {
    setAmount(formattedBalance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!eerc?.privateTransfer) {
      toast.error("Transfer function not available");
      return;
    }

    try {
      setLoading(true);
      // Parse amount to BigInt with 6 decimals (e.DMT)
      const parsedAmount = parseUnits(amount, 6);
      await eerc.privateTransfer(recipient, parsedAmount);
      onSuccess();
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error("Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-snow-dark mb-2">
          Recipient Address
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value.trim())}
          placeholder="0x..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-snow-primary focus:border-transparent text-snow-dark placeholder-gray-400"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-snow-dark">
            Amount (e.DMT)
          </label>
          {balance !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-snow-gray">Balance: {formattedBalance} e.DMT</span>
              <button
                type="button"
                onClick={handleMaxClick}
                className="text-snow-primary text-sm px-2 py-1 rounded border border-snow-primary/40 hover:border-snow-primary/80 transition-colors"
                disabled={loading}
              >
                MAX
              </button>
            </div>
          )}
        </div>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-snow-primary focus:border-transparent text-snow-dark placeholder-gray-400"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || !recipient || !amount}
        className="w-full flex items-center justify-center bg-snow-primary text-white py-3 px-4 rounded-lg hover:bg-snow-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? (
          "Sending..."
        ) : (
          <>
            <FaPaperPlane className="mr-2" />
            Send Payment
          </>
        )}
      </button>

      <p className="text-xs text-snow-gray text-center">
        This transaction is private and encrypted
      </p>
    </form>
  );
}