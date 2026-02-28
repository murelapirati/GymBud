import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EditNotesModalProps {
  visible: boolean;
  notes: string;
  onNotesChange: (text: string) => void;
  onClose: () => void;
  onSave: () => void;
  theme: {
    card: string;
    text: string;
    surface: string;
    border: string;
    textSecondary: string;
    primary: string;
  };
}

export const EditNotesModal: React.FC<EditNotesModalProps> = ({
  visible,
  notes,
  onNotesChange,
  onClose,
  onSave,
  theme,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.editNotesModal, { backgroundColor: theme.card }]}>
            <View style={styles.editNotesHeader}>
              <Text style={[styles.editNotesTitle, { color: theme.text }]}>Edit Workout Notes</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.editNotesInput, { 
                backgroundColor: theme.surface, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              value={notes}
              onChangeText={onNotesChange}
              placeholder="Add notes about your workout..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.editNotesButtons}>
              <TouchableOpacity
                style={[styles.editNotesModalButton, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
                onPress={onClose}
              >
                <Text style={[styles.editNotesButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editNotesModalButton, { backgroundColor: theme.primary }]}
                onPress={onSave}
              >
                <Text style={[styles.editNotesButtonText, { color: 'white' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editNotesModal: {
    margin: 20,
    marginTop: 'auto',
    marginBottom: 'auto',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 500,
  },
  editNotesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editNotesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editNotesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 16,
  },
  editNotesButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editNotesModalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  editNotesButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
