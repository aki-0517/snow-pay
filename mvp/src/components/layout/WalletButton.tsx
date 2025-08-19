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
        className="inline-flex items-center px-4 py-2 bg-snow-primary text-white rounded-lg hover:bg-snow-secondary transition-colors font-medium"
      >
        <FaWallet className="mr-2" />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center px-3 py-2 bg-snow-light border border-gray-200 rounded-lg">
        <div className="w-2 h-2 bg-snow-success rounded-full mr-2"></div>
        <span className="text-sm text-snow-dark font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
      
      <button
        onClick={handleDisconnect}
        className="p-2 text-snow-gray hover:text-snow-danger hover:bg-red-50 rounded-lg transition-colors"
        title="Disconnect wallet"
      >
        <FaSignOutAlt />
      </button>
    </div>
  );
}