import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ConverterModeProps {
  showEncryptedDetails: boolean;
  setShowEncryptedDetails: (show: boolean) => void;
  isDecryptionKeySet: boolean;
  publicKey: bigint[];
  isAuditorKeySet: boolean;
  auditorPublicKey: bigint[];
  encryptedBalance: bigint[];
  decryptedBalance: bigint;
  refetchBalance: () => void;
}

export function ConverterMode({
  showEncryptedDetails,
  setShowEncryptedDetails,
  isDecryptionKeySet,
  publicKey,
  isAuditorKeySet,
  auditorPublicKey,
  encryptedBalance,
  decryptedBalance,
  refetchBalance,
}: ConverterModeProps) {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔄 Converter Mode</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Balance Information</Text>
        
        <TouchableOpacity 
          onPress={() => setShowEncryptedDetails(!showEncryptedDetails)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>
            {showEncryptedDetails ? "Hide Details" : "Show Encrypted Details"}
          </Text>
        </TouchableOpacity>

        {showEncryptedDetails && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>
              Decrypted Balance: {(Number(decryptedBalance) / 1000000).toFixed(6)} e.DMT
            </Text>
            
            {isDecryptionKeySet && (
              <View style={styles.keyInfo}>
                <Text style={styles.keyLabel}>Public Key:</Text>
                <Text style={styles.keyValue}>
                  [{publicKey?.[0]?.toString().slice(0, 8)}..., {publicKey?.[1]?.toString().slice(0, 8)}...]
                </Text>
              </View>
            )}

            {isAuditorKeySet && (
              <View style={styles.keyInfo}>
                <Text style={styles.keyLabel}>Auditor Key:</Text>
                <Text style={styles.keyValue}>
                  [{auditorPublicKey?.[0]?.toString().slice(0, 8)}..., {auditorPublicKey?.[1]?.toString().slice(0, 8)}...]
                </Text>
              </View>
            )}

            <View style={styles.keyInfo}>
              <Text style={styles.keyLabel}>Encrypted Balance:</Text>
              <Text style={styles.keyValue}>
                [{encryptedBalance?.[0]?.toString().slice(0, 8)}..., {encryptedBalance?.[1]?.toString().slice(0, 8)}...]
              </Text>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={refetchBalance} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>🔄 Refresh Balance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5F5F9',
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#161617',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#161617',
    marginBottom: 12,
  },
  toggleButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
  },
  detailsContainer: {
    backgroundColor: '#F5F5F9',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#161617',
    fontFamily: 'monospace',
  },
  keyInfo: {
    gap: 4,
  },
  keyLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  keyValue: {
    fontSize: 10,
    color: '#161617',
    fontFamily: 'monospace',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 4,
  },
  refreshButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
});