import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { Dashboard } from '@/components/wallet/Dashboard';
import { OperationsModal } from '@/components/wallet/OperationsModal';

type OperationType = "deposit" | "withdraw" | "transfer" | null;

export function SnowPay() {
  const [currentOperation, setCurrentOperation] = useState<OperationType>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [prefilledAddress, setPrefilledAddress] = useState<string>("");
  const [isDecryptionKeySet, setIsDecryptionKeySet] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Demo wallet state
  const isConnected = true; // Demo: always connected
  const totalBalance = 5000000n; // Demo balance: 5 e.DMT
  const formBalance = 10000000000000000000n; // Demo balance: 10 DMT

  const handleGenerateKey = async () => {
    try {
      setIsGeneratingKey(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsDecryptionKeySet(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Decryption key generated successfully!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Key generation failed. Please try again.',
      });
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleRegister = async () => {
    try {
      setIsRegistering(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsRegistered(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Registration completed successfully!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Registration failed. Please try again.',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleOperationSuccess = () => {
    setCurrentOperation(null);
    setPrefilledAddress("");
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Transaction completed successfully!',
    });
  };


  const eercOperations = {
    deposit: async (amount: bigint) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { transactionHash: '0x123...' };
    },
    withdraw: async (amount: bigint) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { transactionHash: '0x123...' };
    },
    privateTransfer: async (to: string, amount: bigint) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { transactionHash: '0x123...' };
    },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Dashboard
        balance={totalBalance}
        isConnected={isConnected}
        isDecryptionKeySet={isDecryptionKeySet}
        isRegistered={isRegistered}
        isGeneratingKey={isGeneratingKey}
        isRegistering={isRegistering}
        onGenerateKey={handleGenerateKey}
        onRegister={handleRegister}
        onDeposit={() => setCurrentOperation("deposit")}
        onWithdraw={() => setCurrentOperation("withdraw")}
        onTransfer={() => setCurrentOperation("transfer")}
      />
      
      
      <OperationsModal
        operation={currentOperation}
        onClose={() => {
          setCurrentOperation(null);
          setPrefilledAddress("");
        }}
        eerc={eercOperations}
        onSuccess={handleOperationSuccess}
        balance={formBalance}
        encryptedBalance={totalBalance}
        prefilledAddress={prefilledAddress}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  features: {
    marginTop: 32,
    gap: 24,
  },
});