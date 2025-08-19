import { useState } from "react";
import { toast } from "react-toastify";
import { FaArrowDown } from "react-icons/fa";
import { parseUnits } from "viem";

interface SimpleDepositProps {
  eerc: {
    deposit?: (amount: bigint) => Promise<any>;
  };
  onSuccess: () => void;
}

export function SimpleDeposit({ eerc, onSuccess }: SimpleDepositProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }

    if (!eerc?.deposit) {
      toast.error("Deposit function not available");
      return;
    }

    try {
      setLoading(true);
      // Parse amount to BigInt with 6 decimals (USDC)
      const parsedAmount = parseUnits(amount, 6);
      await eerc.deposit(parsedAmount);
      onSuccess();
      setAmount("");
    } catch (error) {
      console.error("Deposit failed:", error);
      toast.error("Deposit failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-snow-dark mb-2">
          Amount (USDC)
        </label>
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
        disabled={loading || !amount}
        className="w-full flex items-center justify-center bg-snow-success text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? (
          "Depositing..."
        ) : (
          <>
            <FaArrowDown className="mr-2" />
            Deposit Funds
          </>
        )}
      </button>

      <p className="text-xs text-snow-gray text-center">
        Funds will be encrypted in your private balance
      </p>
    </form>
  );
}