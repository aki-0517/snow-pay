import React from 'react';
import { View, StyleSheet } from 'react-native';
import { QRPayment } from '../../src/components/features/QRPayment';

export default function PaymentScreen() {
  return (
    <View style={styles.container}>
      <QRPayment />
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