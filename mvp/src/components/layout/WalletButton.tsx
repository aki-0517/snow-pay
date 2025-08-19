import { useAccount, useDisconnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { FaWallet, FaSignOutAlt } from "react-icons/fa";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { open } = useAppKit();

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error("Disconnect failed:", error);
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={() => open()}
        className="inline-flex items-center px-4 py-2 bg-ava-blue text-ava-white rounded-lg hover:bg-ava-blue-secondary transition-colors font-medium"
        style={{backgroundColor: '#3055B3', color: '#FFFFFF'}}
      >
        <FaWallet className="mr-2" />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center px-3 py-2 bg-ava-white border border-ava-light-gray rounded-lg" style={{backgroundColor: '#FFFFFF', borderColor: '#F5F5F9'}}>
        <div className="w-2 h-2 bg-ava-blue-secondary rounded-full mr-2" style={{backgroundColor: '#058AFF'}}></div>
        <span className="text-sm text-ava-dark-gray font-mono" style={{color: '#161617'}}>
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
      
      <button
        onClick={handleDisconnect}
        className="p-2 text-ava-dark-gray hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Disconnect wallet"
      >
        <FaSignOutAlt />
      </button>
    </div>
  );
}