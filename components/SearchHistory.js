import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function SearchHistory({ history, onSelect }) {
  if (!history || history.length === 0) {
    return <Text style={styles.placeholder}>Aucune recherche récente.</Text>;
  }

  return (
    <FlatList
      data={history}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect(item)}>
          <Text style={styles.historyItem}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  historyItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    textDecorationLine: 'underline',
  },
  placeholder: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
  },
});
