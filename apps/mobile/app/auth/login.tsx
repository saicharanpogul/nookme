import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius } from '@nookme/shared';
import { useAuthStore } from '@/stores/authStore';
import TypeLogo from '@/components/TypeLogo';

type Step = 'email' | 'otp';

export default function Login() {
  const router = useRouter();
  const { sendOtp, verifyOtp, loading } = useAuthStore();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const otpRef = useRef<TextInput>(null);

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    const { error } = await sendOtp(trimmedEmail);
    if (error) {
      Alert.alert('Error', error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep('otp');
      setTimeout(() => otpRef.current?.focus(), 300);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 8) {
      Alert.alert('Invalid code', 'Please enter the 8-digit code from your email.');
      return;
    }

    const { error } = await verifyOtp(email.trim().toLowerCase(), otp);
    if (error) {
      Alert.alert('Verification failed', error);
      setOtp('');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    }
  };

  const handleResend = async () => {
    setOtp('');
    const { error } = await sendOtp(email.trim().toLowerCase());
    if (error) {
      Alert.alert('Error', error);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Alert.alert('Code sent!', 'Check your email for a new code.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <TypeLogo width={180} height={45} color={colors.textPrimary} />
          <Text style={styles.logoSubtext}>Your shared content space</Text>
        </View>

        {step === 'email' ? (
          /* ─── Email Step ─── */
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="you@email.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                  editable={!loading}
                  onSubmitEditing={handleSendOtp}
                  returnKeyType="next"
                />
              </View>
            </View>

            <Text style={styles.hint}>
              We'll send a one-time code to your email
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                (!email.trim() || loading) && styles.primaryButtonDisabled,
              ]}
              onPress={handleSendOtp}
              disabled={!email.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.primaryButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.textInverse} />
                </View>
              )}
            </Pressable>
          </View>
        ) : (
          /* ─── OTP Step ─── */
          <View style={styles.form}>
            <View style={styles.otpHeader}>
              <Pressable onPress={() => { setStep('email'); setOtp(''); }}>
                <Ionicons name="arrow-back" size={22} color={colors.primary} />
              </Pressable>
              <Text style={styles.otpTitle}>Enter verification code</Text>
            </View>

            <Text style={styles.otpSubtitle}>
              We sent an 8-digit code to{'\n'}
              <Text style={styles.otpEmail}>{email}</Text>
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons name="keypad-outline" size={18} color={colors.textMuted} />
              <TextInput
                ref={otpRef}
                style={[styles.input, styles.otpInput]}
                placeholder="00000000"
                placeholderTextColor={colors.textMuted}
                value={otp}
                onChangeText={(text) => {
                  const clean = text.replace(/[^0-9]/g, '').slice(0, 8);
                  setOtp(clean);
                  if (clean.length === 8) {
                    // Auto-verify when 8 digits entered
                    setTimeout(() => handleVerifyOtp(), 100);
                  }
                }}
                keyboardType="number-pad"
                maxLength={8}
                editable={!loading}
                autoFocus
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                (otp.length < 8 || loading) && styles.primaryButtonDisabled,
              ]}
              onPress={handleVerifyOtp}
              disabled={otp.length < 8 || loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <Text style={styles.primaryButtonText}>Verify</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.resendButton}
              onPress={handleResend}
              disabled={loading}
            >
              <Text style={styles.resendText}>Didn't get the code? Resend</Text>
            </Pressable>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.textMuted} />
          <Text style={styles.footerText}>
            No passwords needed. Passwordless login.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  logoText: {
    fontSize: typography.size['3xl'],
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  logoSubtext: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    gap: 6,
  },
  inputLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: '500',
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: typography.size.md,
    color: colors.textPrimary,
    letterSpacing: 0,
  },
  otpInput: {
    letterSpacing: 4,
    fontSize: typography.size.xl,
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: -4,
  },
  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  otpTitle: {
    fontSize: typography.size.xl,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  otpSubtitle: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  otpEmail: {
    color: colors.primary,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: colors.textInverse,
    fontSize: typography.size.lg,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendText: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
    gap: 6,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: typography.size.sm,
  },
});
