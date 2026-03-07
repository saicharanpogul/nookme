import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, platformColors, platformIcons } from '@nookme/shared';
import { mockContentCards, mockMessages, currentUser } from '@/data/mockData';

function MessageBubble({ message }: { message: typeof mockMessages[0] }) {
  const isMe = message.sender.id === currentUser.id;

  return (
    <View style={[styles.messageBubbleWrapper, isMe && styles.messageBubbleWrapperMe]}>
      {!isMe && (
        <View style={[styles.messageAvatar, { backgroundColor: message.sender.avatarColor }]}>
          <Text style={styles.messageAvatarText}>{message.sender.initials}</Text>
        </View>
      )}
      <View style={styles.messageContentWrapper}>
        {!isMe && (
          <Text style={styles.messageSender}>{message.sender.displayName}</Text>
        )}
        <View style={[styles.messageBubble, isMe && styles.messageBubbleMe]}>
          <Text style={[styles.messageText, isMe && styles.messageTextMe]}>{message.text}</Text>
        </View>
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>{message.sentAt}</Text>
          {message.reactions.length > 0 && (
            <View style={styles.messageReactions}>
              {message.reactions.map((r, i) => (
                <View key={i} style={styles.miniReaction}>
                  <Text style={styles.miniReactionEmoji}>{r.emoji}</Text>
                  <Text style={styles.miniReactionCount}>{r.count}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default function ThreadView() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messageText, setMessageText] = useState('');

  const card = mockContentCards.find(c => c.id === id) || mockContentCards[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Thread</Text>
          <Text style={styles.headerSubtitle}>{card.threadCount} replies</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          data={mockMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.originalCard}>
              <View style={styles.originalCardHeader}>
                <View style={[styles.platformBadge, { backgroundColor: platformColors[card.platform] + '12' }]}>
                  <Ionicons name={platformIcons[card.platform] as any} size={14} color={platformColors[card.platform]} />
                  <Text style={[styles.platformBadgeText, { color: platformColors[card.platform] }]}>
                    {card.platform}
                  </Text>
                </View>
                <Text style={styles.originalCardTime}>{card.sharedAt}</Text>
              </View>

              <View style={styles.originalCardBody}>
                <View style={[styles.originalCardThumbnail, { backgroundColor: platformColors[card.platform] + '12' }]}>
                  <Ionicons name={platformIcons[card.platform] as any} size={32} color={platformColors[card.platform]} />
                </View>
                <View style={styles.originalCardContent}>
                  <Text style={styles.originalCardTitle}>{card.title}</Text>
                  {card.description && (
                    <Text style={styles.originalCardDescription}>{card.description}</Text>
                  )}
                </View>
              </View>

              <View style={styles.originalCardReactions}>
                {card.reactions.map((r, i) => (
                  <Pressable key={i} style={styles.reactionPill}>
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
                <Text style={styles.threadDividerText}>{card.threadCount} replies</Text>
                <View style={styles.threadDividerLine} />
              </View>
            </View>
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
            <Pressable style={[styles.sendButton, messageText.length > 0 && styles.sendButtonActive]}>
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
  messageReactions: { flexDirection: 'row', gap: 4 },
  miniReaction: {
    flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: colors.surface,
    borderRadius: radius.full, paddingHorizontal: 6, paddingVertical: 2,
  },
  miniReactionEmoji: { fontSize: 11 },
  miniReactionCount: { fontSize: 10, color: colors.textMuted },
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
