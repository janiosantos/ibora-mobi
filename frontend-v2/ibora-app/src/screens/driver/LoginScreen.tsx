import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../../components';
import { spacing, typography } from '../../theme/tokens';
import { useTheme } from '../../theme';
import { useAuthStore } from '../../store';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuthStore();
  
  const handleLogin = async () => {
    setError('');
    
    // Validation
    if (!phone || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      // Login using real API
      await login(phone, password);
      
      // Navigate to main app on success
      navigation.replace('MainTabs');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Erro ao fazer login';
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>iBora</Text>
            </View>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Motorista
            </Text>
          </View>
          
          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Bem-vindo de volta
            </Text>
            <Text style={[styles.description, { color: colors.text.secondary }]}>
              Entre com suas credenciais para continuar
            </Text>
            
            <Input
              label="Telefone ou Email"
              placeholder="+55 (33) 98765-4321 ou email@exemplo.com"
              value={phone}
              onChangeText={setPhone}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error && !phone ? 'Campo obrigatório' : undefined}
              leftIcon={
                <Ionicons name="call-outline" size={20} color={colors.text.tertiary} />
              }
            />
            
            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={error && !password ? 'Campo obrigatório' : undefined}
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={colors.text.tertiary} />
              }
            />
            
            {error && (
              <Text style={[styles.errorText, { color: colors.text.primary }]}>
                {error}
              </Text>
            )}
            
            <Button
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
              onPress={handleLogin}
            >
              Entrar
            </Button>
            
            <Button
              variant="ghost"
              size="medium"
              fullWidth
              onPress={() => {}}
            >
              Esqueci minha senha
            </Button>
          </View>
          
          {/* Sign Up */}
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: colors.text.secondary }]}>
              Não tem uma conta?{' '}
            </Text>
            <Button
              variant="ghost"
              size="medium"
              onPress={() => navigation.navigate('VehicleInformation')}
            >
              Cadastre-se
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  logoText: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  formContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.base,
    marginBottom: spacing.lg,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  signupText: {
    fontSize: typography.fontSize.base,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 8,
  },
});
