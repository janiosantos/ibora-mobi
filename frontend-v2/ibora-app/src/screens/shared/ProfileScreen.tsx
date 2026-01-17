/**
 * ProfileScreen - Universal
 * User profile for both Driver and Passenger
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Avatar, Input } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { useAuthStore, useDriverStore } from '../../store';
import { Ionicons } from '@expo/vector-icons';

interface ProfileScreenProps {
  userType: 'driver' | 'passenger';
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ userType }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const { driver } = useDriverStore();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const profileData = userType === 'driver' ? driver : user;

  const handleSave = async () => {
    try {
      // Save profile changes
      // await userApi.updateProfile(formData);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setEditing(false);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar perfil');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  const menuItems = [
    ...(userType === 'driver'
      ? [
          { icon: 'car-outline', label: 'Meu Veículo', route: 'VehicleInformation' },
          { icon: 'wallet-outline', label: 'Carteira', route: 'Wallet' },
          { icon: 'cash-outline', label: 'Ganhos', route: 'Earnings' },
        ]
      : [
          { icon: 'wallet-outline', label: 'Carteira', route: 'Wallet' },
          { icon: 'card-outline', label: 'Pagamentos', route: 'PaymentMethods' },
          { icon: 'location-outline', label: 'Endereços Salvos', route: 'SavedLocations' },
        ]),
    { icon: 'time-outline', label: 'Histórico', route: 'History' },
    { icon: 'help-circle-outline', label: 'Ajuda', route: 'Help' },
    { icon: 'settings-outline', label: 'Configurações', route: 'Settings' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => {
            // Open image picker
          }}
        >
          <Avatar
            uri={profileData?.avatar_url}
            size={100}
            name={profileData?.name}
          />
          <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </TouchableOpacity>

        <Text style={[styles.name, { color: colors.text.primary }]}>
          {profileData?.name}
        </Text>

        {/* Rating & Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={20} color="#FFB800" />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {profileData?.rating?.toFixed(1) || '5.0'}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Ionicons name="car-outline" size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {profileData?.total_trips || 0} {userType === 'driver' ? 'corridas' : 'viagens'}
            </Text>
          </View>

          {userType === 'driver' && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="cash-outline" size={20} color={colors.success} />
                <Text style={[styles.statValue, { color: colors.text.primary }]}>
                  R$ {(profileData?.total_earnings || 0).toFixed(2)}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Profile Info */}
      <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Informações Pessoais
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => (editing ? handleSave() : setEditing(true))}
          >
            {editing ? 'Salvar' : 'Editar'}
          </Button>
        </View>

        {editing ? (
          <>
            <Input
              label="Nome"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
            />
            <Input
              label="Telefone"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={colors.text.tertiary} />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.text.tertiary }]}>
                  Nome
                </Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                  {user?.name}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={colors.text.tertiary} />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.text.tertiary }]}>
                  Email
                </Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                  {user?.email}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={colors.text.tertiary} />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.text.tertiary }]}>
                  Telefone
                </Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                  {user?.phone}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={colors.text.tertiary} />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.text.tertiary }]}>
                  Membro desde
                </Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                  {new Date(user?.created_at || Date.now()).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Menu Items */}
      <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index < menuItems.length - 1 && styles.menuItemBorder,
            ]}
            onPress={() => navigation.navigate(item.route as any)}
          >
            <Ionicons name={item.icon as any} size={24} color={colors.text.secondary} />
            <Text style={[styles.menuItemText, { color: colors.text.primary }]}>
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <Button
        variant="ghost"
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>
          Sair
        </Text>
      </Button>

      {/* Version */}
      <Text style={[styles.version, { color: colors.text.tertiary }]}>
        Versão 1.0.0
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  name: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E5E5',
  },
  section: {
    borderRadius: 12,
    padding: spacing.lg,
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
    fontWeight: typography.fontWeight.semibold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSize.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuItemText: {
    flex: 1,
    fontSize: typography.fontSize.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  logoutText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  version: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
