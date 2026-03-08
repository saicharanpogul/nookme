import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, platformColors, platformIcons } from '@nookme/shared';
import type { Platform as PlatformType } from '@nookme/shared';
import { useNookStore, ContentCard } from '@/stores/nookStore';

function formatTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function ContentCardItem({
  card,
  onPress,
  onReact,
}: {
  card: ContentCard;
  onPress: () => void;
  onReact: (emoji: string) => void;
}) {
  const platform = (card.platform || 'web') as PlatformType;
  const pColor = platformColors[platform] || '#86868B';
  const pIcon = platformIcons[platform] || 'globe-outline';
  return (
    <Pressable
      style={({ pressed }) => [styles.contentCard, pressed && styles.contentCardPressed]}
      onPress={onPress}
    >
      {/* Platform indicator */}
      <View style={styles.cardHeader}>
        <View style={styles.cardPlatform}>
          <View style={[styles.platformDot, { backgroundColor: pColor }]} />
          <Text style={styles.platformText}>{platform}</Text>
        </View>
        <Text style={styles.cardTime}>{formatTime(card.created_at)}</Text>
      </View>

      {/* Thumbnail + Content */}
      <View style={styles.cardBody}>
        <View style={[styles.cardThumbnail, { backgroundColor: pColor + '12' }]}>
          <Ionicons name={pIcon as any} size={28} color={pColor} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>{card.title}</Text>
          {card.description && (
            <Text style={styles.cardDescription} numberOfLines={1}>{card.description}</Text>
          )}
          {card.creator && (
            <Text style={styles.cardCreator}>{card.creator}</Text>
          )}
        </View>
      </View>

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <View style={styles.cardTags}>
          {card.tags.map((tag, i) => (
            <View key={i} style={styles.tagPill}>
              <Ionicons name="pricetag-outline" size={10} color={colors.textSecondary} />
              <Text style={styles.tagPillText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Reactions + Thread */}
      <View style={styles.cardFooter}>
        <View style={styles.reactions}>
          {(card.reaction_counts || []).map((r, i) => (
            <Pressable
              key={i}
              style={styles.reactionChip}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onReact(r.emoji);
              }}
            >
              <Text style={styles.reactionEmoji}>{r.emoji}</Text>
              <Text style={styles.reactionCount}>{r.count}</Text>
            </Pressable>
          ))}
          <Pressable style={styles.addReaction}>
            <Ionicons name="add" size={14} color={colors.textMuted} />
          </Pressable>
        </View>
        <Pressable style={styles.threadButton} onPress={onPress}>
          <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.threadCount}>{card.thread_count || 0}</Text>
        </Pressable>
      </View>

      {/* Shared by */}
      {card.shared_by_profile && (
        <View style={styles.sharedBy}>
          <View style={[styles.sharedByAvatar, { backgroundColor: card.shared_by_profile.avatar_color }]}>
            <Text style={styles.sharedByInitials}>
              {card.shared_by_profile.display_name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.sharedByText}>
            Shared by {card.shared_by_profile.display_name}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default function NookDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { nooks, contentCards, cardsLoading, fetchContentCards, toggleReaction } = useNookStore();
  const nook = nooks.find(n => n.id === id);

  useEffect(() => {
    if (id) fetchContentCards(id as string);
  }, [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchContentCards(id as string);
    setRefreshing(false);
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{nook?.name || 'Nook'}</Text>
          <Text style={styles.headerSubtitle}>
            {nook?.member_count || 0} members · {nook?.content_count || 0} items
          </Text>
        </View>
        <Pressable style={styles.headerAction}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Content Feed */}
      <FlatList
        data={contentCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContentCardItem
            card={item}
            onPress={() => router.push(`/thread/${item.id}`)}
            onReact={(emoji) => toggleReaction(item.id, emoji)}
          />
        )}
        contentContainerStyle={styles.feed}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        onPress={() => setShowShareModal(true)}
      >
        <Ionicons name="add" size={26} color={colors.textInverse} />
      </Pressable>

      {/* Share Modal */}
      <Modal visible={showShareModal} transparent animationType="slide" onRequestClose={() => setShowShareModal(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowShareModal(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Share Content</Text>
            <Text style={styles.modalSubtitle}>Paste a link to share with this Nook</Text>

            <View style={styles.modalInputWrapper}>
              <Ionicons name="link-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.modalInput}
                placeholder="Paste link here..."
                placeholderTextColor={colors.textMuted}
                value={linkInput}
                onChangeText={setLinkInput}
                autoFocus
              />
            </View>

            <View style={styles.modalSources}>
              <View style={styles.sourceChip}>
                <Ionicons name={'logo-instagram' as any} size={16} color="#E4405F" />
                <Text style={styles.sourceChipText}>Instagram</Text>
              </View>
              <View style={styles.sourceChip}>
                <Ionicons name={'logo-tiktok' as any} size={16} color="#000" />
                <Text style={styles.sourceChipText}>TikTok</Text>
              </View>
              <View style={styles.sourceChip}>
                <Ionicons name={'logo-youtube' as any} size={16} color="#FF0000" />
                <Text style={styles.sourceChipText}>YouTube</Text>
              </View>
              <View style={styles.sourceChip}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#000' }}>𝕏</Text>
                <Text style={styles.sourceChipText}>X</Text>
              </View>
              <View style={styles.sourceChip}>
                <Ionicons name={'globe-outline' as any} size={16} color="#86868B" />
                <Text style={styles.sourceChipText}>Web</Text>
              </View>
            </View>

            <Pressable
              style={[styles.shareButton, !linkInput && styles.shareButtonDisabled]}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.shareButtonText}>Share to Nook</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: colors.border, gap: 8,
  },
  backButton: { padding: 4 },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: typography.size.lg, fontWeight: '600', color: colors.textPrimary },
  headerSubtitle: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 1 },
  headerAction: { padding: 6 },
  membersBar: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  memberChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 6, gap: 6,
  },
  memberChipOnline: { backgroundColor: colors.accentGreenSurface },
  memberAvatar: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  memberInitials: { fontSize: 8, fontWeight: '700', color: colors.textInverse },
  memberName: { fontSize: typography.size.xs, color: colors.textSecondary, fontWeight: '500' },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.online },
  feed: { padding: 16, paddingBottom: 80 },
  contentCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16,
  },
  contentCardPressed: { backgroundColor: colors.surfaceHover },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  cardPlatform: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  platformDot: { width: 8, height: 8, borderRadius: 4 },
  platformText: { fontSize: typography.size.xs, color: colors.textMuted, textTransform: 'capitalize', fontWeight: '500' },
  cardTime: { fontSize: typography.size.xs, color: colors.textMuted },
  cardBody: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  cardThumbnail: {
    width: 60, height: 60, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
  },
  cardContent: { flex: 1, gap: 3 },
  cardTitle: { fontSize: typography.size.md, fontWeight: '600', color: colors.textPrimary, lineHeight: 22 },
  cardDescription: { fontSize: typography.size.sm, color: colors.textSecondary },
  cardCreator: { fontSize: typography.size.xs, color: colors.textMuted, marginTop: 2 },
  cardTags: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  tagPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full,
  },
  tagPillText: { fontSize: typography.size.xs, color: colors.textSecondary },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reactions: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  reactionChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background,
    borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 4, gap: 4,
  },
  reactionEmoji: { fontSize: 14 },
  reactionCount: { fontSize: typography.size.xs, color: colors.textSecondary, fontWeight: '500' },
  addReaction: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  threadButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: colors.background, borderRadius: radius.full,
  },
  threadCount: { fontSize: typography.size.xs, color: colors.textSecondary, fontWeight: '500' },
  sharedBy: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 10,
    borderTopWidth: 0.5, borderTopColor: colors.border,
  },
  sharedByAvatar: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sharedByInitials: { fontSize: 8, fontWeight: '700', color: colors.textInverse },
  sharedByText: { fontSize: typography.size.xs, color: colors.textMuted },
  fab: {
    position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
  modalContent: {
    backgroundColor: colors.background, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    padding: 24, paddingBottom: 40,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border,
    alignSelf: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: typography.size.xl, fontWeight: '700', color: colors.textPrimary },
  modalSubtitle: { fontSize: typography.size.sm, color: colors.textSecondary, marginTop: 4, marginBottom: 20 },
  modalInputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.md, paddingHorizontal: 14, gap: 10,
  },
  modalInput: { flex: 1, paddingVertical: 14, fontSize: typography.size.md, color: colors.textPrimary },
  modalSources: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16, marginBottom: 24 },
  sourceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.full,
  },
  sourceChipText: { fontSize: typography.size.sm, color: colors.textSecondary },
  shareButton: {
    backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center',
  },
  shareButtonDisabled: { opacity: 0.5 },
  shareButtonText: { fontSize: typography.size.lg, fontWeight: '600', color: colors.textInverse },
});
