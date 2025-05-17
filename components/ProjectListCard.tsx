import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProjectListCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 2,
    backgroundColor: '#23272f',
    borderColor: '#11cfcf',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    width: 'auto',
  },
}); 