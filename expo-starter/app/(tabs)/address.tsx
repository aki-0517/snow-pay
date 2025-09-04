import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AddressBook } from '@/components/features/AddressBook';

export default function AddressScreen() {
  const handleSendToContact = (address: string) => {
    console.log('Send to contact:', address);
    // TODO: Navigate to wallet tab with prefilled address
  };

  return (
    <View style={styles.container}>
      <AddressBook onSendToContact={handleSendToContact} />
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