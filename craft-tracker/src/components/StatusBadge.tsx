import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IdeaStatus, STATUS_LABELS } from '../types';
import { statusColors } from '../theme';

export function StatusBadge({ status }: { status: IdeaStatus }) {
  const { fg, bg } = statusColors[status];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});
