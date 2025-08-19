---
title: useEncryptedBalance
---

The `useEncryptedBalance` hook provides developers with an interface to manage encrypted token balances within the eERC protocol. This includes accessing decrypted and encrypted balances, as well as performing key actions such as minting, burning, transferring tokens, and fetching updated balance data. The hook is designed to simplify balance management while leveraging the protocol's encryption and privacy features.

## Usage

```javascript maxLines=0
const { useEncryptedBalance } = useEERC(...);
const {
	decryptedBalance,
	parsedDecryptedBalance,
	encryptedBalance,
	auditorPublicKey,
	decimals,
	
	// functions
	privateMint,
	privateBurn,
	privateTransfer,
	withdraw,
	deposit,
	decryptMessage,
	decryptTransaction,

	//refetch
	refetchBalance
} = useEncryptedBalance(tokenAddress?:string)
```

## Parameters

* `tokenAddress` _(optional)_ : `0x${string}` The address of the underlying ERC20 token. This parameter is only required in converter mode. 

## Returns

* `decryptedBalance: bigint`
The user's decrypted token balance
* `parsedDecryptedBalance: string`
The user's decrypted token balance as a string.
* `auditorPublicKey: bigint[]`
Auditor Public key.
* `encryptedBalance: bigint[]`
Encrypted balance of the user as an array
* `decimals: bigint`
Encrypted token decimals

## Methods

* `privateMint(recipient: string, amount: bigint, message?: string): Promise<{ transactionHash: string }>`
Mints encrypted tokens for a specified recipient address. This action can only be performed by the contract owner.
* `privateBurn(amount: bigint, message?: string): Promise<{ transactionHash: string }>`
Burns a specified amount of encrypted tokens from the user's balance.
* `privateTransfer(to: string, amount: bigint, message?: string): Promise<{ transactionHash: string, receiverEncryptedAmount: string[], senderEncryptedAmount: string[] }>`
Transfers encrypted tokens to another user.
* `withdraw(amount: bigint, message?: string): Promise<{ transactionHash: string }>`
Withdraws a specified amount of tokens from the user's balance to underlying ERC20 token address. Only available in converter mode.
* `deposit(amount: bigint, message?: string): Promise<{ transactionHash: string }>`
Converts a specified amount of ERC20 tokens to private Encrypted ERC tokens. Only available in converter mode.
* `decryptMessage(transactionHash: string): Promise<{ decryptedMessage: string, messageType: string, messageFrom: string, messageTo: string }>`
Decrypts the private message from the transaction hash. messageType points the operation that the message included in.
* `decryptTransaction(transactionHash: string): Promise<{ decryptedAmount: bigint, from: string, to: string, transactionHash: string, eventType: string, blockNumber: bigint}>`
Decrypts the private transaction from the transaction hash.
* `refetchBalance(): void`
Refetches and updates the user's encrypted and decrypted balances from the contract.

***

For any additional questions, please view our other knowledge base articles or contact a support team member via the chat button. Examples are for illustrative purposes only.

[Learn More About AvaCloud](https://avacloud.io/) | [Download Case Studies](https://avacloud.io/case-studies) | [Schedule an AvaCloud Demo](https://avacloud.io/demo)

