---
title: Encrypted Balances
---

## Registration

For every Encrypted ERC contract a user registers, they generate a unique keypair:

- An encryption key stored in the Encrypted ERC smart contract.
- A decryption key kept securely by the user.

These keys are generated during the user's registration to the protocol and are completely independent of the user's on-chain account keys.

## Encrypted Balance
User balances are encrypted with the encryption key to maintain confidentiality. The protocol uses two types of encryption: ElGamal Encryption and Poseidon Encryption.

Encrypted balances are stored in the Encrypted ERC smart contract as a mapping of user addresses to encrypted balances.

```solidity
mapping(address user => EncryptedBalance balance) balances;
```

The encrypted balance contains the following fields:

* <code>eGCT</code> - ElGamal Ciphertext of the user's balance.
* <code>balanceList</code> - records the history of the user's balance.
* <code>nonce</code> - used to invalidate old balance states.
* <code>transactionIndex</code> - used to store the current balance state.
* <code>balancePCT</code> - Poseidon Ciphertext of the user's balance.
* <code>amountPCTs</code> - Poseidon Ciphertexts of the user's received amounts.

```solidity
struct EncryptedBalance {
    EGCT eGCT;
    mapping(uint256 index => BalanceHistory history) balanceList;
    uint256 nonce;
    uint256 transactionIndex;
    uint256[7] balancePCT; 
    AmountPCT[] amountPCTs;
}
```

## Balance List & Nonce

Whenever a balance-changing action (mint, deposit, transfer, burn, withdraw) finishes, the contract computes

```solidity
hash = keccak256(eGCT ‖ nonce)
```

and stores `BalanceHistory{index: transactionIndex, isValid: true}` at `balanceList[hash]`.

Later, when a user submits a zero-knowledge proof, they include the matching ciphertext.

The contract re-computes the same hash and checks balanceList to decide whether that ciphertext really is the latest one. If anything has touched the balance after the proof was generated, the stored hash has already changed and the proof fails.

Instead of iterating through balanceList to mark old hashes invalid, the contract increments the nonce. Because the hash key always includes nonce, every pre-existing key becomes invalid. The next balance commit will be formed with the new nonce, starting a fresh logical epoch. This O(1) invalidation is crucial to keep gas per spend bounded even after thousands of prior deposits.

## Transaction Index

Each time the contract writes a new entry into balanceList it tags the event with the current transactionIndex, then increments the counter.
The same index is embedded in each AmountPCT record.
When a withdrawal, burn, or transfer succeeds, the contract already knows which transactionIndex corresponds to the ciphertext used in the proof. Starting from the end of the amountPCTs array, the function discards every record with older index.

## Why this system is needed ?

* `balanceList` provides the yes/no answer: “Is the ciphertext in this proof still current?”
* `transactionIndex` gives a seekable position inside amountPCTs so the contract can remove or keep individual records.
* `nonce` prevents the size of balanceList and its maintenance cost from growing forever by letting the contract wipe whole eras at once.

A proof prepared off-chain is only valid for the exact (eGCT, nonce) pair that existed when it was built.
If anyone injects a new transaction that changes the ciphertext before the proof is mined, the hash changes, the balanceList lookup fails, and the attacker learns nothing except that the victim tried to spend. Conversely, once the victim’s spend succeeds, nonce is bumped, so any stale copy of that proof left in the mempool can never be replayed.
The end result is a balance-tracking scheme that is:
- **verifiable** - proofs must reference a hash that balanceList marks valid,
- **efficient** - nonce invalidates entire old eras in constant gas, and
- **orderly** - transactionIndex lets the contract edit per-deposit records precisely.

***

For any additional questions, please view our other knowledge base articles or contact a support team member via the chat button. Examples are for illustrative purposes only.

[Learn More About AvaCloud](https://avacloud.io/) | [Download Case Studies](https://avacloud.io/case-studies) | [Schedule an AvaCloud Demo](https://avacloud.io/demo)

