import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '@nookme/shared';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    emoji: '🧩',
    title: 'Share Differently',
    subtitle: 'Every link becomes a\nstructured content card',
    gradient: [colors.primary, '#4F35B8'] as const,
  },
  {
    emoji: '💬',
    title: 'Threaded Conversations',
    subtitle: 'Discuss each piece of content\nin its own dedicated thread',
    gradient: [colors.accentBlue, '#2563EB'] as const,
  },
  {
    emoji: '🧠',
    title: 'Shared Memory',
    subtitle: 'Your conversations never\nget lost — everything is saved',
    gradient: [colors.accentGreen, '#059669'] as const,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace('/auth/login');
    }
  };

  const slide = slides[currentSlide];

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={[colors.background, slide.gradient[1], colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        locations={[0, 0.5, 1]}
      />

      {/* Skip button */}
      <Pressable
        style={styles.skipButton}
        onPress={() => router.replace('/auth/login')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      {/* Content */}
      <View style={styles.content}>
        {/* Emoji */}
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{slide.emoji}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentSlide && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottom}>
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <LinearGradient
            colors={[colors.primary, colors.primaryMuted]}
            style={styles.nextButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.nextButtonText}>
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: typography.size['3xl'],
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: typography.size.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceElevated,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  nextButton: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: '700',
  },
});
