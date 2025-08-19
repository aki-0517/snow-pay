// Contract addresses for Fuji testnet deployment
export const FUJI_CONTRACTS = {
	// EERC20 token contract (will be updated after deployment)
	EERC20_TOKEN: "0x50d4019093FE54D8ff9faE289f0bfa809623c040", // Replace with deployed address
	
	// Original contracts (keep for reference)
	EERC_STANDALONE: "0x5E9c6F952fB9615583182e70eDDC4e6E4E0aC0e0",
	EERC_CONVERTER: "0x372dAB27c8d223Af11C858ea00037Dc03053B22E",
	ERC20: "0xb0Fe621B4Bd7fe4975f7c58E3D6ADaEb2a2A35CD",
} as const;

// Network configuration for Fuji
export const FUJI_NETWORK = {
	id: 43113,
	name: "Avalanche Fuji",
	nativeCurrency: {
		name: "AVAX",
		symbol: "AVAX",
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: ["https://api.avax-test.network/ext/bc/C/rpc"],
		},
		public: {
			http: ["https://api.avax-test.network/ext/bc/C/rpc"],
		},
	},
	blockExplorers: {
		default: {
			name: "SnowTrace",
			url: "https://testnet.snowtrace.io",
		},
	},
	testnet: true,
} as const;

// Updated explorer URLs for Fuji
export const FUJI_EXPLORER = {
	BASE_URL: "https://testnet.snowtrace.io/address/",
	TX_URL: "https://testnet.snowtrace.io/tx/",
} as const;

// Integration helper functions
export const getFujiContractUrl = (address: string) => `${FUJI_EXPLORER.BASE_URL}${address}`;
export const getFujiTxUrl = (txHash: string) => `${FUJI_EXPLORER.TX_URL}${txHash}`;

export type FujiContractType = keyof typeof FUJI_CONTRACTS;