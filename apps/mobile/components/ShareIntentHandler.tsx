import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '@nookme/shared';
import { useNookStore, Nook } from '@/stores/nookStore';
import { useShareIntent } from 'expo-share-intent';

/**
 * Component that listens for incoming share intents.
 * When a URL is shared from another app, it shows a bottom-sheet-style
 * modal letting the user pick which nook to save it to.
 */
export default function ShareIntentHandler() {
  const router = useRouter();
  const { shareIntent, resetShareIntent } = useShareIntent();
  const { nooks, fetchNooks, createContentCard } = useNookStore();
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (shareIntent?.text || shareIntent?.webUrl) {
      const url = shareIntent.webUrl || shareIntent.text || '';
      if (url) {
        setSharedUrl(url);
        setVisible(true);
        fetchNooks();
      }
    }
  }, [shareIntent]);

  const handlePickNook = useCallback(
    async (nook: Nook) => {
      if (!sharedUrl || saving) return;
      setSaving(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const cardId = await createContentCard(nook.id, sharedUrl);

      setSaving(false);
      setVisible(false);
      setSharedUrl(null);
      resetShareIntent();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate to the nook to see the new card
      if (cardId) {
        router.push(`/nook/${nook.id}`);
      }
    },
    [sharedUrl, saving, createContentCard, resetShareIntent, router]
  );

  const handleCancel = () => {
    setVisible(false);
    setSharedUrl(null);
    resetShareIntent();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleCancel} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.sheetTitle}>Share to Nook</Text>
          <Text style={styles.sheetUrl} numberOfLines={2}>
            {sharedUrl}
          </Text>

          {nooks.length === 0 ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.emptyText}>Loading your Nooks...</Text>
            </View>
          ) : (
            <FlatList
              data={nooks}
              keyExtractor={(item) => item.id}
              style={styles.nookList}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.nookRow,
                    pressed && styles.nookRowPressed,
                  ]}
                  onPress={() => handlePickNook(item)}
                  disabled={saving}
                >
                  <View style={[styles.nookIcon, { backgroundColor: item.color + '15' }]}>
                    <Ionicons
                      name={(item.icon_name || 'grid-outline') as any}
                      size={20}
                      color={item.color || colors.primary}
                    />
                  </View>
                  <View style={styles.nookInfo}>
                    <Text style={styles.nookName}>{item.name}</Text>
                    <Text style={styles.nookMeta}>
                      {item.member_count} members
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </Pressable>
              )}
            />
          )}

          {saving && (
            <View style={styles.savingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.savingText}>Creating card...</Text>
            </View>
          )}

          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sheetUrl: {
    fontSize: typography.size.sm,
    color: colors.primary,
    marginBottom: 20,
    lineHeight: 20,
  },
  nookList: {
    maxHeight: 320,
  },
  nookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: radius.lg,
    gap: 14,
  },
  nookRowPressed: {
    backgroundColor: colors.surface,
  },
  nookIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nookInfo: {
    flex: 1,
    gap: 2,
  },
  nookName: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  nookMeta: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 12,
  },
  savingText: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
