# SnowPay Wallet

A privacy-focused payment and transfer application on Avalanche C-Chain

## Overview and Purpose

SnowPay Wallet is a privacy-focused payment and transfer application that operates on the Avalanche C-Chain.

Public blockchain transactions are transparent, allowing anyone to track balances and transaction histories. This presents significant challenges from a privacy perspective. This application provides a solution that enables users to safely and easily move assets while keeping their transaction histories and balances hidden from external observers.

### Key Features

- **Private Transfers**: Privacy protection through encryption of transfer amounts and balances
- **Asset Concealment**: Separation of transaction history through deposits, transfers, and withdrawals
- **Simple Operation**: Intuitive user interface
- **Avalanche Integration**: Designed specifically for the Avalanche C-Chain network

### Target Users

- Individuals and corporations who value financial privacy
- Users who don't want to publicly expose their asset status or transaction history
- Crypto asset users seeking simple and intuitive operability

## How It Works

1. **Deposit**: Users deposit assets from their wallet into the app's private environment
2. **Private Transfer**: Execute transfers to other users using private balances
3. **Withdraw**: Withdraw as original ERC20 tokens when needed

This breaks the direct connection between sender and recipient addresses on the blockchain.

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Avalanche Brand Guidelines
- **Blockchain**: Avalanche Fuji Testnet
- **Privacy Technology**: eERC SDK (Encrypted ERC-20)
- **Wallet Connection**: WalletConnect/AppKit
- **Zero-Knowledge Proofs**: Circom circuits

## Setup

### Requirements

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or other Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mvp
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Production Build

```bash
npm run build
```

## Usage

### Basic Flow

1. **Connect Wallet**: Click "Connect Wallet" to connect your Web3 wallet
2. **Generate Decryption Key**: Create a decryption key for private transactions
3. **Register**: Complete registration with the SnowPay protocol
4. **Deposit**: Add funds to your private balance
5. **Transfer**: Execute private transfers to other users
6. **Withdraw**: Return funds to your public wallet

### Privacy Features Details

#### Encrypted Balances
Balances are encrypted using zero-knowledge proofs, making them invisible to external observers while allowing users to verify and use their funds.

#### Private Transfers
When sending tokens, amounts are encrypted, ensuring transaction privacy while maintaining blockchain transparency and security.

#### Decryption Keys
Only users can decrypt and verify their private balances using the generated decryption keys.

## Smart Contracts

The application integrates with the following contracts:
- **eERC Converter**: Handles conversion between public ERC-20 and encrypted tokens
- **Demo Token (DMT)**: Test token for demonstration purposes
- **Privacy Circuits**: Zero-knowledge circuits for transaction privacy

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Header, logo, etc.
│   ├── wallet/         # Wallet-related components
│   ├── forms/          # Form components
│   └── operations/     # Transaction operations
├── config/             # Configuration files
├── pages/              # Page components
├── pkg/                # Utility packages
└── main.tsx           # Application entry point
```

## Brand Guidelines

This application follows Avalanche brand guidelines:

### Colors
- **Primary**: Avalanche Blue (`#3055B3`)
- **Secondary**: Bright Blue (`#058AFF`)
- **Background**: Light Gray (`#F5F5F9`)
- **Text**: Dark Gray (`#161617`)

### Typography
- **Primary Font**: Inter
- **Display Font**: Poppins (Aeonik alternative)
- **Monospace Font**: Anonymous Pro

## Security

- Never share your private keys or decryption keys
- Always verify transaction details before confirming
- Use testnets for development and testing
- Keep your wallet software up to date

## License

This project is licensed under the MIT License.

---

**Notice**: This is experimental software. Use only on testnets for development purposes and at your own risk.