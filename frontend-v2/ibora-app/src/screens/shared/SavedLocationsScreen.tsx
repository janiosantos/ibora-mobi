/**
 * SavedLocationsScreen
 * Manage saved addresses (Home, Work, Favorites)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

interface SavedLocation {
  id: string;
  type: 'home' | 'work' | 'favorite';
  label: string;
  address: string;
  lat: number;
  lng: number;
  is_default?: boolean;
}

export const SavedLocationsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<SavedLocation | null>(null);

  // Form state
  const [formType, setFormType] = useState<'home' | 'work' | 'favorite'>('favorite');
  const [formLabel, setFormLabel] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formLat, setFormLat] = useState(0);
  const [formLng, setFormLng] = useState(0);

  useEffect(() => {
    loadSavedLocations();
  }, []);

  const loadSavedLocations = async () => {
    try {
      setLoading(true);
      // Load from API
      // const response = await locationApi.getSavedLocations();
      // setLocations(response.locations);

      // Mock data
      setLocations([
        {
          id: '1',
          type: 'home',
          label: 'Casa',
          address: 'Rua das Flores, 123 - Centro',
          lat: -23.550520,
          lng: -46.633308,
          is_default: true,
        },
        {
          id: '2',
          type: 'work',
          label: 'Trabalho',
          address: 'Av. Paulista, 1000 - Bela Vista',
          lat: -23.561684,
          lng: -46.655981,
        },
        {
          id: '3',
          type: 'favorite',
          label: 'Academia',
          address: 'Rua Augusta, 500',
          lat: -23.555765,
          lng: -46.662627,
        },
      ]);
    } catch (error) {
      console.error('Failed to load locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setFormType('favorite');
    setFormLabel('');
    setFormAddress('');
    setFormLat(0);
    setFormLng(0);
    setShowAddModal(true);
  };

  const handleEditLocation = (location: SavedLocation) => {
    setEditingLocation(location);
    setFormType(location.type);
    setFormLabel(location.label);
    setFormAddress(location.address);
    setFormLat(location.lat);
    setFormLng(location.lng);
    setShowAddModal(true);
  };

  const handleDeleteLocation = (locationId: string) => {
    Alert.alert(
      'Remover Endereço',
      'Tem certeza que deseja remover este endereço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              // await locationApi.deleteLocation(locationId);
              setLocations(locations.filter((l) => l.id !== locationId));
            } catch (error) {
              Alert.alert('Erro', 'Falha ao remover endereço');
            }
          },
        },
      ]
    );
  };

  const handleSaveLocation = async () => {
    if (!formAddress.trim()) {
      Alert.alert('Erro', 'Digite um endereço');
      return;
    }

    if (formType !== 'favorite' && !formLabel.trim()) {
      Alert.alert('Erro', 'Digite um nome para o local');
      return;
    }

    try {
      const newLocation: SavedLocation = {
        id: editingLocation?.id || Date.now().toString(),
        type: formType,
        label: formLabel || (formType === 'home' ? 'Casa' : 'Trabalho'),
        address: formAddress,
        lat: formLat,
        lng: formLng,
      };

      if (editingLocation) {
        // Update
        setLocations(
          locations.map((l) => (l.id === editingLocation.id ? newLocation : l))
        );
      } else {
        // Add
        setLocations([...locations, newLocation]);
      }

      setShowAddModal(false);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar endereço');
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address[0]) {
        const formatted = `${address[0].street}, ${address[0].streetNumber} - ${address[0].district}`;
        setFormAddress(formatted);
        setFormLat(location.coords.latitude);
        setFormLng(location.coords.longitude);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao obter localização atual');
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'home':
        return 'home';
      case 'work':
        return 'briefcase';
      default:
        return 'location';
    }
  };

  const renderLocation = ({ item }: { item: SavedLocation }) => (
    <View style={[styles.locationCard, { backgroundColor: colors.background.secondary }]}>
      <View style={[styles.locationIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={getLocationIcon(item.type) as any} size={24} color={colors.primary} />
      </View>

      <View style={styles.locationInfo}>
        <Text style={[styles.locationLabel, { color: colors.text.primary }]}>
          {item.label}
        </Text>
        <Text style={[styles.locationAddress, { color: colors.text.secondary }]} numberOfLines={2}>
          {item.address}
        </Text>
        {item.is_default && (
          <View style={[styles.defaultBadge, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.defaultText, { color: colors.success }]}>Padrão</Text>
          </View>
        )}
      </View>

      <View style={styles.locationActions}>
        <TouchableOpacity onPress={() => handleEditLocation(item)} style={styles.actionButton}>
          <Ionicons name="pencil-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteLocation(item.id)}
          style={styles.actionButton}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="location-outline" size={64} color={colors.text.tertiary} />
      <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
        Nenhum endereço salvo
      </Text>
      <Text style={[styles.emptyHint, { color: colors.text.tertiary }]}>
        Adicione seus endereços favoritos para acesso rápido
      </Text>
    </View>
  );

  if (showAddModal) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAddModal(false)}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
            {editingLocation ? 'Editar Endereço' : 'Adicionar Endereço'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.form}>
          {/* Type Selection */}
          <Text style={[styles.label, { color: colors.text.primary }]}>Tipo</Text>
          <View style={styles.typeButtons}>
            {[
              { value: 'home', label: 'Casa', icon: 'home' },
              { value: 'work', label: 'Trabalho', icon: 'briefcase' },
              { value: 'favorite', label: 'Favorito', icon: 'star' },
            ].map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor:
                      formType === type.value ? colors.primary : colors.background.secondary,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setFormType(type.value as any)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={20}
                  color={formType === type.value ? 'white' : colors.text.secondary}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    {
                      color: formType === type.value ? 'white' : colors.text.secondary,
                    },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Label (optional for favorites) */}
          {formType === 'favorite' && (
            <>
              <Text style={[styles.label, { color: colors.text.primary }]}>Nome (opcional)</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background.secondary,
                    color: colors.text.primary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Ex: Academia, Padaria..."
                placeholderTextColor={colors.text.tertiary}
                value={formLabel}
                onChangeText={setFormLabel}
              />
            </>
          )}

          {/* Address */}
          <Text style={[styles.label, { color: colors.text.primary }]}>Endereço</Text>
          <View style={styles.addressRow}>
            <TextInput
              style={[
                styles.input,
                styles.addressInput,
                {
                  backgroundColor: colors.background.secondary,
                  color: colors.text.primary,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Digite o endereço completo"
              placeholderTextColor={colors.text.tertiary}
              value={formAddress}
              onChangeText={setFormAddress}
              multiline
            />
            <TouchableOpacity
              style={[styles.currentLocationButton, { backgroundColor: colors.primary }]}
              onPress={handleUseCurrentLocation}
            >
              <Ionicons name="navigate" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <Button onPress={handleSaveLocation} style={styles.saveButton}>
            {editingLocation ? 'Salvar Alterações' : 'Adicionar Endereço'}
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Quick Access */}
      <View style={[styles.quickAccess, { backgroundColor: colors.background.secondary }]}>
        <Text style={[styles.quickAccessTitle, { color: colors.text.primary }]}>
          Acesso Rápido
        </Text>

        <View style={styles.quickButtons}>
          <TouchableOpacity
            style={[styles.quickButton, { backgroundColor: colors.primary + '20' }]}
            onPress={() => {
              const home = locations.find((l) => l.type === 'home');
              if (home) {
                navigation.navigate('SetDestination', { location: home });
              } else {
                Alert.alert('Casa', 'Adicione o endereço da sua casa primeiro');
              }
            }}
          >
            <Ionicons name="home" size={24} color={colors.primary} />
            <Text style={[styles.quickButtonText, { color: colors.primary }]}>Casa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickButton, { backgroundColor: colors.primary + '20' }]}
            onPress={() => {
              const work = locations.find((l) => l.type === 'work');
              if (work) {
                navigation.navigate('SetDestination', { location: work });
              } else {
                Alert.alert('Trabalho', 'Adicione o endereço do seu trabalho primeiro');
              }
            }}
          >
            <Ionicons name="briefcase" size={24} color={colors.primary} />
            <Text style={[styles.quickButtonText, { color: colors.primary }]}>Trabalho</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Locations List */}
      <FlatList
        data={locations}
        renderItem={renderLocation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
      />

      {/* Add Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAddLocation}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  quickAccess: {
    padding: spacing.md,
    margin: spacing.md,
    borderRadius: 12,
  },
  quickAccessTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickButton: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    gap: spacing.xs,
  },
  quickButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  list: {
    padding: spacing.md,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  locationAddress: {
    fontSize: typography.fontSize.sm,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginTop: spacing.xs,
  },
  defaultText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  locationActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
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
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  form: {
    padding: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
  },
  typeButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.md,
  },
  addressRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  addressInput: {
    flex: 1,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  currentLocationButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {},
});
