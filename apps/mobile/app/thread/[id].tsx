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
import { colors, typography, spacing, radius, platformColors, reactionEmojis } from '@nookme/shared';
import { mockContentCards, mockMessages, currentUser } from '@/data/mockData';

function MessageBubble({ message }: { message: typeof mockMessages[0] }) {
  const isMe = message.sender.id === currentUser.id;

  return (
    <View style={[styles.messageBubbleWrapper, isMe && styles.messageBubbleWrapperMe]}>
      {!isMe && (
        <View style={styles.messageAvatar}>
          <Text style={styles.messageAvatarText}>{message.sender.avatar}</Text>
        </View>
      )}
      <View style={styles.messageContentWrapper}>
        {!isMe && (
          <Text style={styles.messageSender}>{message.sender.displayName}</Text>
        )}
        <View style={[styles.messageBubble, isMe && styles.messageBubbleMe]}>
          <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
            {message.text}
          </Text>
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
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>Thread</Text>
          <Text style={styles.headerSubtitle}>{card.threadCount} replies</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Thread Content */}
        <FlatList
          data={mockMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            /* Original Content Card */
            <View style={styles.originalCard}>
              <View style={styles.originalCardHeader}>
                <View
                  style={[
                    styles.platformBadge,
                    { backgroundColor: platformColors[card.platform] + '20' },
                  ]}
                >
                  <View
                    style={[
                      styles.platformDotSmall,
                      { backgroundColor: platformColors[card.platform] },
                    ]}
                  />
                  <Text
                    style={[
                      styles.platformBadgeText,
                      { color: platformColors[card.platform] },
                    ]}
                  >
                    {card.platform}
                  </Text>
                </View>
                <Text style={styles.originalCardTime}>{card.sharedAt}</Text>
              </View>

              <View style={styles.originalCardBody}>
                <View style={styles.originalCardThumbnail}>
                  <Text style={styles.originalCardThumbnailText}>{card.thumbnail}</Text>
                </View>
                <View style={styles.originalCardContent}>
                  <Text style={styles.originalCardTitle}>{card.title}</Text>
                  {card.description && (
                    <Text style={styles.originalCardDescription}>{card.description}</Text>
                  )}
                </View>
              </View>

              {/* Reactions on original card */}
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
                <Text style={styles.threadDividerText}>
                  {card.threadCount} replies
                </Text>
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
            <Pressable
              style={[styles.sendButton, messageText.length > 0 && styles.sendButtonActive]}
            >
              <Ionicons
                name="send"
                size={18}
                color={messageText.length > 0 ? colors.textPrimary : colors.textMuted}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
  originalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  originalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 6,
  },
  platformDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  platformBadgeText: {
    fontSize: typography.size.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  originalCardTime: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
  originalCardBody: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  originalCardThumbnail: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  originalCardThumbnailText: {
    fontSize: 36,
  },
  originalCardContent: {
    flex: 1,
    gap: 6,
  },
  originalCardTitle: {
    fontSize: typography.size.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  originalCardDescription: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  originalCardReactions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 14,
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reactionPillEmoji: {
    fontSize: 16,
  },
  reactionPillCount: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  addReactionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  threadDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  threadDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  threadDividerText: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    fontWeight: '500',
  },
  messageBubbleWrapper: {
    flexDirection: 'row',
    marginVertical: 6,
    gap: 10,
    alignItems: 'flex-start',
  },
  messageBubbleWrapperMe: {
    flexDirection: 'row-reverse',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  messageAvatarText: {
    fontSize: 16,
  },
  messageContentWrapper: {
    maxWidth: '75%',
    gap: 4,
  },
  messageSender: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    fontWeight: '600',
    marginLeft: 4,
  },
  messageBubble: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderTopLeftRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageBubbleMe: {
    backgroundColor: colors.primarySurface,
    borderColor: 'rgba(124, 92, 252, 0.3)',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.sm,
  },
  messageText: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  messageTextMe: {
    color: colors.textPrimary,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  messageTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
  messageReactions: {
    flexDirection: 'row',
    gap: 4,
  },
  miniReaction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  miniReactionEmoji: {
    fontSize: 11,
  },
  miniReactionCount: {
    fontSize: 10,
    color: colors.textMuted,
  },
  composer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 30,
    backgroundColor: colors.surface,
  },
  composerInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  composerAction: {
    padding: 4,
    marginBottom: 2,
  },
  composerInput: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.textPrimary,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
});
