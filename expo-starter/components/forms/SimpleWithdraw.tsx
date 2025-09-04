import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Toast from 'react-native-toast-message';

interface SimpleWithdrawProps {
  eerc: {
    withdraw?: (amount: bigint) => Promise<any>;
  };
  onSuccess: () => void;
  balance?: bigint;
}

export function SimpleWithdraw({ eerc, onSuccess, balance }: SimpleWithdrawProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  
  const formattedBalance = balance ? (Number(balance) / 1000000).toFixed(6) : "0.00";
  
  const handleMaxClick = () => {
    setAmount(formattedBalance);
  };

  const handleWithdraw = async () => {
    if (!eerc.withdraw || !amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      const parsedAmount = BigInt(Math.floor(parseFloat(amount) * 1000000));
      await eerc.withdraw(parsedAmount);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Withdrawal completed successfully!',
      });
      
      setAmount("");
      onSuccess();
    } catch (error) {
      console.error('Withdrawal failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Withdrawal failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
        onPress={handleWithdraw}
        disabled={loading || !amount}
        style={[styles.submitButton, (loading || !amount) && styles.submitButtonDisabled]}
      >
        <Text style={styles.submitButtonText}>
          ⬆️ {loading ? "Withdrawing..." : "Withdraw Funds"}
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
    backgroundColor: '#EA580C',
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