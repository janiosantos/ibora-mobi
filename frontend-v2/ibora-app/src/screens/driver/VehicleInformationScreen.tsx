import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Chip } from '../../components';
import { spacing, typography, radius, layout } from '../../theme/tokens';
import { useTheme } from '../../theme';
import type { VehiclePreference } from '../../types';

const vehicleTypes = [
  { id: 'bike', label: 'Bike', icon: '🏍️' },
  { id: 'auto', label: 'Auto', icon: '🛺' },
  { id: 'taxi', label: 'Taxi', icon: '🚕' },
  { id: 'hover-board', label: 'Hover Board', icon: '🛹' },
  { id: 'prime-sedan', label: 'Prime Sedan', icon: '🚗' },
  { id: 'prime-suv', label: 'Prime SUV', icon: '🚙' },
];

const preferenceOptions: { id: VehiclePreference; label: string; icon: string }[] = [
  { id: 'large-luggage', label: 'Large Luggage ok', icon: '🧳' },
  { id: 'winter-tires', label: 'No Winter Tires', icon: '❄️' },
  { id: 'skis-snowboards', label: 'Skis / snowboards ok', icon: '⛷️' },
  { id: 'bikes', label: 'Bikes ok', icon: '🚲' },
  { id: 'pets', label: 'No pets', icon: '🐕' },
];

export const VehicleInformationScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { colors } = useTheme();
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);
  const [registration, setRegistration] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [capacity, setCapacity] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState<VehiclePreference[]>([]);
  
  const togglePreference = (pref: VehiclePreference) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref)
        ? prev.filter((p) => p !== pref)
        : [...prev, pref]
    );
  };
  
  const handleSubmit = () => {
    // Show success modal
    navigation.navigate('RegistrationSuccess');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Vehicles Information
        </Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Progress Bar */}
      <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
        <View style={styles.progressFill} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vehicle Type Selector */}
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          Select Vehicle
        </Text>
        <Input
          placeholder="Selecione o tipo de veículo"
          value={selectedVehicle}
          editable={false}
          rightIcon={
            <Ionicons name="chevron-down" size={20} color={colors.text.tertiary} />
          }
        />
        
        {/* Vehicle Image Upload */}
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          Vehicle image
        </Text>
        <TouchableOpacity
          style={[
            styles.imageUpload,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {vehicleImage ? (
            <Image source={{ uri: vehicleImage }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="image" size={48} color={colors.primary} />
              <Ionicons
                name="add-circle"
                size={24}
                color={colors.primary}
                style={styles.uploadIcon}
              />
            </View>
          )}
        </TouchableOpacity>
        
        {/* Vehicle Details */}
        <Input
          label="Vehicle Registration Number"
          placeholder="GJ01LE0007"
          value={registration}
          onChangeText={setRegistration}
        />
        
        <Input
          label="Vehicle Color"
          placeholder="Black"
          value={vehicleColor}
          onChangeText={setVehicleColor}
        />
        
        <Input
          label="Passenger Capacity"
          placeholder="4"
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="number-pad"
        />
        
        {/* Vehicle Preferences */}
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          Vehicle Preference
        </Text>
        <View style={styles.preferencesGrid}>
          {preferenceOptions.map((pref) => (
            <View key={pref.id} style={styles.preferenceItem}>
              <Chip
                label={`${pref.icon} ${pref.label}`}
                selected={selectedPreferences.includes(pref.id)}
                onPress={() => togglePreference(pref.id)}
              />
            </View>
          ))}
        </View>
        
        {/* Submit Button */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          SUBMIT AND NEXT
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  progressBar: {
    height: 4,
    marginHorizontal: spacing.base,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#5B51FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  imageUpload: {
    height: 150,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  preferenceItem: {
    marginBottom: spacing.sm,
  },
  submitButton: {
    marginVertical: spacing.xl,
  },
});
