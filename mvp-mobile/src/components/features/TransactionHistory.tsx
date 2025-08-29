import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function TransactionHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Transaction History</Text>
      <Text style={styles.description}>
        Transaction history will be available in a future update
      </Text>
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
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#161617',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});