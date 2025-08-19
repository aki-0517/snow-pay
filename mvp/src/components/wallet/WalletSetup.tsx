import { useAppKit } from "@reown/appkit/react";
import { FaWallet, FaShieldAlt, FaArrowRight } from "react-icons/fa";

export function WalletSetup() {
  const { open } = useAppKit();

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-snow-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaWallet className="w-8 h-8 text-snow-primary" />
        </div>
        <h1 className="text-3xl font-bold text-snow-dark mb-4">
          Welcome to SnowPay
        </h1>
        <p className="text-lg text-snow-gray mb-8">
          The private wallet that keeps your transactions confidential
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-snow-bg rounded-lg p-6 border border-gray-200">
          <FaShieldAlt className="w-8 h-8 text-snow-success mx-auto mb-3" />
          <h3 className="font-semibold text-snow-dark mb-2">Private Transactions</h3>
          <p className="text-sm text-snow-gray">
            Your balance and transaction amounts are encrypted and private
          </p>
        </div>
        
        <div className="bg-snow-bg rounded-lg p-6 border border-gray-200">
          <FaWallet className="w-8 h-8 text-snow-primary mx-auto mb-3" />
          <h3 className="font-semibold text-snow-dark mb-2">Easy to Use</h3>
          <p className="text-sm text-snow-gray">
            Simple interface for sending and receiving private payments
          </p>
        </div>
      </div>

      {/* Connect Button */}
      <button
        onClick={() => open()}
        className="inline-flex items-center bg-snow-primary text-white px-8 py-4 rounded-lg hover:bg-snow-secondary transition-colors font-medium text-lg"
      >
        Connect Wallet
        <FaArrowRight className="ml-2" />
      </button>
      
      <p className="text-sm text-snow-gray mt-4">
        Connect your wallet to start using SnowPay
      </p>
    </div>
  );
}