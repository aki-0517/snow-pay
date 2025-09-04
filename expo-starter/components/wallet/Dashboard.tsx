import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BalanceCard } from "./BalanceCard";
import { QuickActions } from "./QuickActions";
import { WalletSetup } from "./WalletSetup";
import { SetupProgress } from "./SetupProgress";

interface DashboardProps {
  balance: bigint;
  isConnected: boolean;
  isDecryptionKeySet: boolean;
  isRegistered: boolean;
  isGeneratingKey: boolean;
  isRegistering: boolean;
  onGenerateKey: () => void;
  onRegister: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}

export function Dashboard({
  balance,
  isConnected,
  isDecryptionKeySet,
  isRegistered,
  isGeneratingKey,
  isRegistering,
  onGenerateKey,
  onRegister,
  onDeposit,
  onWithdraw,
  onTransfer
}: DashboardProps) {

  if (!isConnected) {
    return <WalletSetup />;
  }

  if (!isDecryptionKeySet) {
    return (
      <View style={styles.container}>
        <SetupProgress currentStep={2} />
        <View style={styles.setupCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔑</Text>
          </View>
          <Text style={styles.setupTitle}>Generate Decryption Key</Text>
          <Text style={styles.setupDescription}>
            Generate a decryption key to encrypt and decrypt your private balance.
          </Text>
          <TouchableOpacity
            onPress={onGenerateKey}
            disabled={isGeneratingKey}
            style={[styles.setupButton, isGeneratingKey && styles.buttonDisabled]}
          >
            <Text style={styles.setupButtonText}>
              {isGeneratingKey ? "Generating..." : "Generate Key"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!isRegistered) {
    return (
      <View style={styles.container}>
        <SetupProgress currentStep={3} />
        <View style={styles.setupCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📝</Text>
          </View>
          <Text style={styles.setupTitle}>Complete Registration</Text>
          <Text style={styles.setupDescription}>
            Register with the SnowPay protocol to start using private transactions.
          </Text>
          <TouchableOpacity
            onPress={onRegister}
            disabled={isRegistering}
            style={[styles.setupButton, isRegistering && styles.buttonDisabled]}
          >
            <Text style={styles.setupButtonText}>
              {isRegistering ? "Registering..." : "Register Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <SetupProgress currentStep={4} />
      
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome to SnowPay</Text>
        <Text style={styles.welcomeSubtitle}>Your private wallet for secure transactions</Text>
      </View>

      <BalanceCard balance={balance} />

      <QuickActions
        onDeposit={onDeposit}
        onWithdraw={onWithdraw}
        onTransfer={onTransfer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 600,
    alignSelf: 'center',
  },
  mainContainer: {
    flex: 1,
    maxWidth: 800,
    alignSelf: 'center',
    gap: 24,
  },
  setupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5F5F9',
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 24,
  },
  setupTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#161617',
    fontFamily: 'System',
    marginBottom: 16,
  },
  setupDescription: {
    color: 'rgba(22, 22, 23, 0.7)',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  setupButton: {
    width: '100%',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  setupButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#161617',
    fontFamily: 'System',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(22, 22, 23, 0.7)',
  },
});