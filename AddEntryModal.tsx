
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { DictionaryEntry } from '../data/dictionary';

interface AddEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (entry: DictionaryEntry) => Promise<void>;
  editEntry?: DictionaryEntry;
}

export default function AddEntryModal({ visible, onClose, onSave, editEntry }: AddEntryModalProps) {
  const [word, setWord] = useState(editEntry?.word || '');
  const [definition, setDefinition] = useState(editEntry?.definition || '');
  const [pronunciation, setPronunciation] = useState(editEntry?.pronunciation || '');
  const [examples, setExamples] = useState<string[]>(editEntry?.examples || ['']);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!word.trim() || !definition.trim()) {
      Alert.alert('Ýalňyşlyk', 'Söz we manysy hökman bolmaly');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Saving entry:', word);

      const entry: DictionaryEntry = {
        word: word.trim(),
        definition: definition.trim(),
        pronunciation: pronunciation.trim() || undefined,
        examples: examples.filter(ex => ex.trim()).map(ex => ex.trim()),
      };

      await onSave(entry);
      handleClose();
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Ýalňyşlyk', error instanceof Error ? error.message : 'Söz goşmakda ýalňyşlyk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setWord('');
    setDefinition('');
    setPronunciation('');
    setExamples(['']);
    onClose();
  };

  const addExample = () => {
    setExamples([...examples, '']);
  };

  const updateExample = (index: number, value: string) => {
    const updated = [...examples];
    updated[index] = value;
    setExamples(updated);
  };

  const removeExample = (index: number) => {
    if (examples.length > 1) {
      const updated = examples.filter((_, i) => i !== index);
      setExamples(updated);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {editEntry ? 'Sözi üýtget' : 'Täze söz goş'}
          </Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Ýatda saklanýar...' : 'Ýatda sakla'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Söz *</Text>
            <TextInput
              style={styles.input}
              value={word}
              onChangeText={setWord}
              placeholder="Sözi ýazyň"
              placeholderTextColor={colors.textLight}
              editable={!editEntry} // Don't allow editing word if editing existing entry
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Manysy *</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={definition}
              onChangeText={setDefinition}
              placeholder="Sözüň manysyny ýazyň"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Aýdylyşy</Text>
            <TextInput
              style={styles.input}
              value={pronunciation}
              onChangeText={setPronunciation}
              placeholder="Sözüň aýdylyşyny ýazyň"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.examplesHeader}>
              <Text style={styles.label}>Mysallar</Text>
              <TouchableOpacity onPress={addExample} style={styles.addButton}>
                <Icon name="add" size={20} color={colors.primary} />
                <Text style={styles.addButtonText}>Goş</Text>
              </TouchableOpacity>
            </View>

            {examples.map((example, index) => (
              <View key={index} style={styles.exampleRow}>
                <TextInput
                  style={[styles.input, styles.exampleInput]}
                  value={example}
                  onChangeText={(value) => updateExample(index, value)}
                  placeholder={`Mysal ${index + 1}`}
                  placeholderTextColor={colors.textLight}
                  multiline
                />
                {examples.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeExample(index)}
                    style={styles.removeButton}
                  >
                    <Icon name="remove" size={20} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  saveButtonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  examplesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  exampleInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
  },
});
