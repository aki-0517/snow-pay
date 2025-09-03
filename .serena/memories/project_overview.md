# SnowPay Wallet - Project Overview

## Purpose
SnowPay Wallet is a privacy-focused payment and transfer application that operates on the Avalanche C-Chain. It enables users to safely move assets while keeping their transaction histories and balances hidden from external observers through encryption and zero-knowledge proofs.

## Key Features
- **Private Transfers**: Privacy protection through encryption of transfer amounts and balances
- **Asset Concealment**: Separation of transaction history through deposits, transfers, and withdrawals
- **Simple Operation**: Intuitive user interface
- **Avalanche Integration**: Designed specifically for the Avalanche C-Chain network

## How It Works
1. **Deposit**: Users deposit assets from their wallet into the app's private environment
2. **Private Transfer**: Execute transfers to other users using private balances  
3. **Withdraw**: Withdraw as original ERC20 tokens when needed

This breaks the direct connection between sender and recipient addresses on the blockchain.

## Project Structure
- **mvp/**: Main React frontend application
- **mvp-mobile/**: React Native mobile app using Expo
- **eerc-backend-converter/**: Smart contracts and backend for encrypted ERC-20 functionality
- **docs/**: Documentation
- **.serena/**: Serena MCP configuration files