import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '@nookme/shared';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'share-outline' as const,
    iconColor: '#007AFF',
    title: 'Share Differently',
    subtitle: 'Every link becomes a\nstructured content card',
  },
  {
    icon: 'chatbubbles-outline' as const,
    iconColor: '#5856D6',
    title: 'Threaded Conversations',
    subtitle: 'Discuss each piece of content\nin its own dedicated thread',
  },
  {
    icon: 'cloud-done-outline' as const,
    iconColor: '#34C759',
    title: 'Shared Memory',
    subtitle: 'Your conversations never\nget lost, everything is saved',
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
      {/* Skip button */}
      <Pressable
        style={styles.skipButton}
        onPress={() => router.replace('/auth/login')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: slide.iconColor + '12' }]}>
          <Ionicons name={slide.icon} size={48} color={slide.iconColor} />
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
        <Pressable
          style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={colors.textInverse} />
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
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: typography.size['3xl'],
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
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
    backgroundColor: colors.border,
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
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonPressed: {
    opacity: 0.85,
  },
  nextButtonText: {
    color: colors.textInverse,
    fontSize: typography.size.lg,
    fontWeight: '600',
  },
});
