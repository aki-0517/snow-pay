import { BalanceCard } from "./BalanceCard";
import { QuickActions } from "./QuickActions";
import { WalletSetup } from "./WalletSetup";
import { SetupProgress } from "./SetupProgress";

interface DashboardProps {
  balance: bigint;
  isConnected: boolean;
  isDecryptionKeySet: boolean;
  isRegistered: boolean;
  isGeneratingKey: boolean;
  isRegistering: boolean;
  onGenerateKey: () => void;
  onRegister: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}

export function Dashboard({
  balance,
  isConnected,
  isDecryptionKeySet,
  isRegistered,
  isGeneratingKey,
  isRegistering,
  onGenerateKey,
  onRegister,
  onDeposit,
  onWithdraw,
  onTransfer
}: DashboardProps) {

  if (!isConnected) {
    return <WalletSetup />;
  }

  // Step 2: Generate Decryption Key
  if (!isDecryptionKeySet) {
    return (
      <div className="max-w-2xl mx-auto">
        <SetupProgress currentStep={2} />
        <div className="bg-snow-bg rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 bg-snow-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔑</span>
          </div>
          <h2 className="text-xl font-semibold text-snow-dark mb-4">
            Generate Decryption Key
          </h2>
          <p className="text-snow-gray mb-6">
            Generate a decryption key to encrypt and decrypt your private balance.
          </p>
          <button
            onClick={onGenerateKey}
            disabled={isGeneratingKey}
            className="w-full bg-snow-primary text-white px-6 py-3 rounded-lg hover:bg-snow-secondary transition-colors font-medium disabled:opacity-50"
          >
            {isGeneratingKey ? "Generating..." : "Generate Key"}
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Registration
  if (!isRegistered) {
    return (
      <div className="max-w-2xl mx-auto">
        <SetupProgress currentStep={3} />
        <div className="bg-snow-bg rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 bg-snow-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h2 className="text-xl font-semibold text-snow-dark mb-4">
            Complete Registration
          </h2>
          <p className="text-snow-gray mb-6">
            Register with the SnowPay protocol to start using private transactions.
          </p>
          <button
            onClick={onRegister}
            disabled={isRegistering}
            className="w-full bg-snow-success text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
          >
            {isRegistering ? "Registering..." : "Register Now"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Setup Complete Progress */}
      <div className="max-w-2xl mx-auto">
        <SetupProgress currentStep={4} />
      </div>

      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-snow-dark mb-2">
          Welcome to SnowPay
        </h1>
        <p className="text-snow-gray">
          Your private wallet for secure transactions
        </p>
      </div>

      {/* Balance Card */}
      <BalanceCard balance={balance} />

      {/* Quick Actions */}
      <QuickActions
        onDeposit={onDeposit}
        onWithdraw={onWithdraw}
        onTransfer={onTransfer}
      />
    </div>
  );
}