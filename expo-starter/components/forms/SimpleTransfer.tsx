import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Toast from 'react-native-toast-message';

interface SimpleTransferProps {
  eerc: {
    privateTransfer?: (recipient: string, amount: bigint) => Promise<any>;
  };
  onSuccess: () => void;
  balance?: bigint;
  prefilledAddress?: string;
}

export function SimpleTransfer({ eerc, onSuccess, balance, prefilledAddress }: SimpleTransferProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prefilledAddress) {
      setRecipient(prefilledAddress);
    }
  }, [prefilledAddress]);
  
  const formattedBalance = balance ? (Number(balance) / 1000000).toFixed(6) : "0.00";
  
  const handleMaxClick = () => {
    setAmount(formattedBalance);
  };

  const handleTransfer = async () => {
    if (!eerc.privateTransfer || !recipient || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      const parsedAmount = BigInt(Math.floor(parseFloat(amount) * 1000000));
      await eerc.privateTransfer(recipient, parsedAmount);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Transfer completed successfully!',
      });
      
      setRecipient("");
      setAmount("");
      onSuccess();
    } catch (error) {
      console.error('Transfer failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Transfer failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Recipient Address</Text>
      <TextInput
        style={styles.input}
        value={recipient}
        onChangeText={setRecipient}
        placeholder="0x..."
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Amount (e.DMT)</Text>
      <View style={styles.amountContainer}>
        <TextInput
          style={[styles.input, styles.amountInput]}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={handleMaxClick} style={styles.maxButton}>
          <Text style={styles.maxButtonText}>Max</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.balanceText}>
        Available: {formattedBalance} e.DMT
      </Text>

      <TouchableOpacity
        onPress={handleTransfer}
        disabled={loading || !recipient || !amount}
        style={[styles.submitButton, (loading || !recipient || !amount) && styles.submitButtonDisabled]}
      >
        <Text style={styles.submitButtonText}>
          📤 {loading ? "Sending..." : "Send Payment"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#161617',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountInput: {
    flex: 1,
  },
  maxButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  maxButtonText: {
    color: '#161617',
    fontWeight: '500',
  },
  balanceText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },
});