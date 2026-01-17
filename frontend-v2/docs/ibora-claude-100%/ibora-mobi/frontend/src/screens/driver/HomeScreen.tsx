import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Avatar, MapPlaceholder } from '../../components';
import { colors, spacing, typography, radius } from '../../theme/tokens';
import { useTheme } from '../../theme';
import { mockDriver } from '../../mock/data';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors: themeColors } = useTheme();
  const [isOnline, setIsOnline] = useState(false);
  const [driver] = useState(mockDriver);
  
  const handleToggleOnline = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    
    if (newStatus) {
      // Simulate receiving a ride request after going online
      setTimeout(() => {
        navigation.navigate('IncomingRideRequest');
      }, 3000);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Map */}
      <MapPlaceholder />
      
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={[styles.menuButton, { backgroundColor: themeColors.background }]}>
          <Ionicons name="menu" size={24} color={themeColors.text.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.notificationButton, { backgroundColor: themeColors.background }]}
        >
          <Ionicons name="notifications-outline" size={24} color={themeColors.text.primary} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </SafeAreaView>
      
      {/* Online/Offline Toggle */}
      <View style={styles.bottomContainer}>
        <Card variant="elevated" style={styles.sheet}>
          {/* Driver Info */}
          <View style={styles.driverSection}>
            <Avatar
              size="lg"
              name={driver.full_name}
              badge={isOnline ? 'online' : 'offline'}
            />
            <View style={styles.driverInfo}>
              <Text style={[styles.driverName, { color: themeColors.text.primary }]}>
                {driver.full_name}
              </Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color={colors.warning} />
                <Text style={[styles.ratingText, { color: themeColors.text.secondary }]}>
                  {driver.rating.toFixed(1)} ({driver.total_trips} viagens)
                </Text>
              </View>
            </View>
          </View>
          
          {/* Earnings Summary */}
          <View style={styles.earningsSummary}>
            <View style={styles.earningItem}>
              <Text style={[styles.earningLabel, { color: themeColors.text.secondary }]}>
                Hoje
              </Text>
              <Text style={[styles.earningValue, { color: themeColors.text.primary }]}>
                R$ {driver.wallet.earnings_today.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.earningItem}>
              <Text style={[styles.earningLabel, { color: themeColors.text.secondary }]}>
                Semana
              </Text>
              <Text style={[styles.earningValue, { color: themeColors.text.primary }]}>
                R$ {driver.wallet.earnings_week.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.earningItem}>
              <Text style={[styles.earningLabel, { color: themeColors.text.secondary }]}>
                Disponível
              </Text>
              <Text style={[styles.earningValue, { color: colors.success }]}>
                R$ {driver.wallet.available_balance.toFixed(2)}
              </Text>
            </View>
          </View>
          
          {/* Online/Offline Toggle */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: themeColors.text.primary }]}>
                {isOnline ? 'Você está online' : 'Você está offline'}
              </Text>
              <Text style={[styles.toggleDescription, { color: themeColors.text.secondary }]}>
                {isOnline
                  ? 'Aguardando solicitações de corrida...'
                  : 'Ative para começar a receber corridas'}
              </Text>
            </View>
            
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{
                false: themeColors.border,
                true: colors.success,
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={themeColors.border}
            />
          </View>
          
          {/* Status Indicator */}
          {isOnline && (
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: colors.transparent.success },
              ]}
            >
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.statusText, { color: colors.success }]}>
                Procurando corridas próximas...
              </Text>
            </View>
          )}
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.base,
  },
  sheet: {
    padding: spacing.base,
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
  },
  earningsSummary: {
    flexDirection: 'row',
    marginBottom: spacing.base,
  },
  earningItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningLabel: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs,
  },
  earningValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  divider: {
    width: 1,
    backgroundColor: colors.light.border,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  toggleDescription: {
    fontSize: typography.fontSize.sm,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
