import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export function WalletSetup() {
  const handleConnect = () => {
    Alert.alert(
      'Connect Wallet',
      'Please use WalletConnect or a compatible mobile wallet to connect to SnowPay',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconContainer}>
          <Text style={styles.walletIcon}>👛</Text>
        </View>
        <Text style={styles.title}>Welcome to SnowPay</Text>
        <Text style={styles.subtitle}>
          The private wallet that keeps your transactions confidential
        </Text>
      </View>

      <View style={styles.features}>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🛡️</Text>
          <Text style={styles.featureTitle}>Private Transactions</Text>
          <Text style={styles.featureDescription}>
            Your balance and transaction amounts are encrypted and private
          </Text>
        </View>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>👛</Text>
          <Text style={styles.featureTitle}>Easy to Use</Text>
          <Text style={styles.featureDescription}>
            Simple interface for sending and receiving private payments
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleConnect} style={styles.connectButton}>
        <Text style={styles.connectButtonText}>Connect Wallet →</Text>
      </TouchableOpacity>
      
      <Text style={styles.footerText}>
        Connect your wallet to start using SnowPay
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 600,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 16,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  walletIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#161617',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(22, 22, 23, 0.7)',
    textAlign: 'center',
    marginBottom: 32,
  },
  features: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
    width: '100%',
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F5F5F9',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontWeight: '600',
    color: '#161617',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: 'rgba(22, 22, 23, 0.7)',
    textAlign: 'center',
  },
  connectButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 18,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(22, 22, 23, 0.7)',
    textAlign: 'center',
  },
});