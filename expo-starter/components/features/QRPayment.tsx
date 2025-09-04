import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function QRPayment() {
  const [showQR, setShowQR] = useState(false);
  const address = "0x1234567890123456789012345678901234567890"; // Demo address

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 QR Payment</Text>
      <Text style={styles.description}>
        Share your wallet address for receiving payments
      </Text>
      
      <TouchableOpacity 
        onPress={() => setShowQR(!showQR)} 
        style={styles.toggleButton}
      >
        <Text style={styles.toggleButtonText}>
          {showQR ? "Hide QR Code" : "Show QR Code"}
        </Text>
      </TouchableOpacity>

      {showQR && address && (
        <View style={styles.qrContainer}>
          <Text style={styles.addressText}>{address}</Text>
        </View>
      )}
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
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: '#F5F5F9',
    padding: 16,
    borderRadius: 8,
  },
  addressText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#161617',
    textAlign: 'center',
  },
});