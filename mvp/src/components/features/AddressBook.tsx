import { useState, useMemo } from "react";
import { IoAdd, IoPencil, IoTrash, IoSend, IoPerson, IoSearch, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

interface Contact {
  id: string;
  name: string;
  address: string;
  memo?: string;
  isVerified: boolean;
  addedDate: Date;
  lastUsed?: Date;
}

// Mock contacts data
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Alice Cooper",
    address: "0x1234567890123456789012345678901234567890",
    memo: "Business partner",
    isVerified: true,
    addedDate: new Date("2024-01-01"),
    lastUsed: new Date("2024-01-15"),
  },
  {
    id: "2", 
    name: "Bob Smith",
    address: "0x9876543210987654321098765432109876543210",
    memo: "Friend from university",
    isVerified: true,
    addedDate: new Date("2024-01-05"),
    lastUsed: new Date("2024-01-12"),
  },
  {
    id: "3",
    name: "Charlie Brown",
    address: "0x1111222233334444555566667777888899990000",
    isVerified: false,
    addedDate: new Date("2024-01-10"),
  },
  {
    id: "4",
    name: "Diana Prince",
    address: "0xaabbccddeeff00112233445566778899aabbccdd",
    memo: "Freelance developer",
    isVerified: true,
    addedDate: new Date("2024-01-08"),
    lastUsed: new Date("2024-01-14"),
  },
];

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Omit<Contact, 'id' | 'addedDate'>) => void;
  editingContact?: Contact;
}

function AddContactModal({ isOpen, onClose, onSave, editingContact }: AddContactModalProps) {
  const [name, setName] = useState(editingContact?.name || "");
  const [address, setAddress] = useState(editingContact?.address || "");
  const [memo, setMemo] = useState(editingContact?.memo || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    onSave({
      name: name.trim(),
      address: address.trim(),
      memo: memo.trim() || undefined,
      isVerified: false, // New contacts start unverified
      lastUsed: editingContact?.lastUsed,
    });

    // Reset form
    setName("");
    setAddress("");
    setMemo("");
    onClose();
  };

  const isValidAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingContact ? 'Edit Contact' : 'Add New Contact'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter contact name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                address && !isValidAddress(address)
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="0x..."
              required
            />
            {address && !isValidAddress(address) && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid Ethereum address</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Memo (optional)
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a note about this contact"
              maxLength={100}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !address.trim() || !isValidAddress(address)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {editingContact ? 'Update' : 'Add'} Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AddressBookProps {
  onSendToContact?: (address: string) => void;
}

export function AddressBook({ onSendToContact }: AddressBookProps) {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.memo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);

  const handleSaveContact = (contactData: Omit<Contact, 'id' | 'addedDate'>) => {
    if (editingContact) {
      // Update existing contact
      setContacts(prev => prev.map(contact =>
        contact.id === editingContact.id
          ? { ...contact, ...contactData }
          : contact
      ));
      setEditingContact(undefined);
    } else {
      // Add new contact
      const newContact: Contact = {
        ...contactData,
        id: Date.now().toString(),
        addedDate: new Date(),
      };
      setContacts(prev => [...prev, newContact]);
    }
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsAddModalOpen(true);
  };

  const handleSendTo = (contact: Contact) => {
    // Update last used date
    setContacts(prev => prev.map(c =>
      c.id === contact.id ? { ...c, lastUsed: new Date() } : c
    ));
    
    // Call the parent handler to open transfer modal with pre-filled address
    if (onSendToContact) {
      onSendToContact(contact.address);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">Address Book</h3>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
              {filteredContacts.length}
            </span>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <IoAdd className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <IoSearch className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search contacts..."
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? (
              <p>No contacts found matching "{searchTerm}".</p>
            ) : (
              <div>
                <IoPerson className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No contacts added yet.</p>
                <p className="text-sm">Click "Add Contact" to get started.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <IoPerson className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{contact.name}</h4>
                        {contact.isVerified ? (
                          <IoCheckmarkCircle className="w-4 h-4 text-green-500" title="Verified" />
                        ) : (
                          <IoCloseCircle className="w-4 h-4 text-gray-400" title="Unverified" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{formatAddress(contact.address)}</p>
                      {contact.memo && (
                        <p className="text-xs text-gray-500 mt-1">{contact.memo}</p>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Added: {formatDate(contact.addedDate)}
                        {contact.lastUsed && (
                          <span className="ml-2">• Last used: {formatDate(contact.lastUsed)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSendTo(contact)}
                      className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
                      title="Send payment"
                    >
                      <IoSend className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditContact(contact)}
                      className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700"
                      title="Edit contact"
                    >
                      <IoPencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                      title="Delete contact"
                    >
                      <IoTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingContact(undefined);
        }}
        onSave={handleSaveContact}
        editingContact={editingContact}
      />
    </div>
  );
}