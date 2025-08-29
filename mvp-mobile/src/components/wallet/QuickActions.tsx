import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface QuickActionsProps {
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}

export function QuickActions({ onDeposit, onWithdraw, onTransfer }: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      
      <View style={styles.actionsGrid}>
        <TouchableOpacity onPress={onDeposit} style={[styles.actionButton, styles.depositButton]}>
          <Text style={styles.actionIcon}>⬇️</Text>
          <Text style={[styles.actionText, styles.depositText]}>Deposit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onTransfer} style={[styles.actionButton, styles.transferButton]}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={[styles.actionText, styles.transferText]}>Send</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onWithdraw} style={[styles.actionButton, styles.withdrawButton]}>
          <Text style={styles.actionIcon}>⬆️</Text>
          <Text style={[styles.actionText, styles.withdrawText]}>Withdraw</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5F5F9',
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#161617',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    minHeight: 80,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  actionText: {
    fontWeight: '500',
    fontSize: 14,
  },
  depositButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  depositText: {
    color: '#059669',
  },
  transferButton: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
  },
  transferText: {
    color: '#007BFF',
  },
  withdrawButton: {
    backgroundColor: 'rgba(251, 146, 60, 0.1)',
  },
  withdrawText: {
    color: '#EA580C',
  },
});