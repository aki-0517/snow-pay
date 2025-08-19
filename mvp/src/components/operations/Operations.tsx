import { Deposit } from "./Deposit";
import { Transfer } from "./Transfer";
import { Withdraw } from "./Withdraw";

interface OperationsProps {
	handlePrivateTransfer: (to: string, amount: string) => Promise<void>;
	handlePrivateDeposit: (amount: string) => Promise<void>;
	handlePrivateWithdraw: (amount: string) => Promise<void>;
	mode: "converter";
	isDecryptionKeySet: boolean;
	refetchBalance: () => void;
	balance?: bigint;
}

export function Operations({
	handlePrivateTransfer,
	handlePrivateDeposit,
	handlePrivateWithdraw,
	isDecryptionKeySet,
	mode,
	refetchBalance,
	balance,
}: OperationsProps) {

	const handlePrivateTransfer_ = async (to: string, amount: string) => {
		await handlePrivateTransfer(to, amount);
		refetchBalance();
	};

	const handlePrivateDeposit_ = async (amount: string) => {
		await handlePrivateDeposit(amount);
		refetchBalance();
	};

	const handlePrivateWithdraw_ = async (amount: string) => {
		await handlePrivateWithdraw(amount);
		refetchBalance();
	};

	return (
		<div className="flex flex-col font-mono space-y-2">
			<p className="text-sm text-cyber-gray font-mono leading-relaxed mb-4 mt-2 indent-6">
				All operations below are fully encrypted using elliptic curve
				cryptography. When you mint, transfer, or burn tokens, the data is
				encrypted with your public key so that only you can decrypt and view
				your balances. For transfer operations, the recipient’s public key will
				be automatically fetched from the protocol to encrypt the tokens for
				them.
			</p>

			{mode === "converter" && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="border border-cyber-green/30 bg-black/10 rounded-lg p-4 flex flex-col min-h-[200px]">
						<Deposit
							handlePrivateDeposit={handlePrivateDeposit_}
							isDecryptionKeySet={isDecryptionKeySet}
							balance={balance}
						/>
					</div>

					<div className="border border-cyber-green/30 bg-black/10 rounded-lg p-4 flex flex-col min-h-[200px] ">
						<Withdraw
							handlePrivateWithdraw={handlePrivateWithdraw_}
							isDecryptionKeySet={isDecryptionKeySet}
							balance={balance}
						/>
					</div>
				</div>
			)}

			<div className="border border-cyber-green/30 bg-black/10 rounded-lg p-4 flex flex-col min-h-[200px]">
				<Transfer
					handlePrivateTransfer={handlePrivateTransfer_}
					isDecryptionKeySet={isDecryptionKeySet}
					balance={balance}
				/>
			</div>
		</div>
	);
}
