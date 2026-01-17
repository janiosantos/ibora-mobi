import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components';
import { colors, spacing, typography, radius } from '../../theme/tokens';
import { useTheme } from '../../theme';
import { mockEarnings } from '../../mock/data';
import type { Earnings } from '../../types';

type Period = 'today' | 'week' | 'month';

export const EarningsScreen: React.FC = () => {
  const { colors: themeColors } = useTheme();
  const [period, setPeriod] = useState<Period>('today');
  const [earnings] = useState<Earnings>(mockEarnings);
  
  const periodLabels: Record<Period, string> = {
    today: 'All',
    week: 'Semana',
    month: 'Mês',
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text.primary }]}>
          My Earning
        </Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Today's Summary */}
        <View style={styles.summaryCards}>
          <Card variant="elevated" style={styles.summaryCard}>
            <Text style={[styles.summaryLabel, { color: themeColors.text.secondary }]}>
              Today's{'\n'}Earning
            </Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              ${earnings.total_earnings.toFixed(0)}
            </Text>
          </Card>
          
          <Card variant="elevated" style={styles.summaryCard}>
            <Text style={[styles.summaryLabel, { color: themeColors.text.secondary }]}>
              Today's{'\n'}Tips
            </Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              ${earnings.tips.toFixed(0)}
            </Text>
          </Card>
          
          <Card variant="elevated" style={styles.summaryCard}>
            <Text style={[styles.summaryLabel, { color: themeColors.text.secondary }]}>
              Today's{'\n'}Login Hrs
            </Text>
            <Text style={[styles.summaryValue, { color: themeColors.text.primary }]}>
              {earnings.total_hours.toFixed(0)} Hrs
            </Text>
          </Card>
        </View>
        
        {/* Earning & Rides Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>
              Earning & Rides
            </Text>
            
            <TouchableOpacity style={styles.periodSelector}>
              <Text style={[styles.periodText, { color: themeColors.text.primary }]}>
                {periodLabels[period]}
              </Text>
              <Ionicons name="chevron-down" size={20} color={themeColors.text.primary} />
            </TouchableOpacity>
          </View>
          
          {/* Total Earnings */}
          <View style={styles.totalEarnings}>
            <Text style={[styles.totalValue, { color: themeColors.text.primary }]}>
              ${earnings.total_earnings.toFixed(2)}
            </Text>
          </View>
          
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <Card variant="elevated" style={styles.statCard}>
              <Text style={[styles.statLabel, { color: themeColors.text.secondary }]}>
                Total Trips
              </Text>
              <Text style={[styles.statValue, { color: themeColors.text.primary }]}>
                {earnings.total_rides}
              </Text>
            </Card>
            
            <Card variant="elevated" style={styles.statCard}>
              <Text style={[styles.statLabel, { color: themeColors.text.secondary }]}>
                Total Driving Hrs
              </Text>
              <Text style={[styles.statValue, { color: themeColors.text.primary }]}>
                {earnings.total_hours.toFixed(2)} Hrs
              </Text>
            </Card>
          </View>
        </View>
        
        {/* Recommended Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>
              Recommended Bookings
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          {earnings.recent_rides.map((ride) => (
            <Card key={ride.id} variant="elevated" style={styles.rideCard}>
              <View style={styles.rideHeader}>
                <View style={styles.rideIcon}>
                  <Ionicons name="bicycle" size={24} color={colors.primary} />
                </View>
                <View style={styles.rideInfo}>
                  <View style={styles.rideTopRow}>
                    <Text style={[styles.rideTitle, { color: themeColors.text.primary }]}>
                      Trip #{ride.id.slice(-3)}
                    </Text>
                    <View style={[styles.dateBadge, { backgroundColor: colors.success }]}>
                      <Text style={styles.dateText}>
                        {new Date(ride.completed_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.rideDetail, { color: themeColors.text.secondary }]}>
                    Estimate Usage: {ride.actual_duration_min.toFixed(2)} Hrs  Total Dist: {ride.actual_distance_km.toFixed(1)} Km
                  </Text>
                  
                  <View style={styles.locationContainer}>
                    <Ionicons name="ellipse" size={12} color={colors.success} />
                    <Text
                      style={[styles.locationText, { color: themeColors.text.secondary }]}
                      numberOfLines={1}
                    >
                      {ride.origin_address}
                    </Text>
                  </View>
                  
                  <View style={styles.locationContainer}>
                    <Ionicons name="ellipse" size={12} color={colors.danger} />
                    <Text
                      style={[styles.locationText, { color: themeColors.text.secondary }]}
                      numberOfLines={1}
                    >
                      {ride.destination_address}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={[styles.priceFooter, { backgroundColor: colors.transparent.primary }]}>
                <Ionicons name="wallet" size={20} color={colors.primary} />
                <Text style={[styles.priceText, { color: colors.primary }]}>
                  ${ride.final_price.toFixed(2)}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  section: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  periodText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  totalEarnings: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  totalValue: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.base,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  viewAllText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  rideCard: {
    marginBottom: spacing.md,
    padding: spacing.base,
  },
  rideHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  rideIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.transparent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideInfo: {
    flex: 1,
  },
  rideTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rideTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  dateBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    color: '#FFFFFF',
  },
  rideDetail: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  locationText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
  },
  priceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  priceText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
});
