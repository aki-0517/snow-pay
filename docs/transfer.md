---
title: Transfer Operation
---

The transfer process begins with three main participants: a sender, a receiver, and an auditor. Each transfer operation must maintain privacy while ensuring security and regulatory compliance.

When a user initiates a transfer, the user needs to prove some data using Zero-Knowledge circuits. First, it checks if the sender has sufficient funds for the transfer. The system can confirm the sender has enough tokens without revealing their actual balance to anyone. Next, it verifies the sender's identity using their public-private key pair. This is similar to checking a digital signature, ensuring only the rightful owner can transfer their tokens.

```solidity
type TransferCircuit struct {
	Sender          Sender
	Receiver        Receiver
	Auditor         Auditor
	ValueToTransfer frontend.Variable
}
```

The actual transfer involves creating two encrypted values:

* A negative amount (subtraction) for the sender

* A positive amount (addition) for the receiver

Both of these values are encrypted using ElGamal encryption, which allows mathematical operations on encrypted values. The system uses the BabyJubJub elliptic curve for these cryptographic operations. For each transfer, the system also creates _AmountPCT_ for the receiver that contain the encrypted transaction details.

When the sender's balance is updated, their BalancePCT is also updated to reflect the new state. This creates a verifiable proof of the remaining balance after the subtraction. The system maintains a history of these changes through a nonce mechanism - instead of deleting old records, it simply increments the nonce to invalidate previous states.

For regulatory compliance, the system creates a special encrypted summary for the auditor. This summary contains the transfer details but can only be decrypted by the designated auditor using their private key.

The transfer is recorded in the system's state through several updates:

* The sender's encrypted balance is updated by subtracting the transfer amount

* The sender's BalancePCT is updated to reflect their new balance state

* The receiver's encrypted balance is updated by adding the transfer amount

* New AmountPCT is created and stored for receiver

* The auditor receives their encrypted transaction summary

Throughout this process, all sensitive information (balances, transfer amounts) remains encrypted. The only publicly visible information is that a transfer occurred between two addresses. The actual amounts and balances are only visible to the parties directly involved and the authorized auditor. The combination of AmountPCTs and BalancePCTs creates a complete, verifiable history of transactions while maintaining privacy and enabling necessary compliance checks.

***

For any additional questions, please view our other knowledge base articles or contact a support team member via the chat button. Examples are for illustrative purposes only.

[Learn More About AvaCloud](https://avacloud.io/) | [Download Case Studies](https://avacloud.io/case-studies) | [Schedule an AvaCloud Demo](https://avacloud.io/demo)

