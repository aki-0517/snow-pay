---
title: Protocol Overview
---

The Encrypted ERC system combines smart contracts and zero-knowledge circuits to create a privacy-preserving token system on the blockchain. While traditional tokens expose all transaction details publicly, Encrypted ERC ensures that balances and transfer amounts remain confidential while maintaining verifiability.

The protocol has two versions: Standalone and Converter. Each one has different functions designed for specific uses in the token ecosystem.

## Standalone Version

The Standalone version lets users create new private tokens. This is similar to creating a standard ERC-20 token, where you also set a name and symbol for the token. It's perfect for users who want to launch new tokens with built-in privacy features.

Key features of the Standalone version include:
* **Private Minting:** This allows users to create new tokens privately, adding to the total supply while keeping the transaction details confidential.
* **Private Burning:** Users can burn tokens privately, removing them from circulation while ensuring that transaction details stay private.

## Converter Version

The Converter version is for adding privacy features to existing tokens. It converts standard ERC-20 tokens into private versions, providing privacy without changing the original token setup.

Key functions of the Converter version include:
* **Deposit:** Users can deposit their existing ERC-20 tokens into the system to convert them into private tokens, keeping the original token features intact while adding privacy.
* **Withdraw:** This lets users take out their private tokens, giving them the ability to switch their tokens between private and public as needed.

## Structure

The system employs various circuits to handle different operations. The Registration Circuit verifies the user's cryptographic credentials, ensuring the public key is correctly derived from the private key. The Transfer Circuit manages private token transfers, ensuring the sender has sufficient balance and that the transaction is correctly encrypted for the receiver and auditor. The Mint Circuit handles the creation of new tokens, ensuring the mint amount is properly encrypted and verifiable by the auditor. Lastly, the Withdraw Circuit manages the conversion of private tokens back to public ones, verifying the user's balance and ensuring the operation is auditable. 

Cryptographic operations within the system rely on elliptic curve cryptography, specifically the BabyJubjub curve, to perform secure operations. The system uses ElGamal encryption for balance privacy and Poseidon encryption for creating verifiable audit trails. These cryptographic techniques ensure that all token operations are conducted privately and securely. 

The use of zero-knowledge proofs allows the system to verify transactions without revealing sensitive information, maintaining the integrity and confidentiality of user data on the blockchain. This architecture ensures that while the blockchain maintains its transparency for verification purposes, user privacy is preserved at all levels of operation.

***

For any additional questions, please view our other knowledge base articles or contact a support team member via the chat button. Examples are for illustrative purposes only.

[Learn More About AvaCloud](https://avacloud.io/) | [Download Case Studies](https://avacloud.io/case-studies) | [Schedule an AvaCloud Demo](https://avacloud.io/demo)

