import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProjectListItemProps {
  title: string;
  duration: string;
  percent: number;
  isValidated: boolean;
  isLast?: boolean;
}

export default function ProjectListItem({ title, duration, percent, isValidated, isLast }: ProjectListItemProps) {
  const color = isValidated ? '#11cfcf' : '#e74c3c';
  const icon = isValidated ? 'checkmark' : 'close';

  return (
    <View>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.duration}>{duration}</Text>
        </View>
        <View style={styles.rightCol}>
          <Ionicons name={icon} size={28} color={color} />
          <Text style={[styles.percent, { color }]}>{percent}</Text>
        </View>
      </View>
      {!isLast && <View style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 0,
  },
  title: {
    color: '#11cfcf',
    fontWeight: '500',
    fontSize: 20,
  },
  duration: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  percent: {
    fontWeight: '600',
    fontSize: 20,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 0,
  },
}); 