import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { daysUntil } from '../db/costumes';

// Shows nothing if there's no faire date set — absence of a deadline
// shouldn't create visual noise.
export function DeadlineChip({ faireDate }: { faireDate: string | null }) {
  const days = daysUntil(faireDate);
  if (days === null) return null;

  const isUrgent = days <= 14;
  const label = days < 0 ? 'Faire passed' : days === 0 ? 'Faire today' : `${days} days to faire`;

  return (
    <View style={[styles.chip, isUrgent ? styles.urgent : styles.normal]}>
      <Text style={[styles.text, { color: isUrgent ? colors.urgent : colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  urgent: { backgroundColor: colors.urgentBg, borderColor: colors.urgent },
  normal: { backgroundColor: colors.surface },
  text: { fontSize: 12, fontWeight: '500' },
});
