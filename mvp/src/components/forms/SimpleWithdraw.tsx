import { useState } from "react";
import { toast } from "react-toastify";
import { FaArrowUp } from "react-icons/fa";
import { parseUnits, formatUnits } from "viem";

interface SimpleWithdrawProps {
  eerc: {
    withdraw?: (amount: bigint) => Promise<any>;
  };
  onSuccess: () => void;
  balance?: bigint;
}

export function SimpleWithdraw({ eerc, onSuccess, balance }: SimpleWithdrawProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  
  const formattedBalance = balance ? formatUnits(balance, 6) : "0.00";
  
  const handleMaxClick = () => {
    setAmount(formattedBalance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }

    if (!eerc?.withdraw) {
      toast.error("Withdraw function not available");
      return;
    }

    try {
      setLoading(true);
      // Parse amount to BigInt with 6 decimals (USDC)
      const parsedAmount = parseUnits(amount, 6);
      await eerc.withdraw(parsedAmount);
      onSuccess();
      setAmount("");
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Withdrawal failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-snow-dark">
            Amount (USDC)
          </label>
          {balance !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-snow-gray">Balance: {formattedBalance} USDC</span>
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
        disabled={loading || !amount}
        className="w-full flex items-center justify-center bg-snow-warning text-white py-3 px-4 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? (
          "Withdrawing..."
        ) : (
          <>
            <FaArrowUp className="mr-2" />
            Withdraw Funds
          </>
        )}
      </button>

      <p className="text-xs text-snow-gray text-center">
        Funds will be sent to your wallet
      </p>
    </form>
  );
}