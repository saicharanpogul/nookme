import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, platformColors, platformIcons } from '@nookme/shared';
import { mockContentCards } from '@/data/mockData';

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
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

      {query.length === 0 ? (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {['memes', 'startup', 'travel', 'crypto alpha'].map((term, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [styles.recentItem, pressed && { backgroundColor: colors.surface }]}
              onPress={() => setQuery(term)}
            >
              <Ionicons name="time-outline" size={16} color={colors.textMuted} />
              <Text style={styles.recentText}>{term}</Text>
              <View style={{ flex: 1 }} />
              <Ionicons name="arrow-forward-outline" size={14} color={colors.textMuted} />
            </Pressable>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Trending Tags</Text>
          <View style={styles.tagsGrid}>
            {['funny', 'startup', 'cats', 'ai', 'travel', 'coding', 'memes', 'music'].map((tag, i) => (
              <Pressable
                key={i}
                style={({ pressed }) => [styles.tagChip, pressed && { backgroundColor: colors.surfaceHover }]}
                onPress={() => setQuery(tag)}
              >
                <Ionicons name="pricetag-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.tagChipText}>{tag}</Text>
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
              style={({ pressed }) => [styles.resultCard, pressed && { backgroundColor: colors.surfaceHover }]}
              onPress={() => router.push(`/thread/${item.id}`)}
            >
              <View style={[styles.resultThumbnail, { backgroundColor: platformColors[item.platform] + '14' }]}>
                <Ionicons name={platformIcons[item.platform] as any} size={24} color={platformColors[item.platform]} />
              </View>
              <View style={styles.resultContent}>
                <View style={styles.resultHeader}>
                  <View style={[styles.platformDot, { backgroundColor: platformColors[item.platform] }]} />
                  <Text style={styles.resultPlatform}>{item.platform}</Text>
                </View>
                <Text style={styles.resultTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.resultMeta}>
                  <Ionicons name="person-outline" size={11} color={colors.textMuted} />
                  <Text style={styles.resultMetaText}>
                    {item.sharedBy.displayName} · {item.sharedAt}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: typography.size['2xl'], fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.md, marginHorizontal: 20, paddingHorizontal: 14, gap: 10,
  },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: typography.size.md, color: colors.textPrimary },
  filterTabs: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  filterTabActive: { backgroundColor: colors.primarySurface },
  filterTabText: { fontSize: typography.size.sm, color: colors.textSecondary, fontWeight: '500' },
  filterTabTextActive: { color: colors.primary },
  recentSection: { paddingHorizontal: 20, paddingTop: 8 },
  sectionTitle: {
    fontSize: typography.size.sm, color: colors.textMuted, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
  },
  recentItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12,
    paddingHorizontal: 4, borderRadius: radius.sm,
  },
  recentText: { fontSize: typography.size.md, color: colors.textPrimary },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: radius.full,
  },
  tagChipText: { fontSize: typography.size.sm, color: colors.textSecondary, fontWeight: '500' },
  resultsList: { paddingHorizontal: 20, gap: 10, paddingBottom: 20 },
  resultCard: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderRadius: radius.md, padding: 14, gap: 14,
  },
  resultThumbnail: {
    width: 52, height: 52, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  resultContent: { flex: 1, gap: 3 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  platformDot: { width: 6, height: 6, borderRadius: 3 },
  resultPlatform: { fontSize: typography.size.xs, color: colors.textMuted, textTransform: 'capitalize' },
  resultTitle: { fontSize: typography.size.md, color: colors.textPrimary, fontWeight: '500' },
  resultMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  resultMetaText: { fontSize: typography.size.xs, color: colors.textMuted },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyText: { fontSize: typography.size.lg, color: colors.textPrimary, fontWeight: '600' },
  emptySubtext: { fontSize: typography.size.md, color: colors.textSecondary },
});
