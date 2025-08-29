import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SimpleDeposit } from "../forms/SimpleDeposit";
import { SimpleWithdraw } from "../forms/SimpleWithdraw";
import { SimpleTransfer } from "../forms/SimpleTransfer";

type OperationType = "deposit" | "withdraw" | "transfer" | null;

interface OperationsModalProps {
  operation: OperationType;
  onClose: () => void;
  eerc: any;
  onSuccess: () => void;
  balance?: bigint;
  encryptedBalance?: bigint;
  prefilledAddress?: string;
}

export function OperationsModal({ 
  operation, 
  onClose, 
  eerc, 
  onSuccess, 
  balance, 
  encryptedBalance, 
  prefilledAddress 
}: OperationsModalProps) {
  if (!operation) return null;

  const titles = {
    deposit: "Deposit Funds",
    withdraw: "Withdraw Funds",
    transfer: "Send Payment"
  };

  return (
    <Modal
      visible={!!operation}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{titles[operation]}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          {operation === "deposit" && (
            <SimpleDeposit eerc={eerc} onSuccess={onSuccess} balance={balance} />
          )}
          {operation === "withdraw" && (
            <SimpleWithdraw eerc={eerc} onSuccess={onSuccess} balance={encryptedBalance} />
          )}
          {operation === "transfer" && (
            <SimpleTransfer 
              eerc={eerc} 
              onSuccess={onSuccess} 
              balance={encryptedBalance} 
              prefilledAddress={prefilledAddress} 
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#161617',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  closeIcon: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 24,
  },
});