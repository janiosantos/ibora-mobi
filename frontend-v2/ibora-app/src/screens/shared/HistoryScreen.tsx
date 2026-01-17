/**
 * HistoryScreen - Universal
 * Complete trip history with filters and export
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Avatar } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { rideApi } from '../../api';
import { Ionicons } from '@expo/vector-icons';
import type { Ride } from '../../types';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface HistoryScreenProps {
  userType: 'driver' | 'passenger';
  userId: string;
}

type FilterPeriod = 'all' | 'today' | 'week' | 'month' | 'custom';
type FilterStatus = 'all' | 'completed' | 'cancelled';

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  userType,
  userId,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('month');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalRides: 0,
    totalEarnings: 0,
    totalSpent: 0,
    averageRating: 0,
    totalDistance: 0,
  });

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterPeriod, filterStatus, rides]);

  const loadHistory = async () => {
    try {
      setLoading(true);

      const response = await rideApi.getHistory(userId, userType);
      setRides(response.rides);
      
      // Calculate stats
      calculateStats(response.rides);
    } catch (error) {
      console.error('Failed to load history:', error);
      Alert.alert('Erro', 'Falha ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const calculateStats = (allRides: Ride[]) => {
    const completed = allRides.filter(r => r.status === 'COMPLETED');
    
    const totalEarnings = completed.reduce((sum, r) => 
      sum + (r.driver_earnings || 0), 0
    );
    
    const totalSpent = completed.reduce((sum, r) => 
      sum + (r.final_price || 0), 0
    );
    
    const totalRating = completed.reduce((sum, r) => 
      sum + (userType === 'driver' ? r.driver_rating || 0 : r.passenger_rating || 0), 0
    );
    
    const totalDistance = completed.reduce((sum, r) => 
      sum + (r.actual_distance_km || 0), 0
    );

    setStats({
      totalRides: completed.length,
      totalEarnings,
      totalSpent,
      averageRating: completed.length > 0 ? totalRating / completed.length : 0,
      totalDistance,
    });
  };

  const applyFilters = () => {
    let filtered = [...rides];

    // Filter by period
    const now = new Date();
    if (filterPeriod === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(r => new Date(r.created_at) >= today);
    } else if (filterPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(r => new Date(r.created_at) >= weekAgo);
    } else if (filterPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(r => new Date(r.created_at) >= monthAgo);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status.toLowerCase() === filterStatus);
    }

    setFilteredRides(filtered);
  };

  const exportToCSV = async () => {
    try {
      // Generate CSV content
      const headers = [
        'Data',
        'Origem',
        'Destino',
        'Distância (km)',
        'Duração (min)',
        'Preço (R$)',
        userType === 'driver' ? 'Ganhos (R$)' : 'Forma de Pagamento',
        'Status',
      ];

      const rows = filteredRides.map(ride => [
        new Date(ride.created_at).toLocaleDateString('pt-BR'),
        ride.pickup_location.address,
        ride.dropoff_location.address,
        ride.actual_distance_km?.toFixed(2) || '-',
        ride.actual_duration_min || '-',
        ride.final_price?.toFixed(2) || '-',
        userType === 'driver' 
          ? ride.driver_earnings?.toFixed(2) || '-'
          : ride.payment_method || '-',
        ride.status,
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      // Save to file
      const filename = `ibora-history-${Date.now()}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Sucesso', `Arquivo salvo em: ${fileUri}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Erro', 'Falha ao exportar histórico');
    }
  };

  const renderRide = ({ item }: { item: Ride }) => {
    const otherUser = userType === 'driver' ? item.passenger : item.driver;

    return (
      <TouchableOpacity
        style={[styles.rideCard, { backgroundColor: colors.background.secondary }]}
        onPress={() => navigation.navigate('TripDetails', { ride: item })}
      >
        <View style={styles.rideHeader}>
          <Avatar
            uri={otherUser?.avatar_url}
            size={48}
            name={otherUser?.name}
          />

          <View style={styles.rideInfo}>
            <Text style={[styles.rideName, { color: colors.text.primary }]}>
              {otherUser?.name}
            </Text>
            <Text style={[styles.rideDate, { color: colors.text.tertiary }]}>
              {new Date(item.created_at).toLocaleDateString('pt-BR')} •{' '}
              {new Date(item.created_at).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          <View style={styles.ridePrice}>
            <Text style={[styles.priceValue, { color: colors.success }]}>
              R$ {
                userType === 'driver'
                  ? item.driver_earnings?.toFixed(2)
                  : item.final_price?.toFixed(2)
              }
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === 'COMPLETED'
                      ? colors.success + '20'
                      : colors.error + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: item.status === 'COMPLETED' ? colors.success : colors.error,
                  },
                ]}
              >
                {item.status === 'COMPLETED' ? 'Concluída' : 'Cancelada'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rideLocations}>
          <View style={styles.locationRow}>
            <View style={[styles.locationDot, { backgroundColor: colors.success }]} />
            <Text
              style={[styles.locationText, { color: colors.text.secondary }]}
              numberOfLines={1}
            >
              {item.pickup_location.address}
            </Text>
          </View>

          <View style={styles.locationRow}>
            <View style={[styles.locationDot, { backgroundColor: colors.error }]} />
            <Text
              style={[styles.locationText, { color: colors.text.secondary }]}
              numberOfLines={1}
            >
              {item.dropoff_location.address}
            </Text>
          </View>
        </View>

        <View style={styles.rideStats}>
          <View style={styles.statItem}>
            <Ionicons name="navigate-outline" size={16} color={colors.text.tertiary} />
            <Text style={[styles.statText, { color: colors.text.tertiary }]}>
              {item.actual_distance_km?.toFixed(1)} km
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color={colors.text.tertiary} />
            <Text style={[styles.statText, { color: colors.text.tertiary }]}>
              {item.actual_duration_min} min
            </Text>
          </View>

          {item.payment_method && (
            <View style={styles.statItem}>
              <Ionicons name="card-outline" size={16} color={colors.text.tertiary} />
              <Text style={[styles.statText, { color: colors.text.tertiary }]}>
                {item.payment_method.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="time-outline" size={64} color={colors.text.tertiary} />
      <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
        Nenhuma corrida encontrada
      </Text>
      <Text style={[styles.emptyHint, { color: colors.text.tertiary }]}>
        Suas corridas aparecerão aqui
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Stats Card */}
      <View style={[styles.statsCard, { backgroundColor: colors.background.secondary }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.text.primary }]}>
            {stats.totalRides}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
            Corridas
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.success }]}>
            R$ {(userType === 'driver' ? stats.totalEarnings : stats.totalSpent).toFixed(2)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
            {userType === 'driver' ? 'Ganhos' : 'Gastos'}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.text.primary }]}>
            {stats.averageRating.toFixed(1)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
            Avaliação
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.text.primary }]}>
            {stats.totalDistance.toFixed(0)} km
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
            Distância
          </Text>
        </View>
      </View>

      {/* Filter & Export Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.background.secondary }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color={colors.text.primary} />
          <Text style={[styles.filterButtonText, { color: colors.text.primary }]}>
            Filtros
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: colors.primary }]}
          onPress={exportToCSV}
        >
          <Ionicons name="download-outline" size={20} color="white" />
          <Text style={styles.exportButtonText}>Exportar</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={[styles.filtersCard, { backgroundColor: colors.background.secondary }]}>
          <Text style={[styles.filterTitle, { color: colors.text.primary }]}>
            Período
          </Text>
          <View style={styles.filterOptions}>
            {['today', 'week', 'month', 'all'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      filterPeriod === period
                        ? colors.primary
                        : colors.background.primary,
                  },
                ]}
                onPress={() => setFilterPeriod(period as FilterPeriod)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color:
                        filterPeriod === period ? 'white' : colors.text.secondary,
                    },
                  ]}
                >
                  {period === 'today' && 'Hoje'}
                  {period === 'week' && 'Semana'}
                  {period === 'month' && 'Mês'}
                  {period === 'all' && 'Tudo'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.filterTitle, { color: colors.text.primary }]}>
            Status
          </Text>
          <View style={styles.filterOptions}>
            {['all', 'completed', 'cancelled'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      filterStatus === status
                        ? colors.primary
                        : colors.background.primary,
                  },
                ]}
                onPress={() => setFilterStatus(status as FilterStatus)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color:
                        filterStatus === status ? 'white' : colors.text.secondary,
                    },
                  ]}
                >
                  {status === 'all' && 'Todas'}
                  {status === 'completed' && 'Concluídas'}
                  {status === 'cancelled' && 'Canceladas'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filteredRides}
        renderItem={renderRide}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsCard: {
    flexDirection: 'row',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
  },
  filterButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
  },
  exportButtonText: {
    color: 'white',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  filtersCard: {
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 12,
  },
  filterTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  list: {
    padding: spacing.md,
  },
  rideCard: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  rideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  rideInfo: {
    flex: 1,
  },
  rideName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  rideDate: {
    fontSize: typography.fontSize.xs,
  },
  ridePrice: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  rideLocations: {
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  locationText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
  },
  rideStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: typography.fontSize.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyHint: {
    fontSize: typography.fontSize.sm,
  },
});
