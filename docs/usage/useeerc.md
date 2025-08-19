---
title: useEERC
---

The `useEERC` hook is the main entry point for the SDK, responsible for initializing and managing interactions with the Encrypted ERC (eERC) protocol. It connects to the eERC contract, ensuring access to core functionalities such as user registration, encrypted token management, and balance decryption.

## Usage

```javascript maxLines=0
const { publicClient } = usePublicClient();
const { walletClient } = useWalletClient();

const {
    isInitialized,
    isAllDataFetched,
    isRegistered,
    isConverter,
    publicKey,
    auditorAddress,
    owner,
    auditorPublicKey,
    isAuditorKeySet,
    name,
    symbol,
    isDecryptionKeySet,
    areYouAuditor,
    hasBeenAuditor,
​
    // actions
    generateDecryptionKey,
    register,
    auditorDecrypt,
    isAddressRegistered,
    useEncryptedBalance,
    refetchEercUser,
    refetchAuditor,
    setContractAuditorPublicKey,
} = useEERC(
    publicClient,
    walletClient,
    contractAddress,
    circuitURLs,
    decryptionKey
);
```

## Parameters

* `publicClient` : [PublicClient](https://viem.sh/docs/clients/public.html)
* `walletClient` : [Wallet Client](https://viem.sh/docs/clients/wallet.html) for sending transactions
* `contractAddress` : Address of the deployed eERC contract

* `circuitURLs` : 
```javascript maxLines=0
    {
      register: {
        wasm: string,
        zkey: string,
      },
      transfer: {
        wasm: string,
        zkey: string,
      },
      mint: {
        wasm: string,
        zkey: string,
      },
      withdraw: {
        wasm: string,
        zkey: string,
      },
      burn: {
        wasm: string,
        zkey: string,
      },
    }
```
`wasm/zkey URLs` : The URLs of the files used for generating the proofs. Files can be found in the [EncryptedERC](https://github.com/ava-labs/EncryptedERC/tree/main/circom/build) repository.

* `decryptionKey` _(optional)_ : `string` A decryption key associated with the user's account. If not provided, the decryption key can be generated during registration or using the `generateDecryptionKey` method.

<Error>
If the Wasm files are being served locally, ensure the URLs start with `/` (e.g., `/path/to/wasm_file.wasm`). For remote files, provide the full URL (e.g., `https://example.com/wasm_file.wasm`). Incorrect URL formatting may prevent the Wasm modules from loading correctly.
</Error>

<Error>
The decryption key can be generated during the registration process or by calling the `generateDecryptionKey` function. However, it is essential to use a wallet created with a seed and not through an MPC or any other mechanism that generates wallets without a deterministic seed. During decryption key derivation, the user signs a predefined message. If the wallet lacks a consistent seed, the signature will vary, and the user will not be able to use the protocol correctly. Always ensure the wallet is securely and deterministically generated using a seed.
</Error>

## Returns

The `useEERC` hook returns an object containing both state variables and methods that provide full interaction with the eERC protocol.

* `isInitialized: boolean`
 Indicates whether the SDK has been initialized successfully.
* `isAllDataFetched: boolean`
 Indicates that all required data fetched from protocol.
* `isRegistered: boolean`
Indicates whether the user is registered with the eERC protocol.
* `isConverter: boolean`
 Specifies if the eERC is converter or not.
* `publicKey: bigint[]`
Public key of the user.
* `auditorAddress: 0x{string}`
Protocol auditor address.
* `owner: 0x{string}`
Protocol owner (deployer) address.
* `auditorPublicKey: bigint[]`
Public key of the eERC auditor.
* `isAuditorKeySet: boolean`
Indicates whether the auditor key is set in the protocol.
* `name: string`
The name of the eERC token (available only in standalone mode).
* `symbol: string`
The symbol of the eERC token (available only in standalone mode).
* `isDecryptionKeySet: boolean`
Returns true if the user is registered and decryption key is not set.
* `areYouAuditor: boolean`
Returns true if the current user is an auditor for the eERC contract.
* `hasBeenAuditor: { isChecking: boolean; isAuditor: boolean }`
Tracks whether the user has been an auditor and whether it is currently being checked.


<Warning>
eERC transfer [app](https://eerc.avacloud.io) only support standalone eERCs.
</Warning>

## Methods

* `generateDecryptionKey(): Promise<string>` Generates a decryption key for the user, set the key internally and return the key for storing later use.
* `register(): Promise<{key:string; transactionHash:string}>` Registers the user with the eERC protocol. Only one registration per L1 is required.
  * Returns:
    * `key: string` - The decryption key.
    * `transactionHash: string` - The transaction hash of the registration.
* `auditorDecrypt(): Promise<DecryptedTransaction[]>` Decrypts encrypted transactions using the auditor's public key. If the user is not an auditor, this method will throw an error.
  * Returns an array of `DecryptedTransaction`
```javascript
type DecryptedTransaction = {
  type: string;
  amount: string;
  sender: `0x${string}`;
  receiver: `0x${string}` | null;
  transactionHash: `0x${string}`;
};  
```
* `isAddressRegistered(address: string): {isRegistered: boolean; error: string }` Checks if a specific address is registered with the eERC protocol.
* `useEncryptedBalance` Returns a custom hook that enables encrypted operations like mint, burn and transfer privately. The following section will explain detailed usage.
* `refetchEercUser` Returns the public key of the registered user.
* `refetchAuditor` Returns the public key of the auditor.
* `setContractAuditorPublicKey(address: string): Promise<{transactionHash:string}>` Sets the auditor's public key for the eERC.

<Error>
Only the owner can set the auditor's public key.
</Error>

***

For any additional questions, please view our other knowledge base articles or contact a support team member via the chat button. Examples are for illustrative purposes only.

[Learn More About AvaCloud](https://avacloud.io/) | [Download Case Studies](https://avacloud.io/case-studies) | [Schedule an AvaCloud Demo](https://avacloud.io/demo)

