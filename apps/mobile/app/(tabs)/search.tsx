import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, platformColors, platformIcons } from '@nookme/shared';
import { useNookStore, ContentCard } from '@/stores/nookStore';

export default function SearchScreen() {
  const router = useRouter();
  const { searchContent, nooks } = useNookStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ContentCard[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setSearching(true);
    setHasSearched(true);
    const data = await searchContent(text.trim());
    setResults(data);
    setSearching(false);
  }, [searchContent]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your content..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={handleSearch}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable onPress={() => { setQuery(''); setResults([]); setHasSearched(false); }}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {query.length < 2 ? (
        <View style={styles.browseSection}>
          <Text style={styles.sectionTitle}>Your Nooks</Text>
          <View style={styles.nookChips}>
            {nooks.map((nook) => (
              <Pressable
                key={nook.id}
                style={({ pressed }) => [styles.nookChip, pressed && { backgroundColor: colors.surfaceHover }]}
                onPress={() => router.push(`/nook/${nook.id}`)}
              >
                <View style={[styles.nookChipIcon, { backgroundColor: nook.color + '14' }]}>
                  <Ionicons name={nook.icon_name as any} size={14} color={nook.color} />
                </View>
                <Text style={styles.nookChipText} numberOfLines={1}>{nook.name}</Text>
                <Text style={styles.nookChipCount}>{nook.content_count || 0}</Text>
              </Pressable>
            ))}
          </View>

          {nooks.length === 0 && (
            <View style={styles.emptyBrowse}>
              <Ionicons name="search-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>Start sharing content to search it later</Text>
            </View>
          )}
        </View>
      ) : searching ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.resultCard, pressed && { backgroundColor: colors.surfaceHover }]}
              onPress={() => router.push(`/thread/${item.id}`)}
            >
              <View style={[styles.resultThumbnail, { backgroundColor: (platformColors[item.platform as keyof typeof platformColors] || colors.primary) + '14' }]}>
                <Ionicons
                  name={(platformIcons[item.platform as keyof typeof platformIcons] || 'globe-outline') as any}
                  size={24}
                  color={platformColors[item.platform as keyof typeof platformColors] || colors.primary}
                />
              </View>
              <View style={styles.resultContent}>
                <View style={styles.resultHeader}>
                  <View style={[styles.platformDot, { backgroundColor: platformColors[item.platform as keyof typeof platformColors] || colors.primary }]} />
                  <Text style={styles.resultPlatform}>{item.platform || 'web'}</Text>
                </View>
                <Text style={styles.resultTitle} numberOfLines={2}>{item.title || item.url}</Text>
                <Text style={styles.resultMeta}>{formatDate(item.created_at)}</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            hasSearched ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={colors.textMuted} />
                <Text style={styles.emptyText}>No results for "{query}"</Text>
                <Text style={styles.emptySubtext}>Try a different search term</Text>
              </View>
            ) : null
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
  searchInput: { flex: 1, paddingVertical: 14, fontSize: typography.size.md, color: colors.textPrimary, letterSpacing: 0 },
  browseSection: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: {
    fontSize: typography.size.sm, color: colors.textMuted, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
  },
  nookChips: { gap: 8 },
  nookChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, padding: 12, borderRadius: radius.md,
  },
  nookChipIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  nookChipText: { flex: 1, fontSize: typography.size.md, color: colors.textPrimary, fontWeight: '500' },
  nookChipCount: { fontSize: typography.size.sm, color: colors.textMuted, fontWeight: '500' },
  emptyBrowse: { alignItems: 'center', paddingTop: 40, gap: 12 },
  loadingState: { alignItems: 'center', paddingTop: 40 },
  resultsList: { paddingHorizontal: 20, gap: 10, paddingBottom: 20, paddingTop: 12 },
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
  resultMeta: { fontSize: typography.size.xs, color: colors.textMuted, marginTop: 2 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyText: { fontSize: typography.size.lg, color: colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  emptySubtext: { fontSize: typography.size.md, color: colors.textSecondary },
});
