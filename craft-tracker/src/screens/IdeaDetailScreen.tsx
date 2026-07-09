import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image, Linking, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getIdeaById, updateIdeaStatus, deleteIdea } from '../db/ideas';
import { getStepsForIdea, createStep, toggleStep, deleteStep } from '../db/steps';
import { getAssetsForIdea, createAsset, deleteAsset } from '../db/assets';
import { Idea, Step, Asset, IdeaStatus, STATUS_LABELS } from '../types';
import { colors, statusColors } from '../theme';

const ALL_STATUSES: IdeaStatus[] = ['idea', 'researching', 'gathering', 'building', 'faire_ready', 'upgrade_later'];

export function IdeaDetailScreen({ route, navigation }: any) {
  const { ideaId } = route.params;
  const [idea, setIdea] = useState<Idea | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newNote, setNewNote] = useState('');

  const refresh = useCallback(() => {
    setIdea(getIdeaById(ideaId));
    setSteps(getStepsForIdea(ideaId));
    setAssets(getAssetsForIdea(ideaId));
  }, [ideaId]);

  useFocusEffect(refresh);

  if (!idea) return null;

  function handleAddStep() {
    if (!newStepTitle.trim()) return;
    createStep(ideaId, newStepTitle.trim());
    setNewStepTitle('');
    refresh();
  }

  function handleToggleStep(step: Step) {
    toggleStep(step.id, !step.isDone);
    refresh();
  }

  async function handleAddPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled && result.assets[0]) {
      createAsset({ ideaId, type: 'photo', value: result.assets[0].uri });
      refresh();
    }
  }

  function handleAddLink() {
    if (!newLink.trim()) return;
    createAsset({ ideaId, type: 'link', value: newLink.trim() });
    setNewLink('');
    refresh();
  }

  function handleAddNote() {
    if (!newNote.trim()) return;
    createAsset({ ideaId, type: 'note', value: newNote.trim() });
    setNewNote('');
    refresh();
  }

  function handleDelete() {
    Alert.alert('Delete idea?', 'This removes its steps and attachments too.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteIdea(ideaId); navigation.goBack(); } },
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>{idea.title}</Text>

        <Text style={styles.sectionLabel}>Status</Text>
        <View style={styles.statusGrid}>
          {ALL_STATUSES.map((status) => {
            const active = idea.status === status;
            const c = statusColors[status];
            return (
              <TouchableOpacity
                key={status}
                style={[styles.statusPill, { backgroundColor: active ? c.bg : colors.surface, borderColor: active ? c.fg : colors.border }]}
                onPress={() => { updateIdeaStatus(ideaId, status); refresh(); }}
              >
                <Text style={[styles.statusPillText, { color: active ? c.fg : colors.textSecondary }]}>{STATUS_LABELS[status]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Steps</Text>
        {steps.map((step) => (
          <TouchableOpacity key={step.id} style={styles.stepRow} onPress={() => handleToggleStep(step)} onLongPress={() => { deleteStep(step.id); refresh(); }}>
            <View style={[styles.checkbox, step.isDone && styles.checkboxDone]}>
              {step.isDone && <Text style={styles.checkboxMark}>✓</Text>}
            </View>
            <Text style={[styles.stepText, step.isDone && styles.stepTextDone]}>{step.title}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.addRow}>
          <TextInput
            style={styles.addInput}
            placeholder="Add a step..."
            placeholderTextColor={colors.textMuted}
            value={newStepTitle}
            onChangeText={setNewStepTitle}
            onSubmitEditing={handleAddStep}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={handleAddStep} style={styles.addButton}><Text style={styles.addButtonText}>Add</Text></TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Attachments</Text>
        {assets.map((asset) => (
          <TouchableOpacity key={asset.id} style={styles.assetRow} onLongPress={() => { deleteAsset(asset.id); refresh(); }}>
            {asset.type === 'photo' || asset.type === 'screenshot' ? (
              <Image source={{ uri: asset.value }} style={styles.assetThumb} />
            ) : (
              <View style={[styles.assetThumb, styles.assetIconWrap]}>
                <Text style={styles.assetIcon}>{asset.type === 'link' ? '🔗' : '📝'}</Text>
              </View>
            )}
            <TouchableOpacity style={{ flex: 1 }} onPress={() => asset.type === 'link' && Linking.openURL(asset.value)}>
              <Text numberOfLines={2} style={styles.assetValue}>{asset.value}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={styles.attachControls}>
          <TouchableOpacity style={styles.attachButton} onPress={handleAddPhoto}>
            <Text style={styles.attachButtonText}>+ Photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addRow}>
          <TextInput style={styles.addInput} placeholder="Paste a link..." placeholderTextColor={colors.textMuted} value={newLink} onChangeText={setNewLink} onSubmitEditing={handleAddLink} returnKeyType="done" />
          <TouchableOpacity onPress={handleAddLink} style={styles.addButton}><Text style={styles.addButtonText}>Add</Text></TouchableOpacity>
        </View>
        <View style={styles.addRow}>
          <TextInput style={styles.addInput} placeholder="Add a note..." placeholderTextColor={colors.textMuted} value={newNote} onChangeText={setNewNote} onSubmitEditing={handleAddNote} returnKeyType="done" />
          <TouchableOpacity onPress={handleAddNote} style={styles.addButton}><Text style={styles.addButtonText}>Add</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete idea</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: '500', color: colors.textPrimary, marginBottom: 20 },
  sectionLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, marginTop: 12 },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  statusPill: { borderWidth: 1, borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6 },
  statusPillText: { fontSize: 13, fontWeight: '500' },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkboxMark: { color: '#FFF', fontSize: 12, fontWeight: '500' },
  stepText: { fontSize: 14, color: colors.textPrimary },
  stepTextDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  addInput: { flex: 1, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: colors.textPrimary },
  addButton: { justifyContent: 'center', paddingHorizontal: 14 },
  addButtonText: { color: colors.accent, fontWeight: '500' },
  assetRow: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 6 },
  assetThumb: { width: 44, height: 44, borderRadius: 8 },
  assetIconWrap: { backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  assetIcon: { fontSize: 18 },
  assetValue: { fontSize: 13, color: colors.textSecondary },
  attachControls: { flexDirection: 'row', gap: 8, marginTop: 6 },
  attachButton: { borderWidth: 0.5, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  attachButtonText: { fontSize: 13, color: colors.textPrimary },
  deleteButton: { marginTop: 32, alignItems: 'center', paddingVertical: 12 },
  deleteButtonText: { color: colors.urgent, fontSize: 14 },
});
