# null

## Requirements

* A React Native project using the latest version
* iOS and Android platform support (Web is not supported)

## Installation

### Core Dependencies

Install the Privy React Native SDK and its peer dependencies:

```bash
npx expo install expo-apple-authentication expo-application expo-crypto expo-linking expo-secure-store expo-web-browser react-native-passkeys react-native-webview @privy-io/expo-native-extensions @privy-io/expo
```

### Required Polyfills

Install the necessary polyfills:

```bash
npm i fast-text-encoding react-native-get-random-values @ethersproject/shims
```

<Tip>
  If your app uses the Expo [bare workflow](https://docs.expo.dev/bare/) ("React Native without Expo"), also run:

  ```bash
  npx pod-install
  ```
</Tip>

### Configure Polyfills

<Tabs>
  <Tab title="Using expo/router">
    Create an `entrypoint.js` file and update your `package.json`:

    ```js entrypoint.js
    // Import required polyfills first
    import 'fast-text-encoding';
    import 'react-native-get-random-values';
    import '@ethersproject/shims';
    // Then import the expo router
    import 'expo-router/entry';
    ```

    ```json package.json
    {
      "name": "<your app name>",
      "main": "entrypoint.js"
    }
    ```
  </Tab>

  <Tab title="Without expo/router">
    Import the polyfills at the root of your application:

    ```jsx
    // Import required polyfills first
    import 'fast-text-encoding';
    import 'react-native-get-random-values';
    import '@ethersproject/shims';

    // Other imports
    ...

    // Your app's root component
    export default function App() {
      ...
    }
    ```
  </Tab>
</Tabs>

<Note>
  If you're using the `@solana/web3.js` package, install the buffer dependency:

  ```bash
  npm i buffer
  ```

  And add this code after importing `react-native-get-random-values`:

  ```js
  import 'react-native-get-random-values';
  import {Buffer} from 'buffer';
  global.Buffer = Buffer;
  ```
</Note>

# null

## Prerequisites

Before you begin, make sure you have [set up your Privy app and obtained your app ID](/basics/get-started/dashboard/create-new-app) and [client ID](/basics/get-started/dashboard/app-clients) from the Privy Dashboard.

<Warning>
  A properly set up app client is required for mobile apps and other non-web platforms to allow your
  app to interact with the Privy API. Please follow [this
  guide](/basics/get-started/dashboard/app-clients) to configure an app client.
</Warning>

## Initializing Privy

In your project, **import the `PrivyProvider` component and wrap your app with it**.
The `PrivyProvider` must wrap *any* component or page that will use the Privy React Native SDK, and it is generally recommended to render it as close to the root of your application as possible.

<Tabs>
  <Tab title="Using expo/router">
    Wrap your app with the `PrivyProvider` in the `app/_layout.tsx` file.

    ```tsx
    import {PrivyProvider} from '@privy-io/expo';

    import {Slot} from 'expo-router';

    export default function RootLayout() {
      return (
        <PrivyProvider appId="your-privy-app-id" clientId="your-privy-app-client-id">
          <Slot />
        </PrivyProvider>
      );
    }
    ```

    <Accordion title="Protect routes with `AuthBoundary`">
      ### Protect routes with `AuthBoundary`

      Setting up `PrivyProvider` is all you need to use the Privy React Native SDK throughout your app! But if you want to protect certain routes, we recommend you do so by using the `AuthBoundary` component, as follows:

      Start by setting up a [route group](https://docs.expo.dev/router/layouts/#groups), like `(app)/`, under your `app/` directory. Routes placed under this group will be protected by the `AuthBoundary` component, so only authenticated users can access them.

      ```text
      app
      ├── (app)
      │   ├── _layout.tsx
      │   └── index.tsx
      ├── _layout.tsx
      └── sign-in.tsx
      ```

      In the `(app)/_layout.tsx` file, wrap the `Stack` component with the `AuthBoundary` component:

      ```tsx
      import {Stack, Redirect} from 'expo-router';

      import {AuthBoundary} from '@privy-io/expo';

      export default function AppLayout() {
        return (
          <AuthBoundary
            loading={<FullScreenLoader />}
            error={(error) => <ErrorScreen error={error} />}
            unauthenticated={<Redirect href="/sign-in" />}
          >
            <Stack />
          </AuthBoundary>
        );
      }
      ```

      You must provide the following props to `AuthBoundary`:

      * `loading` and `error` are both custom components that you can define to show specific UIs during the loading and error states.
      * On `unauthenticated`, you should redirect the user to the sign in page, as defined above!

      If you want more details, or wish to take a manual approach without using `AuthBoundary`, take a look at [Expo Router's docs on Authentication](https://docs.expo.dev/router/reference/authentication/).
    </Accordion>
  </Tab>

  <Tab title="Without expo/router">
    Wrap your app with the `PrivyProvider` in the `App.tsx` file.

    ```tsx
    import {PrivyProvider} from '@privy-io/expo';

    import {HomeScreen} from './HomeScreen';

    export default function App() {
      return (
        <PrivyProvider appId="your-privy-app-id" clientId="your-privy-app-client-id">
          <HomeScreen />
        </PrivyProvider>
      );
    }
    ```
  </Tab>
</Tabs>

## Configuration

The `PrivyProvider` component accepts the following props:

<ParamField path="appId" type="string" required>
  Your Privy App ID. You can find this in the Privy Dashboard.
</ParamField>

<ParamField path="clientId" type="string" required>
  Your Privy Client ID. You can find this in the Privy Dashboard.
</ParamField>

## Waiting for Privy to be ready

When the `PrivyProvider` is first rendered, the Privy SDK will initialize some state about the current user. This might include checking if the user has a wallet connected, refreshing expired auth tokens, fetching up-to-date user data, and more.

**It's important to wait until the `PrivyProvider` has finished initializing *before* you consume Privy's state and interfaces**, to ensure that the state you consume is accurate and not stale.

To determine whether the Privy SDK has fully initialized, **check the `isReady` Boolean returned by the `usePrivy` hook.** When `isReady` is true, Privy has completed initialization, and your app can consume Privy's state and interfaces.

```tsx
import {usePrivy} from '@privy-io/expo';

function YourComponent() {
  const {isReady} = usePrivy();

  if (!isReady) {
    return <LoadingScreen />;
  }

  // Now it's safe to use other Privy hooks and state
  return <YourAuthenticatedContent />;
}
```

<CardGroup cols={2}>
  <Card title="Quickstart Guide" icon="rocket" href="/basics/react-native/quickstart">
    Learn how to [log users in](/authentication/user-authentication/login-methods/email) and
    [transact with embedded wallets](/wallets/wallets/create/create-a-wallet)
  </Card>

  <Card title="Example Repo" icon="code" href="https://github.com/privy-io/expo-starter">
    Check out our [Expo starter repo](https://github.com/privy-io/expo-starter) for a complete
    example
  </Card>
</CardGroup>

# Quickstart

> Learn how to authenticate users, create embedded wallets, and send transactions in your React Native app

## 0. Prerequisites

This guide assumes that you have completed the [setup](/basics/react-native/setup) guide.

## 1. Enable a user to log in via email

<Tip>
  This quickstart guide will demonstrate how to authenticate a user with a one time password as an
  example, but Privy supports many authentication methods. Explore our [Authentication
  docs](/authentication/overview) to learn about other methods such as socials, passkeys, and
  external wallets to authenticate users in your app.
</Tip>

**To authenticate a user via their email address, use the React Native SDK's `useLoginWithEmail` hook.**

```tsx
import {useLoginWithEmail} from '@privy-io/expo';
...
const {sendCode, loginWithCode} = useLoginWithEmail();
```

Ensure that this hook is mounted in a component that is wrapped by the [PrivyProvider](/basics/react-native/setup#initializing-privy).
You can use the returned methods **`sendCode`** and **`loginWithCode`** to authenticate your user per the instructions below.

### Send an OTP

Send a one-time passcode (OTP) to the user's **email** by passing their email address to the **`sendCode`** method returned from `useLoginWithEmail`:

```tsx
import {useLoginWithEmail} from '@privy-io/expo';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const {sendCode} = useLoginWithEmail();

  return (
    <View>
      <Text>Login</Text>

      {/* prettier-ignore */}
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        inputMode="email"
      />

      {!codeSent ? (
        <Button
          onPress={async () => {
            await sendCode({email});
            setCodeSent(true);
          }}
        >
          Send Code
        </Button>
      ) : (
        {/* prettier-ignore */}
        <Button onPress={() => loginWithCode({code: code, email})}>
          Login
        </Button>
      )}
    </View>
  );
}
```

## 2. Create an embedded wallet for the user

Your app can configure Privy to [**automatically** create wallets](/basics/react-native/advanced/automatic-wallet-creation) for your users as part of their **login** flow. The embedded wallet will be generated and linked to the user object upon authentication.

Alternatively your app can [**manually** create wallets](/wallets/wallets/create/create-a-wallet) for users when required.

<Info>Privy can provision wallets for your users on both **Ethereum** and **Solana**.</Info>

## 3. Send and sign transactions using the embedded wallet

To request signatures and transactions from a wallet, you must first get an EIP1193 provider for the wallet.

<Tabs>
  <Tab title="Ethereum">
    ```ts
    import {useEmbeddedEthereumWallet} from '@privy-io/expo';
    // Get an EIP-1193 Provider
    const {wallets} = useEmbeddedEthereumWallet();
    const provider = await wallets[0].getProvider();
    ```

    Once you have the embedded wallet's EIP-1193 provider, you can use the provider's **`request`** method to send JSON-RPC requests that request signatures and transactions from the wallet!

    The **`request`** method accepts an object with the fields:

    * **`method`** (required): the name of the JSON-RPC method as a string (e.g. **`personal_sign`** or **`eth_sendTransaction`**)
    * **`params`** (optional): an array of arguments for the JSON-RPC method specified by **`method`**

    <Tabs>
      <Tab title="Example signature">
        ```tsx
        // Get address
        const accounts = await provider.request({
          method: 'eth_requestAccounts'
        });

        // Sign message
        const message = 'I hereby vote for foobar';
        const signature = await provider.request({
          method: 'personal_sign',
          params: [message, accounts[0]]
        });
        ```
      </Tab>

      <Tab title="Example transaction">
        ```tsx
        // Get address
        // Get an EIP-1193 Provider
        const provider = await wallet.getProvider();
        const accounts = await provider.request({
          method: 'eth_requestAccounts'
        });

        // Send transaction (will be signed and populated)
        const response = await provider.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: accounts[0],
              to: '0x0000000000000000000000000000000000000000',
              value: '1'
            }
          ]
        });
        ```
      </Tab>
    </Tabs>
  </Tab>

  <Tab title="Solana">
    ```ts
    import {useEmbeddedSolanaWallet} from '@privy-io/expo';
    // get a Solana provider
    const {wallets} = useEmbeddedSolanaWallet();
    const provider = await wallets[0].getProvider();
    ```

    Once you have the embedded wallet's Solana provider, you can use the provider's methods to interact with the Solana blockchain.

    <Tabs>
      <Tab title="Example signature">
        ```tsx
        // Sign message
        const message = 'Hello world';
        const {signature} = await provider.request({
          method: 'signMessage',
          params: {message}
        });
        ```
      </Tab>

      <Tab title="Example transaction">
        ```tsx
        // Create a connection to the Solana network
        const connection = new Connection('insert-your-rpc-url-here');

        // Create your transaction (either legacy Transaction or VersionedTransaction)
        // transaction = ...

        // Send the transaction
        const {signature} = await provider.request({
          method: 'signAndSendTransaction',
          params: {
            transaction: transaction,
            connection: connection
          }
        });
        ```
      </Tab>
    </Tabs>
  </Tab>
</Tabs>

<Tip>
  [Learn more](/wallets/using-wallets/ethereum/send-a-transaction) about sending transactions with
  the embedded wallet. Privy enables you to take many actions on the embedded wallet, including
  [sign a message](/wallets/using-wallets/ethereum/sign-a-message), [sign typed
  data](/wallets/using-wallets/ethereum/sign-typed-data), and [sign a
  transaction](/wallets/using-wallets/ethereum/sign-a-transaction).
</Tip>

Congratulations, you have successfully been able to integrate Privy authentication and wallet into your React Native application!

# Features

> Learn about the features supported by the React Native SDK

export const FeatureMatrix = ({sdk}) => {
  const sdks = sdk ? [sdk] : ['react', 'reactNative', 'swift', 'android', 'flutter', 'unity'];
  const sdkNames = {
    react: 'React',
    reactNative: 'React Native',
    swift: 'Swift',
    android: 'Android',
    flutter: 'Flutter',
    unity: 'Unity'
  };
  const matrix = [{
    name: 'Authentication',
    features: [{
      name: 'Email',
      react: true,
      reactNative: true,
      swift: true,
      android: true,
      flutter: true,
      unity: true
    }, {
      name: 'SMS',
      react: true,
      reactNative: true,
      swift: true,
      android: true,
      flutter: true
    }, {
      name: 'OAuth',
      react: true,
      reactNative: true,
      swift: 'Google, Apple, Twitter, Discord',
      android: 'Google, Discord, Twitter',
      flutter: 'Google, Apple, Twitter, Discord',
      unity: 'Google, Apple, Twitter, Discord'
    }, {
      name: 'SIWE (Sign In with Ethereum)',
      react: true,
      reactNative: true,
      swift: true
    }, {
      name: 'SIWS (Sign In with Solana)',
      react: true,
      reactNative: true
    }, {
      name: 'Farcaster',
      react: true,
      reactNative: true
    }, {
      name: 'Telegram',
      react: true
    }, {
      name: 'Custom Auth',
      react: true,
      reactNative: true,
      swift: true,
      android: true,
      flutter: true
    }, {
      name: 'Passkeys',
      react: true,
      reactNative: true
    }]
  }, {
    name: 'Farcaster',
    features: [{
      name: 'SIWF',
      react: true,
      reactNative: true
    }]
  }, {
    name: 'Embedded Wallets',
    features: [{
      name: 'Creating wallets manually',
      react: ['ethereum', 'solana'],
      reactNative: ['ethereum', 'solana'],
      swift: ['ethereum', 'solana'],
      android: ['ethereum', 'solana'],
      flutter: ['ethereum', 'solana'],
      unity: ['ethereum', 'solana']
    }, {
      name: 'Creating wallets automatically',
      react: ['ethereum', 'solana'],
      reactNative: ['ethereum', 'solana']
    }, {
      name: 'Pregenerating wallets',
      react: ['ethereum', 'solana'],
      reactNative: ['ethereum', 'solana'],
      swift: ['ethereum', 'solana'],
      android: ['ethereum', 'solana'],
      flutter: ['ethereum', 'solana']
    }, {
      name: 'Signing messages and transactions',
      react: ['ethereum', 'solana'],
      reactNative: ['ethereum', 'solana'],
      swift: ['ethereum', 'solana'],
      android: ['ethereum', 'solana'],
      flutter: ['ethereum', 'solana'],
      unity: ['ethereum', 'solana']
    }, {
      name: 'Broadcasting transactions',
      react: ['ethereum', 'solana'],
      reactNative: ['ethereum', 'solana'],
      swift: ['ethereum'],
      android: ['ethereum'],
      flutter: ['ethereum'],
      unity: ['ethereum']
    }, {
      name: 'Native smart wallets',
      react: ['ethereum'],
      reactNative: ['ethereum']
    }, {
      name: 'Automatic recovery',
      react: ['ethereum', 'solana'],
      reactNative: ['ethereum', 'solana'],
      swift: ['ethereum', 'solana'],
      android: ['ethereum', 'solana'],
      flutter: ['ethereum', 'solana'],
      unity: ['ethereum']
    }, {
      name: 'User controlled recovery',
      react: ['ethereum', 'solana'],
      reactNative: ['ethereum', 'solana']
    }, {
      name: 'Transaction MFA',
      react: ['ethereum', 'solana'],
      reactNative: ['ethereum', 'solana']
    }, {
      name: 'Key Export',
      react: ['ethereum', 'solana']
    }, {
      name: 'Key Import',
      react: ['ethereum', 'solana']
    }, {
      name: 'HD wallets',
      react: ['ethereum', 'solana'],
      reactNative: ['ethereum', 'solana'],
      swift: ['ethereum'],
      android: ['ethereum'],
      flutter: ['ethereum'],
      unity: ['ethereum']
    }, {
      name: 'Session signers',
      react: ['ethereum', 'solana'],
      reactNative: ['ethereum', 'solana']
    }, {
      name: 'Global wallets (Cross App Accounts)',
      react: ['ethereum'],
      reactNative: ['ethereum']
    }, {
      name: 'Custom EVM (Ethereum) network support',
      react: ['ethereum'],
      reactNative: ['ethereum']
    }, {
      name: 'Custom SVM (Solana) network support',
      react: ['solana'],
      reactNative: ['solana']
    }]
  }, {
    name: 'Connectors',
    features: [{
      name: 'External wallets',
      react: ['ethereum', 'solana']
    }, {
      name: 'Wagmi',
      react: ['ethereum']
    }, {
      name: 'Viem',
      react: ['ethereum'],
      reactNative: ['ethereum']
    }, {
      name: 'Ethers',
      react: ['ethereum'],
      reactNative: ['ethereum']
    }, {
      name: '@solana/web3.js',
      react: ['solana']
    }, {
      name: 'web3swift',
      swift: ['ethereum']
    }]
  }, {
    name: 'Funding',
    features: [{
      name: 'Transfer or bridge from wallet',
      react: ['ethereum', 'solana']
    }, {
      name: 'Transfer from exchange',
      react: ['ethereum', 'solana'],
      reactNative: ['ethereum', 'solana']
    }, {
      name: 'Pay with card',
      react: ['ethereum', 'solana'],
      reactNative: ['ethereum', 'solana']
    }]
  }];
  const filteredMatrix = matrix.map(section => {
    return {
      ...section,
      features: section.features.filter(featureItem => {
        if (sdk) {
          return featureItem[sdk] !== undefined;
        }
        return true;
      })
    };
  }).filter(section => {
    return section.features.length > 0;
  });
  return <table style={{
    display: 'table',
    width: '100%'
  }}>
      {sdk ? null : <thead>
          <tr>
            <th></th>
            {sdks.map(sdk => <th>{sdkNames[sdk]}</th>)}
          </tr>
        </thead>}
      <tbody>
        {filteredMatrix.map(section => <>
            <tr>
              <td>
                <strong>{section.name}</strong>
              </td>
              {sdks.map(() => <td></td>)}
            </tr>
            {section.features.map(feature => <tr>
                <td>
                  <em>{feature.name}</em>
                </td>
                {sdks.map(sdk => {
    const supported = feature[sdk];
    if (supported === true) {
      return <td>✅</td>;
    } else if (!supported) {
      return <td></td>;
    } else if (Array.isArray(supported)) {
      return <td>
                        {supported.map(item => item === 'ethereum' ? <img src="https://mintlify.s3.us-west-1.amazonaws.com/privy-c2af3412/images/ethereum.png" noZoom style={{
        display: 'inline',
        margin: '2px',
        width: '18px'
      }} /> : <img src="https://mintlify.s3.us-west-1.amazonaws.com/privy-c2af3412/images/solana.png" noZoom style={{
        display: 'inline',
        margin: '2px',
        width: '18px'
      }} />)}
                      </td>;
    } else {
      return <td>{supported}</td>;
    }
  })}
              </tr>)}
          </>)}
      </tbody>
    </table>;
};

## Supported features

<FeatureMatrix sdk="reactNative" />

# null

Certain features may require custom build configurations.

In particular, this guide ensures that your application satisfies the following requirements for integrating:

* uses an [expo development build](https://docs.expo.dev/develop/development-builds/introduction/).
* has a custom [`metro.config.js` file](https://docs.expo.dev/guides/customizing-metro/#customizing) to customize the Metro bundler settings
* enables [package exports for the Metro bundler:](https://reactnative.dev/blog/2023/06/21/package-exports-support#for-app-developers)
* uses the `bundler` setting for [Typescript's `moduleResolution`](https://www.typescriptlang.org/tsconfig#moduleResolution)

## Enabling Package Exports

<Info>
  React Native 0.79, and Expo 53, have [enabled package exports by default](https://reactnative.dev/blog/2025/04/08/react-native-0.79#metro-faster-startup-and-package-exports-support).

  Some popular packages present incompatibilities with this change, and the community is working to get these fixed at source.
  In the meantime, we present a fix below by disabling package exports for the incompatibilities we have found.
</Info>

Update your `metro.config.js` like so:

```ts
//...other config logic

// Enable package exports for select libraries
...
const resolveRequestWithPackageExports = (context, moduleName, platform) => {
  // Package exports in `isows` (a `viem`) dependency are incompatible, so they need to be disabled
  if (moduleName === "isows") {
    const ctx = {
      ...context,
      unstable_enablePackageExports: false,
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // Package exports in `zustand@4` are incompatible, so they need to be disabled
  if (moduleName.startsWith("zustand")) {
    const ctx = {
      ...context,
      unstable_enablePackageExports: false,
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // Package exports in `jose` are incompatible, so the browser version is used
  if (moduleName === "jose") {
    const ctx = {
      ...context,
      unstable_conditionNames: ["browser"],
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // The following block is only needed if you are
  // running React Native 0.78 *or older*.
  if (moduleName.startsWith('@privy-io/')) {
    const ctx = {
      ...context,
      unstable_enablePackageExports: true,
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.resolveRequest = resolveRequestWithPackageExports;

...
module.exports = config;
```

## Typescript's Module Resolution

Also configure your `tsconfig.json` like so:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    // Allows us to use conditional/deep imports on published packages
    "moduleResolution": "Bundler"
  }
}
```

# Configuring EVM networks

Read below to learn how to configure supported EVM networks for the Expo SDK and how to switch the embedded wallet's current network.

## Configuring networks

**Privy embedded wallets can support *any* EVM-compatible chain**. You can configure EVM networks for Privy via the **`supportedChains`** property of the **`PrivyProvider`** component, per the instructions below.

### Configuring `viem`-supported networks

<Tip>
  If your desired EVM network is supported by the popular [**`viem/chains`**](https://viem.sh/docs/chains/introduction#chains) package, continue with the instructions below. A full list of the package's supported networks is available [here](https://github.com/wevm/viem/blob/main/src/chains/index.ts).

  Otherwise, skip to the [**Other Networks**](#other-networks) section.
</Tip>

To configure [**`viem`**](https://viem.sh/docs/chains/introduction#chains)-supported networks for Privy, **first, install the [`viem`](https://viem.sh/docs/installation#installation) package**. This package contains JSON representations of several EVM networks, which will be used to initialize the Privy SDK.

```sh
npm i viem
```

Next, **import your required chains from the [`viem/chains`](https://viem.sh/docs/chains/introduction#chains) package**:

```tsx
// Replace this with any of the networks listed at https://viem.sh/docs/chains/introduction#chains
import {base, baseGoerli, mainnet, goerli, polygon, polygonMumbai} from 'viem/chains';
```

**Lastly, configure the `supportedChains` prop of your `PrivyProvider` with an array including your required networks.**:

```tsx
<PrivyProvider
  appId="your-privy-app-id"
  supportedChains={[base, baseGoerli, mainnet, goerli, polygon, polygonMumbai]}
>
  {/* your app's content */}
</PrivyProvider>
```

### Other Networks

<Tip>
  If your desired EVM network is **not** supported by
  [**`viem/chains`**](https://viem.sh/docs/chains/introduction#chains), you can still use Privy with
  it per the steps below!
</Tip>

First, **import `viem` and use the package's [`defineChain`](https://viem.sh/docs/chains/introduction#custom-chains) method to build a JSON representation of your desired network.**

```tsx
import {defineChain} from 'viem';

export const myCustomChain = defineChain({
  id: 123456789, // Replace this with your chain's ID
  name: 'My Custom Chain',
  network: 'my-custom-chain',
  nativeCurrency: {
    decimals: 18, // Replace this with the number of decimals for your chain's native token
    name: 'My Native Currency Name',
    symbol: 'My Native Currency Symbol'
  },
  rpcUrls: {
    default: {
      http: ['https://my-custom-chain-https-rpc'],
      webSocket: ['wss://my-custom-chain-websocket-rpc']
    }
  },
  blockExplorers: {
    default: {name: 'Explorer', url: 'my-custom-chain-block-explorer'}
  }
});
```

At minimum, you must provide the network's name and chain ID, native currency, RPC URLs, and a blockexplorer URL.

Then, **pass the returned object (`myCustomChain` in the example above) to the `supportedChains` array of the `PrivyProvider`,** like above.

## Overriding a chain's RPC provider

**By default, transactions from the embedded wallet will be sent using Privy's default RPC providers.** Please note that Privy's default providers are subject to rate limits; these limits are sufficiently generous for developing your integration and moderate amounts of app usage.

**As your app's usage scales, we recommend that you setup your own RPC providers** (with [Alchemy](https://www.alchemy.com/), [QuickNode](https://www.quicknode.com/), [Blast](https://blastapi.io/), etc.) and configure Privy to use these providers per the instructions below. Setting up your own providers gives you maximum control over RPC throughput and rate limits, and offers you much more visibility into RPC analytics and common errors.

To configure Privy to use a custom RPC provider, first, **import the chain you want to override, and import the helper function `addRpcUrlOverrideToChain` from `@privy-io/chains` to override the RPC provider**

```ts
import {mainnet} from 'viem/chains';

import {addRpcUrlOverrideToChain} from '@privy-io/chains';

const mainnetOverride = addRpcUrlOverrideToChain(mainnet, INSERT_CUSTOM_RPC_URL);
```

Now, you can **add the chain returned by `addRpcUrlOverrideToChain` (e.g. `mainnetOverride`) to the `supportedChains` config option** like before.

## Default Configuration

If neither **`defaultChain`** nor **`supportedChains`** is explicitly set for your app, Privy will automatically default to the following list of EVM-compatible networks:

<Tip>
  **Want to use a chain not listed below?** Configure Privy with any EVM-compatible chain, like
  Berachain, Monad, or Story per the guidance
  [here](/basics/react/advanced/configuring-evm-networks#configuration).
</Tip>

<Expandable title="default networks">
  | Network           | [Chain ID](https://chainlist.org/) | Supported? | Privy RPC |
  | ----------------- | ---------------------------------- | ---------- | --------- |
  | Arbitrum          | 42161                              | ✅          | ✅         |
  | Arbitrum Sepolia  | 421614                             | ✅          | ✅         |
  | Avalanche C-Chain | 43114                              | ✅          |           |
  | Avalanche Fuji    | 43113                              | ✅          |           |
  | Base              | 8453                               | ✅          | ✅         |
  | Base Sepolia      | 84532                              | ✅          | ✅         |
  | Berachain Artio   | 80085                              | ✅          |           |
  | Celo              | 42220                              | ✅          |           |
  | Celo Alfajores    | 44787                              | ✅          |           |
  | Ethereum          | 1                                  | ✅          | ✅         |
  | Ethereum Sepolia  | 11155111                           | ✅          | ✅         |
  | Holesky           | 17000                              | ✅          |           |
  | Holesky Redstone  | 17001                              | ✅          |           |
  | Holesky Garnet    | 17069                              | ✅          |           |
  | Lukso             | 42                                 | ✅          |           |
  | Linea             | 59144                              | ✅          |           |
  | Linea Testnet     | 59140                              | ✅          |           |
  | Optimism          | 10                                 | ✅          | ✅         |
  | Optimism Sepolia  | 11155420                           | ✅          | ✅         |
  | Polygon           | 137                                | ✅          | ✅         |
  | Polygon Amoy      | 80002                              | ✅          | ✅         |
  | Redstone          | 690                                | ✅          |           |
  | Zora              | 7777777                            | ✅          |           |
  | Zora Sepolia      | 999999999                          | ✅          |           |
</Expandable>

# null

You can customize the theme and appearance of Privy's default UIs in your app.

## Brand color

Privy's default UIs for Expo support theming by using the **brand color** you have [set in the dashboard](/recipes/dashboard/customization#brand-color), or by setting a value specific to your mobile application by using the `PrivyElements` `config` prop.

If you want to set the value manually, instead of automatically through the dashboard, you should set the `accentColor` config option on the `PrivyElements` component.

```tsx
import {PrivyElements} from '@privy-io/expo/ui';

export default function RootLayout() {
  return (
    <>
      {/* Your app's content */}
      <PrivyElements config={{appearance: {accentColor: '#00AF55'}}} />
    </>
  );
}
```

## Color scheme (light and dark mode)

Privy's default UIs also support adapting the color scheme to both light and dark mode, via the `colorScheme` config option.

You can set a fixed value if that best matches the experience and design of your application, or you can use React Native's own `useColorScheme` hook to get a dynamic value and adapt to your user's settings.

```tsx
import {useColorScheme} from 'react-native';

import {PrivyElements} from '@privy-io/expo/ui';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <>
      {/* Your app's content */}
      <PrivyElements config={{appearance: {colorScheme}}} />
    </>
  );
}
```

# null

Privy supports native [Apple login](https://developer.apple.com/sign-in-with-apple/) when running on iOS.
Apple is an OAuth2.0 compliant authentication provider, but requires a specific implementation of Apple sign-in within iOS apps.

<Tip>
  Prior to integrating Sign in with Apple, make sure you configure [Apple as a login method in your
  dashboard.](/basics/get-started/dashboard/configure-login-methods) Make sure your app's `Bundle
    ID` rather than the `Service ID`, is configured as the `Client ID` within the **Privy Dashboard**.
</Tip>

### Installing the Apple Authentication module

```sh
npx expo install expo-apple-authentication
```

You can configure `expo-apple-authentication` using its built-in [config plugin](https://docs.expo.dev/versions/latest/sdk/apple-authentication/#configuration-in-app-config) if you use config plugins.

In your `app.json` config file:

* Set the `ios.usesAppleSignIn` property to `true`.
* Add `"expo-apple-authentication"` to the `plugins` array.

```json
{
  "expo": {
    "ios": {
      "usesAppleSignIn": true
    },
    "plugins": ["expo-apple-authentication"]
  }
}
```

## Initializing the login flow

With Privy's Expo SDK, you can use `'apple'` just as any other [OAuth provider](/authentication/user-authentication/login-methods/oauth).

```tsx
import {useLoginWithOAuth} from '@privy-io/expo';

export function LoginScreen() {
  const {login} = useLoginWithOAuth();

  return (
    <View>
      <Button onPress={() => login({provider: 'apple'})}>Login with Apple</Button>
    </View>
  );
}
```

Refer to our [OAuth login](/authentication/user-authentication/login-methods/oauth) guide for more information on login with OAuth providers.

## Using the web based flow instead of the native flow

<Tip>
  Privy will **automatically** fallback to the web-based flow on Android devices, where native Apple
  sign-in isn't supported.
</Tip>

For the best possible user experience, we recommend using the native "Sign in with Apple" flow as described above. However, if you are unable to use the native flow, or prefer not to, you can use the web based flow instead:

```tsx
import {useLoginWithOAuth} from '@privy-io/expo';

export function LoginScreen() {
  const {login} = useLoginWithOAuth();

  return (
    <View style={styles.container}>
      <Button onPress={() => login({provider: 'apple', isLegacyAppleIosBehaviorEnabled: true})}>
        Login with Apple
      </Button>
    </View>
  );
}
```
# Setting up Privy UIs

Before integrating Privy's default UIs into your app, you must first ensure the necessary components and fonts are installed.

## Custom Build Configuration

Using Privy UIs requires a custom build configuration for your React Native application. This is necessary to ensure that the Privy SDK can properly interact with the native components and libraries it relies on.

For detailed instructions, see the [Custom Build Configuration](/basics/react-native/advanced/custom-build-configuration) guide.

## Install Peer Dependencies

First, install the necessary peer dependencies:

```bash
npx expo install react-native-svg expo-clipboard react-native-qrcode-styled react-native-safe-area-context viem
```

## Fonts

### Install Font Packages

Install the following packages:

```bash
npx expo install expo-font @expo-google-fonts/inter
```

### Load Fonts

<Tabs>
  <Tab title="Using expo/router">
    Load the necessary fonts in your app's root layout (typically in `app/_layout.tsx`):

    ```tsx
    import {Inter_400Regular, Inter_500Medium, Inter_600SemiBold} from '@expo-google-fonts/inter';
    import {useFonts} from 'expo-font';

    export default function RootLayout() {
      useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
      });

      // ...
    }
    ```
  </Tab>

  <Tab title="Without expo/router">
    Load the necessary fonts in your app's root component (typically in `App.tsx`):

    ```tsx
    import {Inter_400Regular, Inter_500Medium, Inter_600SemiBold} from '@expo-google-fonts/inter';
    import {useFonts} from 'expo-font';

    export default function App() {
      useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
      });

      // ...
    }
    ```
  </Tab>
</Tabs>

## PrivyElements Component

Privy's default UIs in the React Native SDK are powered by the `PrivyElements` modal component.

<Warning>Only mount `PrivyElements` once in your app.</Warning>

```tsx
import {PrivyElements} from '@privy-io/expo/ui';

export default function RootLayout() {
  return (
    <>
      {/* Your app's content */}
      <PrivyElements />
    </>
  );
}
```
# null

<Tip>
  To see an example application that has the Privy Expo SDK configured with passkeys, check out our
  [Expo starter repo!](https://github.com/privy-io/expo-starter)
</Tip>

## 0. Ensure you have configured a custom build configuration

<Info>
  If you have not already configured a custom build configuration, follow the [custom build
  configuration guide](/basics/react-native/advanced/custom-build-configuration).
</Info>

## 1. Install additional peer dependencies

```sh
npx expo install react-native-passkeys
```

## 2. Update native app settings

<Tabs>
  <Tab title="iOS">
    Passkeys require that you associate a website with your app. To do so, you need to have the associated domain file on your website and the appropriate entitlement in your app.

    #### 1. Apple App Site Association

    * Create a `JSON` file with *at least* the following content

    ```json
    {
      "webcredentials": {
        "apps": ["<teamID>.<bundleID>"]
      }
    }
    ```

    * Make the file accessible on your website at the following path

    ```txt
    https://<your_domain>/.well-known/apple-app-site-association
    ```

    **Make sure to use your `teamID` and `bundleID` in the file hosted on your website.**

    For more information about supporting associated domains [see Apple's documentation](https://developer.apple.com/documentation/xcode/supporting-associated-domains).

    #### 2. App configuration

    Next, update your `app.json` (or `app.config.ts`) to include the `associatedDomains` and `deploymentTarget` like so:

    ```json
    {
      "expo": {
        "ios": {
          "associatedDomains": ["webcredentials:<your_domain>"]
        }
        "plugins": [
          [
            "expo-build-properties",
            {
              "ios": {
                "deploymentTarget": "17.5"
              }
            }
          ]
        ]
      }
    }
    ```

    #### 3. Build

    Lastly, build your app!

    ```sh
    npx expo prebuild -p ios
    npx expo run:ios
    ```
  </Tab>

  <Tab title="Android">
    To enable passkey support for your Android app, associate your app with a website that your app owns.

    #### 1. Digital Asset Links

    * Create a `JSON` file with *at least* the following content

    ```json
    [
      {
        "relation": ["delegate_permission/common.handle_all_urls"],
        "target": {
          "namespace": "android_app",
          "package_name": "<package_name>",
          "sha256_cert_fingerprints": ["<sha256_cert_fingerprint>"]
        }
      }
    ]
    ```

    * Make the file accessible on your website at the following path

    ```txt
    https://<your_domain>/.well-known/assetlinks.json
    ```

    **Make sure to use your `package_name` and `sha256_cert_fingerprint` in the file hosted on your website.**

    For more information on obtaining the `sha256_cert_fingerprint` for your app, see the [signing report documentation](https://developer.android.com/studio/publish/app-signing#signing_report). For more information about generally supporting Digital Asset Links [see Google's documentation](https://developer.android.com/training/sign-in/passkeys#add-support-dal).

    #### 2. Dashboard

    You will also need to add your `sha256_cert_fingerprint` to the allowed Android key hashes list in the `Settings` tab of the Privy dashboard.

    #### 3. App configuration

    Next, update your `app.json` (or `app.config.ts`) to look like:

    ```json
    {
      "expo": {
        "plugins": [
          [
            "expo-build-properties",
            {
              "android": {
                "compileSdkVersion": 34
              }
            }
          ]
        ]
      }
    }
    ```

    #### 4. Build

    Lastly, build your app!

    ```sh
    npx expo prebuild -p android
    npx expo run:android
    ```
  </Tab>
</Tabs>
# null

If your app uses embedded wallets, you can configure Privy to create wallets **automatically** for your users as part of their **login** flow.

<Tabs>
  <Tab title="Ethereum">
    To configure Privy to automatically create embedded wallets for your user when they login, **set the `config.embedded.solana.createOnLogin`** property of your `PrivyProvider`:

    ```tsx
    <PrivyProvider
        appId="your-privy-app-id"
        config={{
            embedded: {
                ethereum: {
                    createOnLogin: 'users-without-wallets',
                },
            },
        }}
    >
        {children}
    </PrivyProvider>
    ```

    <ParamField path="createOnLogin" type="'all-users' | 'users-without-wallets' | 'off'" default="off">
      Determines when to create a wallet for the user.

      * `'all-users'`: Create a wallet for all users on login.
      * `'users-without-wallets'`: Create a wallet for users who do not have a wallet on login.
      * `'off'`: Do not create a wallet on login.
    </ParamField>
  </Tab>

  <Tab title="Solana">
    To configure Privy to automatically create embedded wallets for your user when they login, **set the `config.embedded.solana.createOnLogin`** property of your `PrivyProvider`:

    ```tsx
    <PrivyProvider
        appId="your-privy-app-id"
        config={{
            embedded: {
                solana: {
                    createOnLogin: 'users-without-wallets',
                },
            },
        }}
    >
        {children}
    </PrivyProvider>
    ```

    <ParamField path="createOnLogin" type="'all-users' | 'users-without-wallets' | 'off'" default="off">
      Determines when to create a wallet for the user.

      * `'all-users'`: Create a wallet for all users on login.
      * `'users-without-wallets'`: Create a wallet for users who do not have a wallet on login.
      * `'off'`: Do not create a wallet on login.
    </ParamField>
  </Tab>
</Tabs>

# null

**By default, the Privy Expo SDK makes use of [`expo-secure-store`](https://docs.expo.dev/versions/latest/sdk/securestore/) package to persist sessions after your app is closed.**

### Custom storage adapters

If you'd rather persist sessions in a different way, you can easily build an adapter and provide it as an optional prop to the **`PrivyProvider`** component:

```tsx
import MyStorageProvider from 'my-storage-provider';

import {PrivyProvider} from '@privy-io/expo';
import type {Storage} from '@privy-io/js-sdk-core';

import AppContent from './AppContent';

const myStorage: Storage = {
  get: (key) => MyStorageProvider.getItem(key),
  put: (key, val) => MyStorageProvider.setItem(key, val),
  del: (key) => MyStorageProvider.deleteItem(key),
  getKeys: () => MyStorageProvider.allKeys()
};

export function App() {
  return (
    <PrivyProvider appId={'my-app-id'} storage={myStorage}>
      <AppContent />
    </PrivyProvider>
  );
}
```

### Customizing the access policy for `expo-secure-store`

The default **`expo-secure-store`** adapter setup requires the device to be unlocked at least once before accessing storage, which allows you to perform background operations, but still require the user to be in the loop after a device restart. Your app can customize the storage adapter, although be aware that this can have unexpected effects on Privy authentication state. Only do so if you are fully aware of the implications the changes you make will have.

Create a [**Custom Storage Adapter**](#custom-storage-adapters) that specifies the desired value for [**`keychainAccessible`**](https://docs.expo.dev/versions/latest/sdk/securestore/#constants) as a [**configuration option**](https://docs.expo.dev/versions/latest/sdk/securestore/#securestoreoptions) for each method.

```tsx
import * as SecureStore from 'expo-secure-store';

import type {Storage} from '@privy-io/js-sdk-core';

// We can require the user to set a passcode on the device to allow accessing storage, so Privy
// state is inaccessible if the user hasn't set or removes a passcode.
export const MyRestrictiveSecureStorageAdapter: Storage = {
  get(key) {
    return SecureStore.getItemAsync(key, {
      keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY
    });
  },
  put(key, val) {
    return SecureStore.setItemAsync(key, val as string, {
      keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY
    });
  },
  del(key) {
    return SecureStore.deleteItemAsync(key, {
      keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY
    });
  },
  getKeys: async () => []
};
```
