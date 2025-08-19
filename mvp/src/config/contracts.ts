// Contract addresses for MVP
export const CONTRACTS = {
	EERC_CONVERTER: "0x372dAB27c8d223Af11C858ea00037Dc03053B22E",
	ERC20: "0xb0Fe621B4Bd7fe4975f7c58E3D6ADaEb2a2A35CD",
	// EERC_CONVERTER: "0x414832f725896400ad8A9cC2F97046f59e044490",
	// ERC20: "0x39ae55953352D47F07CC68Ffa90B34B9a7Bf388D",
	// EERC20: "0xA20B0d223c08BE56b4d7774Cb83F225716C49674",
} as const;

// Network configuration for Avalanche Fuji testnet
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

// Circuit configuration for zero-knowledge proofs
export const CIRCUIT_CONFIG = {
	register: {
		wasm: "/RegistrationCircuit.wasm",
		zkey: "/RegistrationCircuit.groth16.zkey",
	},
	mint: {
		wasm: "/MintCircuit.wasm",
		zkey: "/MintCircuit.groth16.zkey",
	},
	transfer: {
		wasm: "/TransferCircuit.wasm",
		zkey: "/TransferCircuit.groth16.zkey",
	},
	withdraw: {
		wasm: "/WithdrawCircuit.wasm",
		zkey: "/WithdrawCircuit.groth16.zkey",
	},
} as const;

// Explorer URLs for Snowtrace (Avalanche testnet)
export const EXPLORER_BASE_URL = "https://testnet.snowtrace.io/address/";
export const EXPLORER_BASE_URL_TX = "https://testnet.snowtrace.io/tx/";

// Helper functions for explorer URLs
export const getContractUrl = (address: string) => `${EXPLORER_BASE_URL}${address}`;
export const getTxUrl = (txHash: string) => `${EXPLORER_BASE_URL_TX}${txHash}`;

// Mode types
export type EERCMode = "converter";
