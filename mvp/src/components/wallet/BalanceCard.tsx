import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { formatUnits } from "viem";

interface BalanceCardProps {
  balance: bigint;
  isPrivate?: boolean;
}

export function BalanceCard({ balance, isPrivate = true }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  
  const formattedBalance = formatUnits(balance, 6); // USDC has 6 decimals

  return (
    <div className="bg-gradient-to-br from-snow-primary to-snow-secondary p-6 rounded-xl text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium opacity-90">Total Balance</h2>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {showBalance ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      
      <div className="mb-2">
        <div className="text-3xl font-bold">
          {showBalance ? (
            <>
              ${parseFloat(formattedBalance).toFixed(2)}
              <span className="text-lg font-normal ml-1 opacity-75">USDC</span>
            </>
          ) : (
            "••••••"
          )}
        </div>
      </div>
      
      {isPrivate && (
        <div className="flex items-center text-sm opacity-75">
          <div className="w-2 h-2 bg-snow-success rounded-full mr-2"></div>
          Private Balance
        </div>
      )}
    </div>
  );
}