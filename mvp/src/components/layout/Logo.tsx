import { FaSnowflake, FaWallet } from "react-icons/fa";

export function Logo() {
	return (
		<div className="flex items-center space-x-2">
			<div className="relative">
				<FaWallet className="h-7 w-7 text-ava-blue" style={{color: '#3055B3'}} />
				<FaSnowflake className="h-3 w-3 text-ava-blue-secondary absolute -top-1 -right-1" style={{color: '#058AFF'}} />
			</div>
			<span className="text-xl font-semibold text-ava-dark-gray font-aeonik" style={{color: '#161617', fontFamily: 'Poppins, Inter, sans-serif', fontWeight: 500}}>SnowPay</span>
		</div>
	);
}
