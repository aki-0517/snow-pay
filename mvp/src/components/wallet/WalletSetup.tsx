import { useAppKit } from "@reown/appkit/react";
import { FaWallet, FaShieldAlt, FaArrowRight } from "react-icons/fa";

export function WalletSetup() {
  const { open } = useAppKit();

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-ava-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaWallet className="w-8 h-8 text-ava-blue" />
        </div>
        <h1 className="text-subhead-lg font-aeonik text-ava-dark-gray mb-4">
          Welcome to SnowPay
        </h1>
        <p className="text-lg text-ava-dark-gray/70 mb-8">
          The private wallet that keeps your transactions confidential
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-ava-white rounded-lg p-6 border border-ava-light-gray">
          <FaShieldAlt className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-ava-dark-gray font-aeonik mb-2">Private Transactions</h3>
          <p className="text-sm text-ava-dark-gray/70">
            Your balance and transaction amounts are encrypted and private
          </p>
        </div>
        
        <div className="bg-ava-white rounded-lg p-6 border border-ava-light-gray">
          <FaWallet className="w-8 h-8 text-ava-blue mx-auto mb-3" />
          <h3 className="font-semibold text-ava-dark-gray font-aeonik mb-2">Easy to Use</h3>
          <p className="text-sm text-ava-dark-gray/70">
            Simple interface for sending and receiving private payments
          </p>
        </div>
      </div>

      {/* Connect Button */}
      <button
        onClick={() => open()}
        className="inline-flex items-center bg-ava-blue text-ava-white px-8 py-4 rounded-lg hover:bg-ava-blue-secondary transition-colors font-medium text-lg"
      >
        Connect Wallet
        <FaArrowRight className="ml-2" />
      </button>
      
      <p className="text-sm text-ava-dark-gray/70 mt-4">
        Connect your wallet to start using SnowPay
      </p>
    </div>
  );
}