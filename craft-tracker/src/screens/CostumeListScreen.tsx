import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllCostumes, daysUntil } from '../db/costumes';
import { Costume } from '../types';
import { colors } from '../theme';
import { DeadlineChip } from '../components/DeadlineChip';

export function CostumeListScreen({ navigation }: any) {
  const [costumes, setCostumes] = useState<Costume[]>([]);

  useFocusEffect(
    useCallback(() => {
      setCostumes(getAllCostumes());
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={costumes}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Start your first costume</Text>
            <Text style={styles.emptyBody}>Costumes hold all your ideas for a look — Woodland Fae, Pirate Captain, whatever you're building next.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CostumeDetail', { costumeId: item.id, costumeName: item.name })}
          >
            {item.coverImageUri ? (
              <Image source={{ uri: item.coverImageUri }} style={styles.cover} />
            ) : (
              <View style={[styles.cover, styles.coverPlaceholder]} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <DeadlineChip faireDate={item.faireDate} />
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NewCostume')}>
        <Text style={styles.fabText}>+ New costume</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 12,
    alignItems: 'center',
  },
  cover: { width: 56, height: 56, borderRadius: 8 },
  coverPlaceholder: { backgroundColor: colors.surfaceMuted },
  name: { fontSize: 16, fontWeight: '500', color: colors.textPrimary, marginBottom: 6 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    left: 16,
    backgroundColor: colors.textPrimary,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
  },
  fabText: { color: '#FFF', fontWeight: '500', fontSize: 15 },
  empty: { padding: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '500', color: colors.textPrimary, marginBottom: 6 },
  emptyBody: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
