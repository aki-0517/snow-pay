import { FaArrowDown, FaArrowUp, FaPaperPlane } from "react-icons/fa";

interface QuickActionsProps {
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}

export function QuickActions({ onDeposit, onWithdraw, onTransfer }: QuickActionsProps) {
  return (
    <div className="bg-snow-bg rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-snow-dark mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={onDeposit}
          className="flex items-center justify-center p-4 bg-snow-success/10 text-snow-success rounded-lg hover:bg-snow-success/20 transition-colors group"
        >
          <FaArrowDown className="mr-3 group-hover:transform group-hover:translate-y-0.5 transition-transform" />
          <span className="font-medium">Deposit</span>
        </button>
        
        <button
          onClick={onTransfer}
          className="flex items-center justify-center p-4 bg-snow-primary/10 text-snow-primary rounded-lg hover:bg-snow-primary/20 transition-colors group"
        >
          <FaPaperPlane className="mr-3 group-hover:transform group-hover:translate-x-0.5 transition-transform" />
          <span className="font-medium">Send</span>
        </button>
        
        <button
          onClick={onWithdraw}
          className="flex items-center justify-center p-4 bg-snow-warning/10 text-snow-warning rounded-lg hover:bg-snow-warning/20 transition-colors group"
        >
          <FaArrowUp className="mr-3 group-hover:transform group-hover:-translate-y-0.5 transition-transform" />
          <span className="font-medium">Withdraw</span>
        </button>
      </div>
    </div>
  );
}