import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '@nookme/shared';
import { currentUser } from '@/data/mockData';

const settingsItems = [
  { icon: 'person-outline' as const, label: 'Edit Profile', color: colors.primary },
  { icon: 'notifications-outline' as const, label: 'Notifications', color: '#FF9500' },
  { icon: 'moon-outline' as const, label: 'Appearance', color: '#5856D6' },
  { icon: 'shield-outline' as const, label: 'Privacy', color: colors.accentGreen },
  { icon: 'cloud-outline' as const, label: 'Storage & Data', color: '#5AC8FA' },
  { icon: 'help-circle-outline' as const, label: 'Help & Support', color: colors.textSecondary },
  { icon: 'information-circle-outline' as const, label: 'About', color: colors.textSecondary },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={[styles.avatarLarge, { backgroundColor: currentUser.avatarColor }]}>
            <Text style={styles.avatarLargeText}>{currentUser.initials}</Text>
          </View>
          <Text style={styles.displayName}>{currentUser.displayName}</Text>
          <Text style={styles.username}>@{currentUser.username}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Nooks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2.4k</Text>
              <Text style={styles.statLabel}>Shared</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>847</Text>
              <Text style={styles.statLabel}>Reactions</Text>
            </View>
          </View>
        </View>

        {/* Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.activityCards}>
            <View style={styles.activityCard}>
              <View style={[styles.activityIcon, { backgroundColor: colors.accentOrangeSurface }]}>
                <Ionicons name="flame-outline" size={20} color="#FF9500" />
              </View>
              <View>
                <Text style={styles.activityValue}>14 days</Text>
                <Text style={styles.activityLabel}>Sharing streak</Text>
              </View>
            </View>
            <View style={styles.activityCard}>
              <View style={[styles.activityIcon, { backgroundColor: colors.accentGreenSurface }]}>
                <Ionicons name="trending-up-outline" size={20} color={colors.accentGreen} />
              </View>
              <View>
                <Text style={styles.activityValue}>42</Text>
                <Text style={styles.activityLabel}>This week</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsList}>
            {settingsItems.map((item, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.settingsItem,
                  pressed && styles.settingsItemPressed,
                  index === settingsItems.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.settingsItemLeft}>
                  <View style={[styles.settingsIcon, { backgroundColor: item.color + '14' }]}>
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={styles.settingsLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Logout */}
        <Pressable style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.8 }]}>
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <Text style={styles.version}>NookMe v0.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: typography.size['2xl'], fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 },
  profileCard: {
    alignItems: 'center', paddingVertical: 24, marginHorizontal: 20,
    backgroundColor: colors.surface, borderRadius: radius.xl,
  },
  avatarLarge: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarLargeText: { fontSize: 24, fontWeight: '700', color: colors.textInverse },
  displayName: { fontSize: typography.size.xl, fontWeight: '700', color: colors.textPrimary },
  username: { fontSize: typography.size.md, color: colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginTop: 20, paddingHorizontal: 24 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: typography.size.xl, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: typography.size.xs, color: colors.textMuted, marginTop: 2 },
  statDivider: { width: 0.5, height: 32, backgroundColor: colors.border, alignSelf: 'center' },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: {
    fontSize: typography.size.sm, color: colors.textMuted, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
  },
  activityCards: { flexDirection: 'row', gap: 10 },
  activityCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: 16,
  },
  activityIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  activityValue: { fontSize: typography.size.lg, fontWeight: '700', color: colors.textPrimary },
  activityLabel: { fontSize: typography.size.xs, color: colors.textMuted },
  settingsList: { backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden' },
  settingsItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  settingsItemPressed: { backgroundColor: colors.surfaceHover },
  settingsItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingsIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  settingsLabel: { fontSize: typography.size.md, color: colors.textPrimary, fontWeight: '500' },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 24, marginHorizontal: 20, paddingVertical: 14, borderRadius: radius.md,
    backgroundColor: '#FF3B3010',
  },
  logoutText: { fontSize: typography.size.md, color: colors.danger, fontWeight: '600' },
  version: { textAlign: 'center', fontSize: typography.size.xs, color: colors.textMuted, marginTop: 16, marginBottom: 30 },
});
