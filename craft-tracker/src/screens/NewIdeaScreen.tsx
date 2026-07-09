import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createIdea } from '../db/ideas';
import { colors } from '../theme';

export function NewIdeaScreen({ route, navigation }: any) {
  const { costumeId } = route.params;
  const [title, setTitle] = useState('');

  function handleSave() {
    if (!title.trim()) return;
    const idea = createIdea({ costumeId, title: title.trim() });
    navigation.replace('IdeaDetail', { ideaId: idea.id });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What's the idea?</Text>
      <TextInput
        style={styles.input}
        placeholder="Mushroom lantern"
        placeholderTextColor={colors.textMuted}
        value={title}
        onChangeText={setTitle}
        autoFocus
      />
      <Text style={styles.hint}>You can attach photos, links, and notes once it's created.</Text>

      <TouchableOpacity style={[styles.button, !title.trim() && styles.buttonDisabled]} onPress={handleSave} disabled={!title.trim()}>
        <Text style={styles.buttonText}>Add idea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 6 },
  button: { backgroundColor: colors.textPrimary, borderRadius: 100, paddingVertical: 14, alignItems: 'center', marginTop: 32 },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#FFF', fontWeight: '500', fontSize: 15 },
});
