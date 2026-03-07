import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '@nookme/shared';
import { mockNooks } from '@/data/mockData';

function NookAvatar({ iconName, color }: { iconName: string; color: string }) {
  return (
    <View style={[styles.nookAvatar, { backgroundColor: color + '14' }]}>
      <Ionicons name={iconName as any} size={22} color={color} />
    </View>
  );
}

function NookCard({ nook, onPress }: { nook: typeof mockNooks[0]; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.nookCard, pressed && styles.nookCardPressed]}
      onPress={onPress}
    >
      <NookAvatar iconName={nook.iconName} color={nook.color} />

      <View style={styles.nookContent}>
        <View style={styles.nookHeader}>
          <View style={styles.nookNameRow}>
            {nook.isPinned && (
              <Ionicons name="pin" size={12} color={colors.primary} style={{ marginRight: 4 }} />
            )}
            <Text style={styles.nookName} numberOfLines={1}>{nook.name}</Text>
          </View>
          <Text style={styles.nookTime}>{nook.lastActivity}</Text>
        </View>

        <View style={styles.nookMeta}>
          <Text style={styles.nookDescription} numberOfLines={1}>
            {nook.description}
          </Text>
          {nook.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{nook.unreadCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.nookFooter}>
          <Ionicons name="people-outline" size={13} color={colors.textMuted} />
          <Text style={styles.nookMemberCount}>
            {nook.members.length} members · {nook.contentCount} items
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const pinnedNooks = mockNooks.filter(n => n.isPinned);
  const otherNooks = mockNooks.filter(n => !n.isPinned);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>NookMe</Text>
          <Text style={styles.headerSubtitle}>Your Nooks</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.headerButtonPrimary}>
            <Ionicons name="add" size={20} color={colors.textInverse} />
          </Pressable>
        </View>
      </View>

      {/* Nook List */}
      <FlatList
        data={[...pinnedNooks, ...otherNooks]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NookCard
            nook={item}
            onPress={() => router.push(`/nook/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.quickActions}>
            <Pressable style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primarySurface }]}>
                <Ionicons name="people-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>New Nook</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accentGreenSurface }]}>
                <Ionicons name="person-add-outline" size={18} color={colors.accentGreen} />
              </View>
              <Text style={styles.quickActionText}>Invite</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accentBlueSurface }]}>
                <Ionicons name="link-outline" size={18} color={colors.accentBlue} />
              </View>
              <Text style={styles.quickActionText}>Share Link</Text>
            </Pressable>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: radius.sm,
  },
  headerButtonPrimary: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 14,
    gap: 6,
  },
  quickActionPressed: {
    backgroundColor: colors.surfaceHover,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  list: {
    paddingBottom: 20,
  },
  separator: {
    height: 0.5,
    backgroundColor: colors.border,
    marginLeft: 80,
  },
  nookCard: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  nookCardPressed: {
    backgroundColor: colors.surface,
  },
  nookAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nookContent: {
    flex: 1,
    gap: 3,
  },
  nookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nookNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nookName: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  nookTime: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginLeft: 8,
  },
  nookMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nookDescription: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: '600',
  },
  nookFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  nookMemberCount: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
});
