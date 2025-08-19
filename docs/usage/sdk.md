---
title: SDK Overview
---

The eERC SDK enables developers to interact effortlessly with the EncryptedERC (eERC) protocol deployed on the L1. It simplifies various tasks, including the generation of cryptographic proofs, as well as securely encrypting and decrypting balances. The SDK also facilitates the registration of users and manages operations such as minting, burning, and transferring encrypted tokens.

* [Github Repo](https://github.com/ava-labs/eerc-sdk)
* [Npm Package](https://www.npmjs.com/package/@avalabs/eerc-sdk)

By leveraging two core hooks—useEERC and useEncryptedBalance—developers can initialize the SDK, manage encrypted token balances, and perform essential operations such as minting, burning, transferring, and decrypting balances. These hooks simplify integration with the protocol, ensuring an efficient and secure development experience. The following sections explain the useEERC and useEncryptedBalance hooks in detail, including their parameters and return values.

To install run one of the below commands:

```bash
npm install @avalabs/eerc-sdk
```

```bash
pnpm install @avalabs/eerc-sdk
```

```bash
yarn add @avalabs/eerc-sdk
```

<Info>
To initialize the eERC SDK, ensure that wagmi is installed and configured correctly in your application. The official documentation is [here](https://wagmi.sh/react/getting-started).
</Info>

## Example Implementation

To see the eERC SDK in action, check out our example implementation:

* [GitHub Repository](https://github.com/BeratOz01/3dent)
* [Live Demo](https://www.3dent.xyz/)

This example provides a practical reference for implementing the useEERC and useEncryptedBalance hooks in your own application.

***

For any additional questions, please view our other knowledge base articles or contact a support team member via the chat button. Examples are for illustrative purposes only.

[Learn More About AvaCloud](https://avacloud.io/) | [Download Case Studies](https://avacloud.io/case-studies) | [Schedule an AvaCloud Demo](https://avacloud.io/demo)

