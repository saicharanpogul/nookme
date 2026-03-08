import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadows } from '@nookme/shared';
import { useNookStore, Nook } from '@/stores/nookStore';

function NookAvatar({ iconName, color }: { iconName: string; color: string }) {
  return (
    <View style={[styles.nookAvatar, { backgroundColor: color + '14' }]}>
      <Ionicons name={iconName as any} size={22} color={color} />
    </View>
  );
}

function NookCard({ nook, onPress }: { nook: Nook; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.nookCard, pressed && styles.nookCardPressed]}
      onPress={onPress}
    >
      <NookAvatar iconName={nook.icon_name} color={nook.color} />

      <View style={styles.nookContent}>
        <View style={styles.nookHeader}>
          <View style={styles.nookNameRow}>
            <Text style={styles.nookName} numberOfLines={1}>{nook.name}</Text>
          </View>
          <Text style={styles.nookTime}>{nook.last_activity || ''}</Text>
        </View>

        <View style={styles.nookMeta}>
          <Text style={styles.nookDescription} numberOfLines={1}>
            {nook.description}
          </Text>
          {(nook.content_count ?? 0) > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{nook.content_count}</Text>
            </View>
          )}
        </View>

        <View style={styles.nookFooter}>
          <Ionicons name="people-outline" size={13} color={colors.textMuted} />
          <Text style={styles.nookMemberCount}>
            {nook.member_count || 0} members · {nook.content_count || 0} items
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { nooks, nooksLoading, fetchNooks } = useNookStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNooks();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchNooks();
    setRefreshing(false);
  }, []);

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
        data={nooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NookCard
            nook={item}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/nook/${item.id}`);
            }}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
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
