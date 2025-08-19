import { FaSnowflake, FaWallet } from "react-icons/fa";

export function Logo() {
	return (
		<div className="flex items-center space-x-2">
			<div className="relative">
				<FaWallet className="h-7 w-7 text-snow-primary" />
				<FaSnowflake className="h-3 w-3 text-snow-accent absolute -top-1 -right-1" />
			</div>
			<span className="text-xl font-semibold text-snow-dark">SnowPay</span>
		</div>
	);
}
