import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getIdeasByStatuses } from '../db/ideas';
import { daysUntil } from '../db/costumes';
import { IdeaWithProgress } from '../types';
import { colors } from '../theme';

export function WorkbenchScreen({ navigation }: any) {
  const [building, setBuilding] = useState<IdeaWithProgress[]>([]);
  const [researching, setResearching] = useState<IdeaWithProgress[]>([]);
  const [upgrades, setUpgrades] = useState<IdeaWithProgress[]>([]);

  useFocusEffect(
    useCallback(() => {
      // Building + gathering both count as "currently working on this" —
      // sorted by parent costume's faire date, already handled in the query.
      setBuilding(getIdeasByStatuses(['building', 'gathering']));
      setResearching(getIdeasByStatuses(['researching']));
      setUpgrades(getIdeasByStatuses(['upgrade_later']));
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Workbench</Text>
      <Text style={styles.subtitle}>What to work on this weekend</Text>

      <Group title="Currently building" ideas={building} navigation={navigation} showUrgency emptyText="Nothing in progress across any costume." />
      <Group title="Researching" ideas={researching} navigation={navigation} emptyText="No open research threads." />
      <Group title="Upgrade later" ideas={upgrades} navigation={navigation} emptyText="No upgrades queued." />
    </ScrollView>
  );
}

function Group({
  title,
  ideas,
  navigation,
  showUrgency,
  emptyText,
}: {
  title: string;
  ideas: IdeaWithProgress[];
  navigation: any;
  showUrgency?: boolean;
  emptyText: string;
}) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.sectionLabel}>{title}</Text>
      {ideas.length === 0 && <Text style={styles.emptyText}>{emptyText}</Text>}
      {ideas.map((idea) => {
        const days = showUrgency ? daysUntil(idea.faireDate ?? null) : null;
        const urgent = days !== null && days <= 7;
        return (
          <TouchableOpacity
            key={idea.id}
            style={[styles.card, urgent && styles.cardUrgent]}
            onPress={() => navigation.navigate('IdeaDetail', { ideaId: idea.id })}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.cardTitle, urgent && styles.cardTitleUrgent]}>{idea.title}</Text>
              {days !== null && <Text style={[styles.daysText, urgent && styles.cardTitleUrgent]}>{days} days</Text>}
            </View>
            <Text style={styles.costumeName}>{idea.costumeName}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: '500', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 20 },
  sectionLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  emptyText: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic' },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  cardUrgent: { backgroundColor: colors.urgentBg, borderColor: colors.urgent },
  cardTitle: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  cardTitleUrgent: { color: colors.urgent },
  daysText: { fontSize: 12, color: colors.textSecondary },
  costumeName: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
