import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createCostume } from '../db/costumes';
import { colors } from '../theme';

export function NewCostumeScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [faireDate, setFaireDate] = useState(''); // simple text entry, YYYY-MM-DD
  const [notes, setNotes] = useState('');

  function handleSave() {
    if (!name.trim()) return;
    const costume = createCostume({
      name: name.trim(),
      faireDate: faireDate.trim() || null,
      notes,
    });
    navigation.replace('CostumeDetail', { costumeId: costume.id, costumeName: costume.name });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Costume name</Text>
      <TextInput
        style={styles.input}
        placeholder="Woodland Fae"
        placeholderTextColor={colors.textMuted}
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <Text style={styles.label}>Faire date (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="2026-08-15"
        placeholderTextColor={colors.textMuted}
        value={faireDate}
        onChangeText={setFaireDate}
      />
      <Text style={styles.hint}>Format: YYYY-MM-DD. This drives Workbench sorting.</Text>

      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="General notes about this costume..."
        placeholderTextColor={colors.textMuted}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={[styles.button, !name.trim() && styles.buttonDisabled]} onPress={handleSave} disabled={!name.trim()}>
        <Text style={styles.buttonText}>Create costume</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
    color: colors.textPrimary,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  button: {
    backgroundColor: colors.textPrimary,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#FFF', fontWeight: '500', fontSize: 15 },
});
