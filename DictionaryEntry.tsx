
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import { DictionaryEntry as DictionaryEntryType } from '../data/dictionary';

interface DictionaryEntryProps {
  entry: DictionaryEntryType;
}

export default function DictionaryEntry({ entry }: DictionaryEntryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.word}>{entry.word}</Text>
        {entry.pronunciation && (
          <Text style={styles.pronunciation}>/{entry.pronunciation}/</Text>
        )}
      </View>
      
      <Text style={styles.definition}>{entry.definition}</Text>
      
      {entry.examples && entry.examples.length > 0 && (
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Mysallar:</Text>
          {entry.examples.map((example, index) => (
            <Text key={index} style={styles.example}>
              • {example}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    boxShadow: `0px 3px 10px ${colors.shadow}`,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  header: {
    marginBottom: 12,
  },
  word: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  pronunciation: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textLight,
  },
  definition: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  examplesContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.accent,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
  },
  example: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
    paddingLeft: 8,
  },
});
