import { useState, useMemo } from "react";
import { IoChevronDown, IoArrowUp, IoArrowDown, IoArrowForward, IoOpenOutline } from "react-icons/io5";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "transfer";
  amount: string;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
  hash?: string;
  from?: string;
  to?: string;
  blockNumber?: number;
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "deposit",
    amount: "100.0",
    timestamp: new Date("2024-01-15T10:30:00"),
    status: "completed",
    hash: "0x1234...abcd",
    from: "0x1234...5678",
    blockNumber: 12345678,
  },
  {
    id: "2", 
    type: "transfer",
    amount: "25.5",
    timestamp: new Date("2024-01-14T15:45:00"),
    status: "completed",
    hash: "0x5678...efgh",
    to: "0x9876...5432",
    blockNumber: 12345677,
  },
  {
    id: "3",
    type: "withdraw",
    amount: "50.0",
    timestamp: new Date("2024-01-13T09:15:00"),
    status: "pending",
    hash: "0x9012...ijkl",
    to: "0x1111...2222",
  },
  {
    id: "4",
    type: "transfer",
    amount: "10.0",
    timestamp: new Date("2024-01-12T14:20:00"),
    status: "failed",
    hash: "0x3456...mnop",
    to: "0x3333...4444",
    blockNumber: 12345675,
  },
];

type FilterType = "all" | "deposit" | "withdraw" | "transfer";
type StatusFilter = "all" | "pending" | "completed" | "failed";

export function TransactionHistory() {
  const [isOpen, setIsOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateRange, setDateRange] = useState<string>("all");

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(tx => {
      const typeMatch = typeFilter === "all" || tx.type === typeFilter;
      const statusMatch = statusFilter === "all" || tx.status === statusFilter;
      
      let dateMatch = true;
      if (dateRange !== "all") {
        const now = new Date();
        const days = parseInt(dateRange);
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        dateMatch = tx.timestamp >= cutoff;
      }
      
      return typeMatch && statusMatch && dateMatch;
    });
  }, [typeFilter, statusFilter, dateRange]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <IoArrowDown className="w-4 h-4 text-green-500" />;
      case "withdraw":
        return <IoArrowUp className="w-4 h-4 text-red-500" />;
      case "transfer":
        return <IoArrowForward className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "failed":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {filteredTransactions.length}
          </span>
        </div>
        <IoChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="border-t border-gray-200">
          {/* Filters */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdraw">Withdrawals</option>
                  <option value="transfer">Transfers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No transactions found matching your filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {transaction.type}
                            </p>
                            <span className={getStatusBadge(transaction.status)}>
                              {transaction.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {transaction.timestamp.toLocaleDateString()} {transaction.timestamp.toLocaleTimeString()}
                          </div>
                          {(transaction.from || transaction.to) && (
                            <div className="text-xs text-gray-500 mt-1">
                              {transaction.from && `From: ${formatAddress(transaction.from)}`}
                              {transaction.to && `To: ${formatAddress(transaction.to)}`}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.amount} DMT
                        </p>
                        {transaction.hash && (
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-xs text-gray-500">
                              {formatAddress(transaction.hash)}
                            </span>
                            <button
                              onClick={() => window.open(`https://testnet.snowtrace.io/tx/${transaction.hash}`, '_blank')}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <IoOpenOutline className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {transaction.blockNumber && (
                          <div className="text-xs text-gray-500 mt-1">
                            Block: {transaction.blockNumber.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}