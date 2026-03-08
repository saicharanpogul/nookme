import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform as RNPlatform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, platformColors, platformIcons } from '@nookme/shared';
import type { Platform } from '@nookme/shared';
import { useNookStore, Message, ContentCard } from '@/stores/nookStore';
import { useAuthStore } from '@/stores/authStore';

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

function MessageBubble({ message, currentUserId }: { message: Message; currentUserId: string }) {
  const isMe = message.sender_id === currentUserId;
  const profile = message.sender_profile;
  const initials = profile
    ? profile.display_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <View style={[styles.messageBubbleWrapper, isMe && styles.messageBubbleWrapperMe]}>
      {!isMe && (
        <View style={[styles.messageAvatar, { backgroundColor: profile?.avatar_color || '#007AFF' }]}>
          <Text style={styles.messageAvatarText}>{initials}</Text>
        </View>
      )}
      <View style={styles.messageContentWrapper}>
        {!isMe && (
          <Text style={styles.messageSender}>{profile?.display_name || 'Unknown'}</Text>
        )}
        <View style={[styles.messageBubble, isMe && styles.messageBubbleMe]}>
          <Text style={[styles.messageText, isMe && styles.messageTextMe]}>{message.text}</Text>
        </View>
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>{formatTime(message.created_at)}</Text>
        </View>
      </View>
    </View>
  );
}

export default function ThreadView() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messageText, setMessageText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuthStore();
  const { contentCards, messages, messagesLoading, fetchMessages, sendMessage, toggleReaction } = useNookStore();
  const card = contentCards.find(c => c.id === id);

  useEffect(() => {
    if (id) fetchMessages(id as string);
  }, [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMessages(id as string);
    setRefreshing(false);
  }, [id]);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await sendMessage(id as string, messageText.trim());
    setMessageText('');
  };

  const platform = (card?.platform || 'web') as Platform;
  const pColor = platformColors[platform] || '#86868B';
  const pIcon = platformIcons[platform] || 'globe-outline';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Thread</Text>
          <Text style={styles.headerSubtitle}>{messages.length} replies</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={RNPlatform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} currentUserId={user?.id || ''} />
          )}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListHeaderComponent={
            card ? (
              <View style={styles.originalCard}>
                <View style={styles.originalCardHeader}>
                  <View style={[styles.platformBadge, { backgroundColor: pColor + '12' }]}>
                    <Ionicons name={pIcon as any} size={14} color={pColor} />
                    <Text style={[styles.platformBadgeText, { color: pColor }]}>
                      {platform}
                    </Text>
                  </View>
                  <Text style={styles.originalCardTime}>{formatTime(card.created_at)}</Text>
                </View>

                <View style={styles.originalCardBody}>
                  <View style={[styles.originalCardThumbnail, { backgroundColor: pColor + '12' }]}>
                    <Ionicons name={pIcon as any} size={32} color={pColor} />
                  </View>
                  <View style={styles.originalCardContent}>
                    <Text style={styles.originalCardTitle}>{card.title}</Text>
                    {card.description && (
                      <Text style={styles.originalCardDescription}>{card.description}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.originalCardReactions}>
                  {(card.reaction_counts || []).map((r, i) => (
                    <Pressable
                      key={i}
                      style={styles.reactionPill}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        toggleReaction(card.id, r.emoji);
                      }}
                    >
                      <Text style={styles.reactionPillEmoji}>{r.emoji}</Text>
                      <Text style={styles.reactionPillCount}>{r.count}</Text>
                    </Pressable>
                  ))}
                  <Pressable style={styles.addReactionButton}>
                    <Ionicons name="happy-outline" size={16} color={colors.textMuted} />
                  </Pressable>
                </View>

                <View style={styles.threadDivider}>
                  <View style={styles.threadDividerLine} />
                  <Text style={styles.threadDividerText}>{messages.length} replies</Text>
                  <View style={styles.threadDividerLine} />
                </View>
              </View>
            ) : null
          }
        />

        {/* Composer */}
        <View style={styles.composer}>
          <View style={styles.composerInner}>
            <Pressable style={styles.composerAction}>
              <Ionicons name="happy-outline" size={22} color={colors.textMuted} />
            </Pressable>
            <TextInput
              style={styles.composerInput}
              placeholder="Reply to thread..."
              placeholderTextColor={colors.textMuted}
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
            <Pressable
              style={[styles.sendButton, messageText.length > 0 && styles.sendButtonActive]}
              onPress={handleSend}
            >
              <Ionicons name="arrow-up" size={18} color={messageText.length > 0 ? colors.textInverse : colors.textMuted} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  messageList: { padding: 16, paddingBottom: 8 },
  originalCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, marginBottom: 8,
  },
  originalCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  platformBadge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.full, gap: 6,
  },
  platformBadgeText: { fontSize: typography.size.xs, fontWeight: '600', textTransform: 'capitalize' },
  originalCardTime: { fontSize: typography.size.xs, color: colors.textMuted },
  originalCardBody: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  originalCardThumbnail: {
    width: 68, height: 68, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
  },
  originalCardContent: { flex: 1, gap: 4 },
  originalCardTitle: { fontSize: typography.size.lg, fontWeight: '600', color: colors.textPrimary, lineHeight: 24 },
  originalCardDescription: { fontSize: typography.size.sm, color: colors.textSecondary, lineHeight: 20 },
  originalCardReactions: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 14 },
  reactionPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background,
    borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 6, gap: 4,
  },
  reactionPillEmoji: { fontSize: 16 },
  reactionPillCount: { fontSize: typography.size.sm, color: colors.textSecondary, fontWeight: '600' },
  addReactionButton: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  threadDivider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  threadDividerLine: { flex: 1, height: 0.5, backgroundColor: colors.border },
  threadDividerText: { fontSize: typography.size.xs, color: colors.textMuted, fontWeight: '500' },
  messageBubbleWrapper: { flexDirection: 'row', marginVertical: 6, gap: 10, alignItems: 'flex-start' },
  messageBubbleWrapperMe: { flexDirection: 'row-reverse' },
  messageAvatar: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
  messageAvatarText: { fontSize: 11, fontWeight: '700', color: colors.textInverse },
  messageContentWrapper: { maxWidth: '75%', gap: 4 },
  messageSender: { fontSize: typography.size.xs, color: colors.textMuted, fontWeight: '600', marginLeft: 4 },
  messageBubble: {
    backgroundColor: colors.surface, borderRadius: radius.lg, borderTopLeftRadius: radius.sm,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  messageBubbleMe: {
    backgroundColor: colors.primary, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.sm,
  },
  messageText: { fontSize: typography.size.md, color: colors.textPrimary, lineHeight: 22 },
  messageTextMe: { color: colors.textInverse },
  messageFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  messageTime: { fontSize: 10, color: colors.textMuted },
  composer: {
    borderTopWidth: 0.5, borderTopColor: colors.border, paddingHorizontal: 16,
    paddingVertical: 10, paddingBottom: 30, backgroundColor: colors.background,
  },
  composerInner: {
    flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.surface,
    borderRadius: radius.xl, paddingHorizontal: 12, paddingVertical: 8, gap: 8,
  },
  composerAction: { padding: 4, marginBottom: 2 },
  composerInput: { flex: 1, fontSize: typography.size.md, color: colors.textPrimary, maxHeight: 100, paddingVertical: 4 },
  sendButton: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  sendButtonActive: { backgroundColor: colors.primary },
});
