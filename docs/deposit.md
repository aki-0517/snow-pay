---
title: Deposit Operation
---

<Warning>
Only available in the Converter mode.
</Warning>

## Token Tracker

The Converter mode of the protocol uses a Token Tracker system to manage multiple ERC20 tokens that can be converted into their encrypted versions. Each token gets assigned a unique ID number, starting from 1 (ID 0 is reserved for the standalone mode of EncryptedERC).

First, the system checks if the token being deposited is already registered in the protocol. If it's a new token, the contract automatically adds it to the tracked tokens list and assigns it a unique token ID. This tracking system allows the protocol to handle multiple different ERC20 tokens while keeping them organized in the encrypted space. 

## Deposit

Unlike withdrawal, transfer, mint and register which all require zero-knowledge proofs, deposit operation is handled differently, requiring no proofs. This is because deposits are moving tokens from a public state (regular ERC20) to a private state (encrypted balances). When depositing, the user is simply converting their publicly visible ERC20 tokens into encrypted tokens. The protocol can verify this operation through standard ERC20 transfer functions and balance checks - there's no need to prove anything about private states because:

* The initial balance is publicly known (it's the deposit amount)

* The transfer of ERC20 tokens is publicly verifiable on-chain

When users try to deposit different tokens, they might encounter tokens with varying decimal places (like USDC with 6 decimals or WETH with 18 decimals). Therefore the protocol needs to handle these differences smoothly, without any lose of user's tokens. The conversion process handles any necessary decimal adjustments between the original token and the encrypted one. 

```solidity
if (tokenDecimals > decimals) {
    uint256 scalingFactor = 10 ** (tokenDecimals - decimals);
    value = _amount / scalingFactor;
    dust = _amount % scalingFactor;
} else if (tokenDecimals < decimals) {
    uint256 scalingFactor = 10 ** (decimals - tokenDecimals);
    value = _amount * scalingFactor;
    dust = 0;
}
```

After adjusting the decimals, the system creates an encrypted version of the deposit amount using ElGamal encryption on the BabyJubJub curve. This encryption uses the depositor's public key, ensuring that only they can later access these tokens.

For first-time deposits, the protocol initializes a new encrypted balance. For subsequent deposits, it adds the new encrypted amount using homomorphic addition:

```solidity
if (balance.eGCT.c1.X == 0 && balance.eGCT.c1.Y == 0) {
    balance.eGCT = _eGCT;
} else {
    balance.eGCT.c1 = BabyJubJub._add(balance.eGCT.c1, _eGCT.c1);
    balance.eGCT.c2 = BabyJubJub._add(balance.eGCT.c2, _eGCT.c2);
}
```

Each deposit operation also stores an amountPCT which will be essential for verifying future transactions within the encrypted system. This creates a secure bridge between public and private token states while maintaining the mathematical properties needed for later encrypted operations.

## Dust

When users deposit tokens with a higher number of decimal places than what the encrypted system can process, it may lead to tiny remainders or "dust" amounts. This occurs because the system can only support a certain level of decimal precision, and any surplus beyond this precision becomes these dust amounts. Such minute tokens are not convertible within the system but are not lost. Instead, the system responsibly tracks these dust amounts on behalf of the user and automatically returns these tokens. This mechanism is implemented to provide transparency and maintain trust, allowing users to effortlessly manage and retrieve any outstanding fractional tokens, thus upholding the integrity of their digital assets.

***

For any additional questions, please view our other knowledge base articles or contact a support team member via the chat button. Examples are for illustrative purposes only.

[Learn More About AvaCloud](https://avacloud.io/) | [Download Case Studies](https://avacloud.io/case-studies) | [Schedule an AvaCloud Demo](https://avacloud.io/demo)

