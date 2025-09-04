import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface BalanceCardProps {
  balance: bigint;
  isPrivate?: boolean;
}

export function BalanceCard({ balance, isPrivate = true }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  
  const formattedBalance = (Number(balance) / 1000000).toFixed(6);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Total Balance</Text>
        <TouchableOpacity
          onPress={() => setShowBalance(!showBalance)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleIcon}>
            {showBalance ? '👁️‍🗨️' : '👁️'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.balanceSection}>
        <Text style={styles.balance}>
          {showBalance ? (
            `${parseFloat(formattedBalance).toFixed(6)} e.DMT`
          ) : (
            "••••••"
          )}
        </Text>
      </View>
      
      {isPrivate && (
        <View style={styles.privateIndicator}>
          <View style={styles.privateDot} />
          <Text style={styles.privateText}>Private Balance</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3055B3',
    padding: 24,
    borderRadius: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 8,
  },
  toggleIcon: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  balanceSection: {
    marginBottom: 8,
  },
  balance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  privateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.75,
  },
  privateDot: {
    width: 8,
    height: 8,
    backgroundColor: '#4ADE80',
    borderRadius: 4,
    marginRight: 8,
  },
  privateText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});