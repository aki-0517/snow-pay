---
title: Mint Operation
---

<Warning>
Only available in Standalone mode.
</Warning>

When the owner of the protocol wants to mint encrypted tokens in standalone mode, they initiate a minting process that creates new encrypted tokens directly within the system, similar to how a traditional ERC20 token mint works. This process uses zero-knowledge proofs to maintain privacy while ensuring the mint operation is valid and authorized.

```solidity
type MintCircuit struct {
	Receiver      Receiver
	Auditor       Auditor
	MintNullifier MintNullifier
	ValueToMint   frontend.Variable
}
```

The circuit takes four key pieces of information: the receiver's details (who will receive the encrypted tokens), the auditor's information for compliance tracking, a mint nullifier to prevent double-spending attacks, and the amount to be minted (ValueToMint). The mint amount isn't marked as public since the minting process maintains the privacy throughout.

Before processing the mint, the system performs several critical validations through the circuit. It verifies that the receiver's encrypted value correctly represents the desired mint and also validates that the mint nullifier hasn't been used before through a check of MintNullifier, which is the Poseidon Hash of the chain id and auditor ciphertext. This mechanism is used to prevent the multiple usage of the same proof in one chain. Additionally, it ensures both the receiver's and auditor's encrypted summaries are properly formed and include the mint amount, encrypted with their respective public keys.

The smart contract handles the actual minting through advanced cryptographic operations. The resulting ElGamal ciphertext is homomorphically added to user's current balance, allowing the user to increase thier encrypted balance without revealing any amounts. This homomorphic property of ElGamal encryption means that adding encrypted values together produces an encryption of the sum, maintaining privacy throughout the operation.  The contract also updates the user's balancePCT, which represents their current balance state after the mint.

***

For any additional questions, please view our other knowledge base articles or contact a support team member via the chat button. Examples are for illustrative purposes only.

[Learn More About AvaCloud](https://avacloud.io/) | [Download Case Studies](https://avacloud.io/case-studies) | [Schedule an AvaCloud Demo](https://avacloud.io/demo)

