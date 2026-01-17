/**
 * NotificationPermissionScreen - Universal
 * Requests notification permission for both Driver and Passenger
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';

interface NotificationPermissionScreenProps {
  userType: 'driver' | 'passenger';
}

// Mock notification service - replace with actual implementation
const notificationService = {
  requestPermission: async () => {
    // Simulated for now
    return true;
  },
};

export const NotificationPermissionScreen: React.FC<
  NotificationPermissionScreenProps
> = ({ userType }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleAllowNotifications = async () => {
    setLoading(true);

    try {
      const granted = await notificationService.requestPermission();

      if (!granted) {
        Alert.alert(
          'Permissão Negada',
          'Você pode habilitar notificações depois nas configurações.',
          [{ text: 'OK', onPress: navigateNext }]
        );
        setLoading(false);
        return;
      }

      navigateNext();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao solicitar permissão de notificações');
    } finally {
      setLoading(false);
    }
  };

  const navigateNext = () => {
    if (userType === 'driver') {
      navigation.navigate('DriverHome');
    } else {
      navigation.navigate('PassengerHome');
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Tem Certeza?',
      'Sem notificações, você pode perder informações importantes sobre suas corridas.',
      [
        { text: 'Voltar', style: 'cancel' },
        { text: 'Pular', onPress: navigateNext },
      ]
    );
  };

  const notificationTypes = userType === 'driver'
    ? [
        { icon: '🚗', title: 'Novas Corridas', description: 'Saiba quando uma nova corrida está disponível' },
        { icon: '💰', title: 'Ganhos', description: 'Receba atualizações sobre seus ganhos' },
        { icon: '💬', title: 'Mensagens', description: 'Mensagens de passageiros' },
        { icon: '⚠️', title: 'Avisos', description: 'Informações importantes sobre o app' },
      ]
    : [
        { icon: '✅', title: 'Corrida Aceita', description: 'Saiba quando um motorista aceitar sua corrida' },
        { icon: '🚗', title: 'Motorista Chegando', description: 'Receba avisos quando o motorista estiver próximo' },
        { icon: '💳', title: 'Pagamentos', description: 'Confirmações de pagamento' },
        { icon: '⭐', title: 'Avaliações', description: 'Lembrete para avaliar sua experiência' },
      ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔔</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {userType === 'driver'
            ? 'Não Perca Nenhuma Corrida'
            : 'Fique Por Dentro de Tudo'}
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          {userType === 'driver'
            ? 'Receba notificações instantâneas de novas corridas próximas a você.'
            : 'Receba atualizações em tempo real sobre suas corridas.'}
        </Text>

        {/* Notification Types */}
        <View style={styles.notificationList}>
          {notificationTypes.map((type, index) => (
            <View
              key={index}
              style={[
                styles.notificationItem,
                { backgroundColor: colors.background.secondary },
              ]}
            >
              <Text style={styles.notificationIcon}>{type.icon}</Text>
              <View style={styles.notificationText}>
                <Text style={[styles.notificationTitle, { color: colors.text.primary }]}>
                  {type.title}
                </Text>
                <Text style={[styles.notificationDescription, { color: colors.text.tertiary }]}>
                  {type.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Privacy Note */}
        <Text style={[styles.privacyText, { color: colors.text.tertiary }]}>
          Você pode desativar notificações específicas a qualquer momento nas configurações.
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleAllowNotifications}
          loading={loading}
          disabled={loading}
        >
          Permitir Notificações
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
  notificationList: {
    width: '100%',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.md,
  },
  notificationIcon: {
    fontSize: 32,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  notificationDescription: {
    fontSize: typography.fontSize.sm,
    lineHeight: 18,
  },
  privacyText: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
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
