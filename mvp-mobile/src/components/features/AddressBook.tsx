import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

interface AddressBookProps {
  onSendToContact: (address: string) => void;
}

export function AddressBook({ onSendToContact }: AddressBookProps) {
  const [contacts, setContacts] = useState<Array<{name: string, address: string}>>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactAddress, setNewContactAddress] = useState("");

  const handleAddContact = () => {
    if (!newContactName || !newContactAddress) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setContacts([...contacts, { name: newContactName, address: newContactAddress }]);
    setNewContactName("");
    setNewContactAddress("");
    setShowAddForm(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📇 Address Book</Text>
      
      <TouchableOpacity 
        onPress={() => setShowAddForm(!showAddForm)} 
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>
          {showAddForm ? "Cancel" : "Add Contact"}
        </Text>
      </TouchableOpacity>

      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Contact name"
            placeholderTextColor="#999"
            value={newContactName}
            onChangeText={setNewContactName}
          />
          <TextInput
            style={styles.input}
            placeholder="Wallet address (0x...)"
            placeholderTextColor="#999"
            value={newContactAddress}
            onChangeText={setNewContactAddress}
          />
          <TouchableOpacity onPress={handleAddContact} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Contact</Text>
          </TouchableOpacity>
        </View>
      )}

      {contacts.length === 0 ? (
        <Text style={styles.emptyText}>No contacts saved yet</Text>
      ) : (
        <View style={styles.contactsList}>
          {contacts.map((contact, index) => (
            <View key={index} style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactAddress}>{contact.address}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => onSendToContact(contact.address)}
                style={styles.sendButton}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          ))}
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
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  addForm: {
    gap: 12,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  contactsList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F5F5F9',
    borderRadius: 8,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#161617',
  },
  contactAddress: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});