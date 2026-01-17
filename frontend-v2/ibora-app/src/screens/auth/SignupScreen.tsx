/**
 * SignupScreen - Universal
 * Works for both Driver and Passenger
 * Pass userType prop to determine behavior
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Input } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { authApi } from '../../api';
import { useAuthStore } from '../../store';

interface SignupScreenProps {
  userType: 'driver' | 'passenger';
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ userType }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { setToken } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    referralCode: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Phone validation
    const phoneRegex = /^\(?[1-9]{2}\)?\s?9?[0-9]{4}-?[0-9]{4}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Telefone inválido';
    }

    // CPF validation
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não conferem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCPF = (cpf: string): boolean => {
    // Remove non-digits
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) return false;

    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validate check digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Call signup API
      const response = await authApi.signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        cpf: formData.cpf,
        role: userType,
        referral_code: formData.referralCode || undefined,
      });

      // Save token
      await setToken(response.access_token);

      // Navigate based on user type
      if (userType === 'driver') {
        navigation.navigate('DriverOnboarding');
      } else {
        navigation.navigate('PassengerOnboarding');
      }
    } catch (error: any) {
      Alert.alert(
        'Erro no Cadastro',
        error.response?.data?.detail || 'Falha ao criar conta. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length >= 11) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    } else if (cleaned.length >= 7) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length >= 2) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }

    return formatted;
  };

  const formatCPF = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length >= 11) {
      formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
    } else if (cleaned.length >= 9) {
      formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}`;
    } else if (cleaned.length >= 6) {
      formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    } else if (cleaned.length >= 3) {
      formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    }

    return formatted;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background.primary }]}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {userType === 'driver' ? 'Cadastro de Motorista' : 'Criar Conta'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            {userType === 'driver'
              ? 'Comece a ganhar dinheiro dirigindo'
              : 'Peça suas corridas de forma rápida e fácil'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Nome Completo"
            placeholder="Digite seu nome"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            error={errors.name}
            autoCapitalize="words"
            autoComplete="name"
          />

          <Input
            label="Email"
            placeholder="seu@email.com"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={formData.phone}
            onChangeText={(text) =>
              setFormData({ ...formData, phone: formatPhone(text) })
            }
            error={errors.phone}
            keyboardType="phone-pad"
            maxLength={15}
          />

          <Input
            label="CPF"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChangeText={(text) =>
              setFormData({ ...formData, cpf: formatCPF(text) })
            }
            error={errors.cpf}
            keyboardType="number-pad"
            maxLength={14}
          />

          <Input
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            error={errors.password}
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label="Confirmar Senha"
            placeholder="Digite a senha novamente"
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmPassword: text })
            }
            error={errors.confirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label="Código de Indicação (opcional)"
            placeholder="Digite o código se tiver"
            value={formData.referralCode}
            onChangeText={(text) =>
              setFormData({ ...formData, referralCode: text.toUpperCase() })
            }
            autoCapitalize="characters"
          />
        </View>

        {/* Terms */}
        <Text style={[styles.terms, { color: colors.text.tertiary }]}>
          Ao criar uma conta, você concorda com nossos{' '}
          <Text style={{ color: colors.primary }}>Termos de Uso</Text> e{' '}
          <Text style={{ color: colors.primary }}>Política de Privacidade</Text>
        </Text>

        {/* Signup Button */}
        <Button
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
          style={styles.signupButton}
        >
          Criar Conta
        </Button>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: colors.text.secondary }]}>
            Já tem uma conta?{' '}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            Fazer Login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    lineHeight: 22,
  },
  form: {
    gap: spacing.md,
  },
  terms: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  signupButton: {
    marginTop: spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    fontSize: typography.fontSize.md,
  },
});
