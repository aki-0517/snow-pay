---
title: Withdrawal Operation
---

When a user wants to withdraw their tokens from the encrypted system, they initiate a withdrawal process that involves both their encrypted balance and regular ERC20 tokens. The process starts with the user's encrypted balance, which is stored in the smart contract. When initiating a withdrawal, the user must first prove they have sufficient funds through a withdrawal circuit.

```solidity
type WithdrawCircuit struct {
	Sender      WithdrawSender
	Auditor     Auditor
	ValueToBurn frontend.Variable `gnark:",public"`
}
```

The circuit takes three key pieces of information: the sender's details (including their encrypted balance), the auditor's information, and the amount they want to withdraw (ValueToBurn). This amount is marked as public since it will eventually be visible on-chain when converted to regular ERC20 tokens.

Before processing the withdrawal, the system performs several validations through the circuit. It verifies the user's identity using their public-private key pair and confirms their encrypted balance is sufficient for the withdrawal. The circuit also creates an encrypted record for the auditor, ensuring regulatory compliance without compromising privacy.

The smart contract then handles the actual withdrawal process. It first updates the user's encrypted balance by subtracting the withdrawal amount. This operation happens in encrypted space using ElGamal encryption. The contract also updates the user's _balancePCT_, which represents their current balance state after the withdrawal.

Finally, the contract handles the conversion from encrypted to regular ERC20 tokens. This step includes managing any necessary decimal adjustments between the two token systems, as different tokens might have different decimal places. The contract calculates the correct amount and transfers the regular ERC20 tokens to the user's address.

***

For any additional questions, please view our other knowledge base articles or contact a support team member via the chat button. Examples are for illustrative purposes only.

[Learn More About AvaCloud](https://avacloud.io/) | [Download Case Studies](https://avacloud.io/case-studies) | [Schedule an AvaCloud Demo](https://avacloud.io/demo)

