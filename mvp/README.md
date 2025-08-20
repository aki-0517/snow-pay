# SnowPay Wallet

A privacy-focused payment and transfer application on Avalanche C-Chain

## Overview and Purpose

SnowPay Wallet is a privacy-focused payment and transfer application that operates on the Avalanche C-Chain.

Transactions on public blockchains can be tracked by anyone due to their transparency, which poses significant privacy challenges. This application provides a solution that allows users to move assets safely and easily while concealing their transaction history and balances from external observers.

### Key Features

- **Private Transfers**: Privacy protection through encryption of transfer amounts and balances
- **Asset Concealment**: Separation of transaction history through deposits, transfers, and withdrawals
- **Easy Operation**: Intuitive user interface
- **Avalanche Integration**: Designed specifically for the Avalanche C-Chain network

### Target Users

- Individuals and businesses who prioritize financial privacy
- Users who do not want to expose their asset status or transaction history
- Cryptocurrency users seeking simple and intuitive operation

## How It Works

1. **Deposit**: Users deposit assets from their wallet into a private environment within the app
2. **Private Transfer**: Execute transfers to other users using private balances
3. **Withdrawal**: Withdraw back to original ERC20 tokens when needed

This breaks the direct connection between sender and recipient addresses on the blockchain.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Avalanche Brand Guidelines
- **Blockchain**: Avalanche Fuji Testnet
- **Privacy Technology**: eERC SDK (Encrypted ERC-20)
- **Wallet Connection**: WalletConnect/AppKit
- **Zero-Knowledge Proofs**: Circom circuits

## Setup

### Requirements

- Node.js (v16 or later)
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

3. Start the development server:
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

#### Encrypted Balance
Balances are encrypted using zero-knowledge proofs, making them invisible to external observers while allowing users to view and use their funds.

#### Private Transfer
When transferring tokens, amounts are encrypted, ensuring transaction privacy while maintaining blockchain transparency and security.

#### Decryption Key
Using the generated decryption key, only the user can decrypt and view their private balance.

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
│   ├── layout/         # Headers, logos, etc.
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
- Use testnet for development and testing
- Keep your wallet software up to date

## License

This project is licensed under the MIT License.

## Support

For questions and support:
- Create an issue in this repository
- Check the [documentation](docs/)
- Review smart contract integration in the config folder

## Roadmap

- [ ] Improve mobile responsive design
- [ ] Additional privacy features
- [ ] Multi-token support
- [ ] Enhanced UI/UX
- [ ] Mainnet deployment
- [ ] Advanced transaction history features

---

**Note**: This is experimental software. Use only on testnet for development purposes and at your own risk.