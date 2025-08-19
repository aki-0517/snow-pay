---
title: Registration
---

When the owner of the protocol wants to mint encrypted tokens in standalone mode, they initiate a minting process that creates new encrypted tokens directly within the system, similar to how a traditional ERC20 token mint works. This process uses zero-knowledge proofs to maintain privacy while ensuring the mint operation is valid and authorized.

```solidity
type RegistrationCircuit struct {
	Sender RegistrationSender
}
```

The registration circuit is the smallest circuit in the protocol taking only the sender's registration details, which include their private key, public key, and registration hash. This simple yet crucial circuit serves as the entry point for all subsequent private operations within the Encrypted ERC system.

Before a user can participate in any encrypted operations, the system verifies that the sender's public key is mathematically well-formed, ensuring it follows the proper elliptic curve cryptography standards on the BabyJubJub curve. The circuit also validates that the sender's registration hash which is the Poseidon Hash of the chain id, private key and address of the user. This check is essential to prevent a user registering to the system using another user's proof and other proofs from different chains.

The registration process is handled by a separate registrar contract that works in conjunction with the Encrypted ERC system. When a user successfully completes registration, their public key and registration details are stored in the registrar contract, making them eligible to participate in private mints, transfers, and withdrawals. The Encrypted ERC contract validates user participation by checking their registration status through the registrar.

***

For any additional questions, please view our other knowledge base articles or contact a support team member via the chat button. Examples are for illustrative purposes only.

[Learn More About AvaCloud](https://avacloud.io/) | [Download Case Studies](https://avacloud.io/case-studies) | [Schedule an AvaCloud Demo](https://avacloud.io/demo)

