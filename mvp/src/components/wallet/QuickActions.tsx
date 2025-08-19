import { FaArrowDown, FaArrowUp, FaPaperPlane } from "react-icons/fa";

interface QuickActionsProps {
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}

export function QuickActions({ onDeposit, onWithdraw, onTransfer }: QuickActionsProps) {
  return (
    <div className="bg-ava-white rounded-lg shadow-sm border border-ava-light-gray p-6">
      <h3 className="text-lg font-medium text-ava-dark-gray font-aeonik mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={onDeposit}
          className="flex items-center justify-center p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors group"
        >
          <FaArrowDown className="mr-3 group-hover:transform group-hover:translate-y-0.5 transition-transform" />
          <span className="font-medium">Deposit</span>
        </button>
        
        <button
          onClick={onTransfer}
          className="flex items-center justify-center p-4 bg-ava-blue/10 text-ava-blue rounded-lg hover:bg-ava-blue/20 transition-colors group"
        >
          <FaPaperPlane className="mr-3 group-hover:transform group-hover:translate-x-0.5 transition-transform" />
          <span className="font-medium">Send</span>
        </button>
        
        <button
          onClick={onWithdraw}
          className="flex items-center justify-center p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors group"
        >
          <FaArrowUp className="mr-3 group-hover:transform group-hover:-translate-y-0.5 transition-transform" />
          <span className="font-medium">Withdraw</span>
        </button>
      </div>
    </div>
  );
}