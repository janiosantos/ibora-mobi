/**
 * LocationPermissionScreen - Universal
 * Requests location permission for both Driver and Passenger
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { useLocation } from '../../hooks';

interface LocationPermissionScreenProps {
  userType: 'driver' | 'passenger';
}

export const LocationPermissionScreen: React.FC<LocationPermissionScreenProps> = ({
  userType,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { requestPermission, requestBackgroundPermission } = useLocation({
    enabled: false,
  });

  const handleAllowLocation = async () => {
    setLoading(true);

    try {
      // Request foreground permission
      const granted = await requestPermission();

      if (!granted) {
        Alert.alert(
          'Permissão Negada',
          'Precisamos da sua localização para funcionar corretamente. Por favor, habilite nas configurações do dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Abrir Configurações',
              onPress: () => {
                // Open settings
                // Linking.openSettings();
              },
            },
          ]
        );
        setLoading(false);
        return;
      }

      // For drivers, also request background permission
      if (userType === 'driver') {
        const backgroundGranted = await requestBackgroundPermission();

        if (!backgroundGranted) {
          Alert.alert(
            'Permissão de Localização em Segundo Plano',
            'Para receber corridas quando o app estiver fechado, precisamos da permissão de localização "Sempre". Você pode alterar isso nas configurações depois.',
            [
              {
                text: 'Continuar Mesmo Assim',
                onPress: () => navigateNext(),
              },
              {
                text: 'Abrir Configurações',
                onPress: () => {
                  // Open settings
                  // Linking.openSettings();
                },
              },
            ]
          );
          setLoading(false);
          return;
        }
      }

      navigateNext();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao solicitar permissão de localização');
    } finally {
      setLoading(false);
    }
  };

  const navigateNext = () => {
    if (userType === 'driver') {
      navigation.navigate('DriverNotificationPermission');
    } else {
      navigation.navigate('PassengerNotificationPermission');
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Tem Certeza?',
      'Sem a localização, você não poderá usar o aplicativo corretamente.',
      [
        { text: 'Voltar', style: 'cancel' },
        { text: 'Pular', onPress: navigateNext },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📍</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {userType === 'driver'
            ? 'Precisamos da Sua Localização'
            : 'Ative Sua Localização'}
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          {userType === 'driver'
            ? 'Para receber corridas próximas a você e guiá-lo até os passageiros, precisamos da sua localização.'
            : 'Para encontrar motoristas próximos e calcular o preço da corrida, precisamos da sua localização.'}
        </Text>

        {/* Features List */}
        <View style={styles.featuresList}>
          <FeatureItem
            icon="✓"
            text="Encontrar corridas próximas"
            colors={colors}
          />
          <FeatureItem
            icon="✓"
            text="Navegação em tempo real"
            colors={colors}
          />
          <FeatureItem
            icon="✓"
            text="Calcular distância e preço"
            colors={colors}
          />
          {userType === 'driver' && (
            <FeatureItem
              icon="✓"
              text="Receber corridas mesmo com app fechado"
              colors={colors}
            />
          )}
        </View>

        {/* Privacy Note */}
        <View style={[styles.privacyNote, { backgroundColor: colors.background.secondary }]}>
          <Text style={[styles.privacyIcon, { color: colors.primary }]}>🔒</Text>
          <Text style={[styles.privacyText, { color: colors.text.secondary }]}>
            Sua localização é privada e só é compartilhada durante corridas ativas.
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleAllowLocation}
          loading={loading}
          disabled={loading}
        >
          Permitir Localização
        </Button>

        <Button
          variant="ghost"
          onPress={handleSkip}
          disabled={loading}
          style={styles.skipButton}
        >
          Pular por Enquanto
        </Button>
      </View>
    </View>
  );
};

interface FeatureItemProps {
  icon: string;
  text: string;
  colors: any;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text, colors }) => (
  <View style={styles.featureItem}>
    <Text style={[styles.featureIcon, { color: colors.success }]}>{icon}</Text>
    <Text style={[styles.featureText, { color: colors.text.secondary }]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['3xl'],
    alignItems: 'center',
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
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  featuresList: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureIcon: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  featureText: {
    flex: 1,
    fontSize: typography.fontSize.md,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  privacyIcon: {
    fontSize: typography.fontSize.xl,
  },
  privacyText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
    gap: spacing.sm,
  },
  skipButton: {
    marginTop: spacing.sm,
  },
});
