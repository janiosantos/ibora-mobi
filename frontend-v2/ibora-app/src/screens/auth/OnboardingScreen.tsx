/**
 * OnboardingScreen - Universal
 * Works for both Driver and Passenger
 * Shows different content based on userType
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface OnboardingScreenProps {
  userType: 'driver' | 'passenger';
}

const DRIVER_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Ganhe Dinheiro Dirigindo',
    description: 'Trabalhe quando quiser e ganhe dinheiro extra nas horas livres.',
    icon: '💰',
  },
  {
    id: '2',
    title: 'Seja Seu Próprio Chefe',
    description: 'Você decide quando, onde e quanto tempo quer trabalhar.',
    icon: '🚗',
  },
  {
    id: '3',
    title: 'Receba Rapidamente',
    description: 'Saque seus ganhos a qualquer momento via PIX com taxa zero.',
    icon: '⚡',
  },
  {
    id: '4',
    title: 'Suporte 24/7',
    description: 'Nossa equipe está sempre pronta para ajudar você.',
    icon: '🛟',
  },
];

const PASSENGER_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Viagens Rápidas e Seguras',
    description: 'Encontre motoristas próximos em segundos e chegue ao seu destino com segurança.',
    icon: '🚀',
  },
  {
    id: '2',
    title: 'Preços Justos',
    description: 'Você oferece o preço que quer pagar. Transparência total.',
    icon: '💵',
  },
  {
    id: '3',
    title: 'Múltiplas Formas de Pagamento',
    description: 'Pague com PIX, cartão ou dinheiro. Você escolhe!',
    icon: '💳',
  },
  {
    id: '4',
    title: 'Avalie Sua Experiência',
    description: 'Compartilhe sua experiência e ajude a melhorar o serviço.',
    icon: '⭐',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ userType }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides = userType === 'driver' ? DRIVER_SLIDES : PASSENGER_SLIDES;
  const isLastSlide = currentIndex === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      handleFinish();
    } else {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    if (userType === 'driver') {
      navigation.navigate('DriverVehicleInformation');
    } else {
      navigation.navigate('PassengerLocationPermission');
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        {item.title}
      </Text>
      <Text style={[styles.description, { color: colors.text.secondary }]}>
        {item.description}
      </Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === currentIndex ? colors.primary : colors.border,
              width: index === currentIndex ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Skip Button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.text.secondary }]}>
            Pular
          </Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
      />

      {/* Dots */}
      {renderDots()}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleNext}
          style={styles.nextButton}
        >
          {isLastSlide ? 'Começar' : 'Próximo'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.fontSize.lg,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  nextButton: {
    width: '100%',
  },
});
