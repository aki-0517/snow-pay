import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { formatUnits } from "viem";

interface BalanceCardProps {
  balance: bigint;
  isPrivate?: boolean;
}

export function BalanceCard({ balance, isPrivate = true }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  
  const formattedBalance = formatUnits(balance * 1000000n, 6); // Convert encrypted balance to e.DMT (multiply by 10^6)

  return (
    <div className="bg-gradient-ava p-6 rounded-xl text-ava-white shadow-lg" style={{background: 'linear-gradient(135deg, #3055B3 0%, #058AFF 100%)', color: '#FFFFFF'}}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium opacity-90 font-aeonik">Total Balance</h2>
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
              {parseFloat(formattedBalance).toFixed(6)}
              <span className="text-lg font-normal ml-1 opacity-75">e.DMT</span>
            </>
          ) : (
            "••••••"
          )}
        </div>
      </div>
      
      {isPrivate && (
        <div className="flex items-center text-sm opacity-75">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          Private Balance
        </div>
      )}
    </div>
  );
}