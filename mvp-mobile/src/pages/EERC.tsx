import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { ConverterMode } from "../components/eerc/ConverterMode";

export function EERC() {
  const [showEncryptedDetails, setShowEncryptedDetails] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionType, setTransactionType] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isDecryptionKeySet, setIsDecryptionKeySet] = useState(false);
  
  // Demo state
  const isConnected = true;
  const isConnecting = false;
  const address = "0x1234567890123456789012345678901234567890";
  const txHash = "";
  
  // Demo encrypted data
  const publicKey: bigint[] = [123456789n, 987654321n];
  const auditorPublicKey: bigint[] = [111111111n, 222222222n];
  const encryptedBalance: bigint[] = [1000000n, 2000000n];
  const decryptedBalance: bigint = 5000000n;
  const isAuditorKeySet = true;

  const CONTRACTS = {
    EERC_CONVERTER: "0xA1B2C3D4E5F6789012345678901234567890ABCD",
    ERC20: "0x1A2B3C4D5E6F789012345678901234567890CDEF"
  };
  
  const EXPLORER_BASE_URL = "https://testnet.snowtrace.io/address/";
  const EXPLORER_BASE_URL_TX = "https://testnet.snowtrace.io/tx/";

  const refetchBalance = () => {
    console.log('Refreshing balance...');
  };

  const handleConnect = () => {
    Alert.alert(
      'Connect Wallet',
      'Please use a compatible mobile wallet app to connect',
      [{ text: 'OK' }]
    );
  };

  const handleDisconnect = async () => {
    Alert.alert('Disconnect', 'Wallet disconnected');
  };

  const handleGenerateKey = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsDecryptionKeySet(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Decryption key generated!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error generating decryption key',
      });
    }
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsRegistered(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Registration completed!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Registration failed',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🏔️ eERC</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Privacy-Preserving • Auditable • ZK-Powered</Text>
        </View>
      </View>

      <Text style={styles.description}>
        eERC is a privacy-preserving ERC-20 token that lets users mint, transfer, and burn — without exposing balances or amounts on-chain.
      </Text>

      <View style={styles.modesContainer}>
        <View style={styles.modeCard}>
          <Text style={styles.modeTitle}>Standalone Mode</Text>
          <Text style={styles.modeDescription}>
            Behaves like a standard token with privacy features — users can mint, transfer, and burn directly.
          </Text>
        </View>

        <View style={styles.modeCard}>
          <Text style={styles.modeTitle}>Converter Mode</Text>
          <Text style={styles.modeDescription}>
            Wraps an existing ERC-20. Users deposit ERC-20 tokens and receive their encrypted equivalents.
          </Text>
        </View>
      </View>

      <View style={styles.contractsSection}>
        <Text style={styles.sectionTitle}>📜 Contracts</Text>
        <View style={styles.contractItem}>
          <Text style={styles.contractLabel}>Converter Mode</Text>
          <TouchableOpacity 
            onPress={() => Linking.openURL(`${EXPLORER_BASE_URL}${CONTRACTS.EERC_CONVERTER}`)}
          >
            <Text style={styles.contractAddress}>{CONTRACTS.EERC_CONVERTER}</Text>
            <Text style={styles.explorerLink}>See on Explorer →</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contractItem}>
          <Text style={styles.contractLabel}>Dummy ERC-20</Text>
          <TouchableOpacity 
            onPress={() => Linking.openURL(`${EXPLORER_BASE_URL}${CONTRACTS.ERC20}`)}
          >
            <Text style={styles.contractAddress}>{CONTRACTS.ERC20}</Text>
            <Text style={styles.explorerLink}>See on Explorer →</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔗 Connect Wallet</Text>
        <TouchableOpacity
          style={[styles.button, isConnected && styles.buttonDisabled]}
          disabled={isConnected}
          onPress={handleConnect}
        >
          <Text style={styles.buttonText}>
            {isConnected
              ? `Connected as ${address?.slice(0, 6)}...${address?.slice(-4)}`
              : isConnecting
              ? "Connecting..."
              : "Connect Wallet"}
          </Text>
        </TouchableOpacity>

        {isConnected && (
          <TouchableOpacity style={styles.button} onPress={handleDisconnect}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.faucetSection}>
        <Text style={styles.faucetText}>
          💧 Need test tokens? You can get AVAX on the Fuji testnet from the{' '}
          <Text 
            style={styles.link}
            onPress={() => Linking.openURL('https://core.app/en/tools/testnet-faucet/?subnet=c&token=c')}
          >
            Avalanche Faucet →
          </Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔑 Generate Decryption Key</Text>
        <Text style={styles.sectionDescription}>
          This key is derived by signing a predefined message with your wallet. It is never uploaded or shared.
        </Text>
        <TouchableOpacity
          style={[styles.button, isDecryptionKeySet && styles.buttonDisabled]}
          disabled={isDecryptionKeySet}
          onPress={handleGenerateKey}
        >
          <Text style={styles.buttonText}>Generate Decryption Key</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧾 Registration</Text>
        <Text style={styles.sectionDescription}>
          Before starting using eERC, you need to register your wallet. This process creates a unique encryption key and links your wallet address securely.
        </Text>
        <TouchableOpacity
          style={[styles.button, (isRegistered || isRegistering || !isDecryptionKeySet) && styles.buttonDisabled]}
          disabled={isRegistered || isRegistering || !isDecryptionKeySet}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>
            {isRegistered ? "✓ Registered" : isRegistering ? "Registering..." : "Register Wallet"}
          </Text>
        </TouchableOpacity>
      </View>

      {isTransactionPending && (
        <View style={styles.transactionPending}>
          <Text style={styles.transactionTitle}>{transactionType} in progress...</Text>
          {txHash && (
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionLabel}>Transaction Hash:</Text>
              <Text style={styles.transactionHash}>{txHash}</Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(`${EXPLORER_BASE_URL_TX}${txHash}`)}
              >
                <Text style={styles.explorerLink}>View on Explorer →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <ConverterMode
        showEncryptedDetails={showEncryptedDetails}
        setShowEncryptedDetails={setShowEncryptedDetails}
        isDecryptionKeySet={isDecryptionKeySet}
        publicKey={publicKey}
        isAuditorKeySet={isAuditorKeySet}
        auditorPublicKey={auditorPublicKey}
        encryptedBalance={encryptedBalance}
        decryptedBalance={decryptedBalance}
        refetchBalance={refetchBalance}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00D4AA',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#00D4AA',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  description: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'justify',
  },
  modesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modeCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  modeTitle: {
    color: '#00D4AA',
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  modeDescription: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  contractsSection: {
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  contractItem: {
    marginBottom: 12,
  },
  contractLabel: {
    color: '#00D4AA',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  contractAddress: {
    color: 'rgba(0, 212, 170, 0.8)',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  explorerLink: {
    color: 'rgba(0, 212, 170, 0.6)',
    textDecorationLine: 'underline',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#00D4AA',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    lineHeight: 18,
    marginBottom: 12,
    textAlign: 'justify',
  },
  button: {
    backgroundColor: '#161617',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.6)',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#00D4AA',
    fontFamily: 'monospace',
    textAlign: 'center',
    fontSize: 14,
  },
  faucetSection: {
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  faucetText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  link: {
    color: '#00D4AA',
    textDecorationLine: 'underline',
  },
  transactionPending: {
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.5)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  transactionTitle: {
    color: '#00D4AA',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  transactionDetails: {
    alignItems: 'center',
    width: '100%',
  },
  transactionLabel: {
    color: '#00D4AA',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionHash: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 8,
  },
});