import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, platformColors } from '@nookme/shared';
import { mockContentCards, mockNooks } from '@/data/mockData';

const filterTabs = ['All', 'Nooks', 'Content', 'Tags'] as const;

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<typeof filterTabs[number]>('All');

  const filteredCards = mockContentCards.filter(card =>
    card.title.toLowerCase().includes(query.toLowerCase()) ||
    card.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search content, nooks, tags..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {filterTabs.map(tab => (
          <Pressable
            key={tab}
            style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Recent / Results */}
      {query.length === 0 ? (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {['memes', 'startup', 'travel', 'crypto alpha'].map((term, i) => (
            <Pressable
              key={i}
              style={styles.recentItem}
              onPress={() => setQuery(term)}
            >
              <Ionicons name="time-outline" size={16} color={colors.textMuted} />
              <Text style={styles.recentText}>{term}</Text>
            </Pressable>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Trending Tags</Text>
          <View style={styles.tagsGrid}>
            {['funny', 'startup', 'cats', 'ai', 'travel', 'coding', 'memes', 'music'].map((tag, i) => (
              <Pressable
                key={i}
                style={styles.tagChip}
                onPress={() => setQuery(tag)}
              >
                <Text style={styles.tagChipText}>#{tag}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredCards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => (
            <Pressable
              style={styles.resultCard}
              onPress={() => router.push(`/thread/${item.id}`)}
            >
              <View style={styles.resultThumbnail}>
                <Text style={styles.resultThumbnailText}>{item.thumbnail}</Text>
              </View>
              <View style={styles.resultContent}>
                <View style={styles.resultHeader}>
                  <View
                    style={[
                      styles.platformDot,
                      { backgroundColor: platformColors[item.platform] },
                    ]}
                  />
                  <Text style={styles.resultPlatform}>{item.platform}</Text>
                </View>
                <Text style={styles.resultTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.resultMeta}>
                  <Text style={styles.resultMetaText}>
                    {item.sharedBy.avatar} {item.sharedBy.displayName} · {item.sharedAt}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>No results found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: '700',
    color: colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: typography.size.md,
    color: colors.textPrimary,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: colors.primary,
  },
  recentSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  recentText: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagChipText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  resultsList: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 20,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultThumbnail: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultThumbnailText: {
    fontSize: 28,
  },
  resultContent: {
    flex: 1,
    gap: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  platformDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  resultPlatform: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  resultTitle: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  resultMeta: {
    marginTop: 2,
  },
  resultMetaText: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: typography.size.lg,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
