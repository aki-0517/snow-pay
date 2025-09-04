import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TransactionHistory } from '@/components/features/TransactionHistory';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <TransactionHistory />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
    padding: 16,
    paddingTop: 60,
  },
});