import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Toast from 'react-native-toast-message';

interface SimpleDepositProps {
  eerc: {
    deposit?: (amount: bigint) => Promise<any>;
  };
  onSuccess: () => void;
  balance?: bigint;
}

export function SimpleDeposit({ eerc, onSuccess, balance }: SimpleDepositProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  
  const formattedBalance = balance ? (Number(balance) / Math.pow(10, 18)).toFixed(6) : "0.00";
  
  const handleMaxClick = () => {
    setAmount(formattedBalance);
  };

  const handleDeposit = async () => {
    if (!eerc.deposit || !amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      const parsedAmount = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 18)));
      await eerc.deposit(parsedAmount);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Deposit completed successfully!',
      });
      
      setAmount("");
      onSuccess();
    } catch (error) {
      console.error('Deposit failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Deposit failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount (DMT)</Text>
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
        Available: {formattedBalance} DMT
      </Text>

      <TouchableOpacity
        onPress={handleDeposit}
        disabled={loading || !amount}
        style={[styles.submitButton, (loading || !amount) && styles.submitButtonDisabled]}
      >
        <Text style={styles.submitButtonText}>
          ⬇️ {loading ? "Depositing..." : "Deposit Funds"}
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
    backgroundColor: '#22C55E',
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