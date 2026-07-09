import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCostumeById } from '../db/costumes';
import { getIdeasForCostume } from '../db/ideas';
import { Costume, IdeaWithProgress } from '../types';
import { colors } from '../theme';
import { DeadlineChip } from '../components/DeadlineChip';

export function CostumeDetailScreen({ route, navigation }: any) {
  const { costumeId } = route.params;
  const [costume, setCostume] = useState<Costume | null>(null);
  const [ideas, setIdeas] = useState<IdeaWithProgress[]>([]);

  useFocusEffect(
    useCallback(() => {
      setCostume(getCostumeById(costumeId));
      setIdeas(getIdeasForCostume(costumeId));
    }, [costumeId])
  );

  if (!costume) return null;

  const counts = {
    building: ideas.filter((i) => i.status === 'building').length,
    idea: ideas.filter((i) => i.status === 'idea').length,
    upgrade_later: ideas.filter((i) => i.status === 'upgrade_later').length,
  };
  const activeBuilds = ideas.filter((i) => i.status === 'building' || i.status === 'gathering');
  const upgrades = ideas.filter((i) => i.status === 'upgrade_later');
  const everythingElse = ideas.filter(
    (i) => !['building', 'gathering', 'upgrade_later'].includes(i.status)
  );

  return (
    <ScrollView style={styles.container}>
      {costume.coverImageUri ? (
        <Image source={{ uri: costume.coverImageUri }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]} />
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{costume.name}</Text>
        <View style={{ marginBottom: 16 }}>
          <DeadlineChip faireDate={costume.faireDate} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{counts.building}</Text>
            <Text style={styles.statLabel}>Building</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{counts.idea}</Text>
            <Text style={styles.statLabel}>Idea</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{counts.upgrade_later}</Text>
            <Text style={styles.statLabel}>Upgrade</Text>
          </View>
        </View>

        <Section title="Active builds" ideas={activeBuilds} navigation={navigation} emptyText="Nothing in progress yet." />
        <Section title="Ideas" ideas={everythingElse} navigation={navigation} emptyText="No loose ideas yet." />
        <Section title="Upgrades" ideas={upgrades} navigation={navigation} emptyText="Nothing queued for later." />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewIdea', { costumeId: costume.id })}
      >
        <Text style={styles.fabText}>+ Add idea</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function Section({ title, ideas, navigation, emptyText }: { title: string; ideas: IdeaWithProgress[]; navigation: any; emptyText: string }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sectionLabel}>{title}</Text>
      {ideas.length === 0 && <Text style={styles.emptyText}>{emptyText}</Text>}
      {ideas.map((idea) => (
        <TouchableOpacity
          key={idea.id}
          style={styles.ideaRow}
          onPress={() => navigation.navigate('IdeaDetail', { ideaId: idea.id })}
        >
          <Text style={styles.ideaTitle}>{idea.title}</Text>
          {idea.totalSteps > 0 && (
            <Text style={styles.stepCount}>{idea.doneSteps}/{idea.totalSteps} steps</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  cover: { width: '100%', height: 160 },
  coverPlaceholder: { backgroundColor: colors.surfaceMuted },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: '500', color: colors.textPrimary, marginBottom: 8 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: colors.surfaceMuted, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '500', color: colors.textPrimary },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  sectionLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  emptyText: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic' },
  ideaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
  },
  ideaTitle: { fontSize: 14, color: colors.textPrimary },
  stepCount: { fontSize: 12, color: colors.textMuted },
  fab: {
    marginHorizontal: 16,
    backgroundColor: colors.textPrimary,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
  },
  fabText: { color: '#FFF', fontWeight: '500', fontSize: 15 },
});
