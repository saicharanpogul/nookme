import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, platformColors, reactionEmojis } from '@nookme/shared';
import { mockNooks, mockContentCards } from '@/data/mockData';

function ContentCardItem({
  card,
  onPress,
}: {
  card: typeof mockContentCards[0];
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.contentCard, pressed && styles.contentCardPressed]}
      onPress={onPress}
    >
      {/* Platform indicator */}
      <View style={styles.cardHeader}>
        <View style={styles.cardPlatform}>
          <View
            style={[
              styles.platformDot,
              { backgroundColor: platformColors[card.platform] },
            ]}
          />
          <Text style={styles.platformText}>{card.platform}</Text>
        </View>
        <Text style={styles.cardTime}>{card.sharedAt}</Text>
      </View>

      {/* Thumbnail + Content */}
      <View style={styles.cardBody}>
        <View style={styles.cardThumbnail}>
          <Text style={styles.cardThumbnailText}>{card.thumbnail}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>{card.title}</Text>
          {card.description && (
            <Text style={styles.cardDescription} numberOfLines={1}>
              {card.description}
            </Text>
          )}
          {card.creator && (
            <Text style={styles.cardCreator}>{card.creator}</Text>
          )}
        </View>
      </View>

      {/* Tags */}
      {card.tags.length > 0 && (
        <View style={styles.cardTags}>
          {card.tags.map((tag, i) => (
            <View key={i} style={styles.tagPill}>
              <Text style={styles.tagPillText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Reactions + Thread */}
      <View style={styles.cardFooter}>
        <View style={styles.reactions}>
          {card.reactions.map((r, i) => (
            <View key={i} style={styles.reactionChip}>
              <Text style={styles.reactionEmoji}>{r.emoji}</Text>
              <Text style={styles.reactionCount}>{r.count}</Text>
            </View>
          ))}
          <View style={styles.addReaction}>
            <Ionicons name="add" size={14} color={colors.textMuted} />
          </View>
        </View>
        <Pressable style={styles.threadButton} onPress={onPress}>
          <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.threadCount}>{card.threadCount}</Text>
        </Pressable>
      </View>

      {/* Shared by */}
      <View style={styles.sharedBy}>
        <Text style={styles.sharedByAvatar}>{card.sharedBy.avatar}</Text>
        <Text style={styles.sharedByText}>
          Shared by {card.sharedBy.displayName}
        </Text>
      </View>
    </Pressable>
  );
}

export default function NookDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkInput, setLinkInput] = useState('');

  const nook = mockNooks.find(n => n.id === id) || mockNooks[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{nook.name}</Text>
          <Text style={styles.headerSubtitle}>
            {nook.members.length} members · {nook.contentCount} items
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerAction}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Members bar */}
      <View style={styles.membersBar}>
        {nook.members.slice(0, 5).map((member, i) => (
          <View
            key={i}
            style={[
              styles.memberChip,
              member.status === 'online' && styles.memberChipOnline,
            ]}
          >
            <Text style={styles.memberAvatar}>{member.avatar}</Text>
            <Text style={styles.memberName}>{member.displayName.split(' ')[0]}</Text>
            {member.status === 'online' && (
              <View style={styles.onlineDot} />
            )}
          </View>
        ))}
      </View>

      {/* Content Feed */}
      <FlatList
        data={mockContentCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContentCardItem
            card={item}
            onPress={() => router.push(`/thread/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.feed}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => setShowShareModal(true)}
      >
        <Ionicons name="add" size={28} color={colors.textPrimary} />
      </Pressable>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowShareModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Share Content</Text>
            <Text style={styles.modalSubtitle}>
              Paste a link to share with this Nook
            </Text>

            <View style={styles.modalInputWrapper}>
              <Ionicons name="link" size={18} color={colors.textMuted} />
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
              {['📷 Instagram', '🎵 TikTok', '📺 YouTube', '🐦 Twitter', '🌐 Web'].map((source, i) => (
                <View key={i} style={styles.sourceChip}>
                  <Text style={styles.sourceChipText}>{source}</Text>
                </View>
              ))}
            </View>

            <Pressable
              style={[styles.shareButton, !linkInput && styles.shareButtonDisabled]}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.shareButtonText}>Share to Nook</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    padding: 6,
  },
  membersBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memberChipOnline: {
    borderColor: 'rgba(45, 212, 168, 0.3)',
  },
  memberAvatar: {
    fontSize: 16,
  },
  memberName: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.online,
  },
  feed: {
    padding: 16,
    paddingBottom: 80,
  },
  contentCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentCardPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  platformDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  platformText: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  cardTime: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
  cardBody: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
  },
  cardThumbnail: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardThumbnailText: {
    fontSize: 32,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  cardCreator: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardTags: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  tagPill: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  tagPillText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reactions: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  reactionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  addReaction: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  threadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  threadCount: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sharedBy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sharedByAvatar: {
    fontSize: 14,
  },
  sharedByText: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: typography.size.md,
    color: colors.textPrimary,
  },
  modalSources: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  sourceChip: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sourceChipText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  shareButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareButtonText: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
