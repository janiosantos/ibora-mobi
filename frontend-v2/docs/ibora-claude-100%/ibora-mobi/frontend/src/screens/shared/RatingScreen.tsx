/**
 * RatingScreen - Universal
 * Rate driver or passenger after trip
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Avatar } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import type { Ride } from '../../types';

interface RatingScreenProps {
  ride: Ride;
  ratingType: 'driver' | 'passenger';
}

const DRIVER_TAGS = [
  { id: 'professional', label: 'Profissional', icon: '👔' },
  { id: 'friendly', label: 'Simpático', icon: '😊' },
  { id: 'safe_driving', label: 'Dirigiu Bem', icon: '🚗' },
  { id: 'clean', label: 'Carro Limpo', icon: '✨' },
  { id: 'on_time', label: 'Pontual', icon: '⏰' },
  { id: 'good_music', label: 'Boa Música', icon: '🎵' },
];

const PASSENGER_TAGS = [
  { id: 'polite', label: 'Educado', icon: '🙏' },
  { id: 'on_time', label: 'Pontual', icon: '⏰' },
  { id: 'respectful', label: 'Respeitoso', icon: '👍' },
  { id: 'clean', label: 'Deixou Limpo', icon: '✨' },
  { id: 'good_conversation', label: 'Boa Conversa', icon: '💬' },
  { id: 'quiet', label: 'Silencioso', icon: '🤫' },
];

export const RatingScreen: React.FC<RatingScreenProps> = ({ ride, ratingType }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const ratedUser = ratingType === 'driver' ? ride.driver : ride.passenger;
  const tags = ratingType === 'driver' ? DRIVER_TAGS : PASSENGER_TAGS;

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Avaliação Obrigatória', 'Por favor, dê uma nota de 1 a 5 estrelas');
      return;
    }

    setLoading(true);

    try {
      // Submit rating to API
      // await ratingApi.submitRating({
      //   ride_id: ride.id,
      //   rating,
      //   tags: selectedTags,
      //   comment,
      // });

      // Show success message
      Alert.alert(
        'Obrigado!',
        'Sua avaliação ajuda a melhorar nosso serviço',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao enviar avaliação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Pular Avaliação?',
      'Sua avaliação é importante para nós',
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Pular',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.content}
    >
      {/* User Info */}
      <View style={styles.userSection}>
        <Avatar
          uri={ratedUser?.avatar_url}
          size={80}
          name={ratedUser?.name}
        />

        <Text style={[styles.title, { color: colors.text.primary }]}>
          Como Foi a Viagem com
        </Text>
        <Text style={[styles.userName, { color: colors.text.primary }]}>
          {ratedUser?.name}?
        </Text>
      </View>

      {/* Star Rating */}
      <View style={[styles.ratingCard, { backgroundColor: colors.background.secondary }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Dê Sua Nota
        </Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Ionicons
                name={rating >= star ? 'star' : 'star-outline'}
                size={48}
                color={rating >= star ? '#FFB800' : colors.border}
              />
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 && (
          <Text style={[styles.ratingText, { color: colors.text.secondary }]}>
            {rating === 5 && 'Excelente!'}
            {rating === 4 && 'Muito Bom!'}
            {rating === 3 && 'Bom'}
            {rating === 2 && 'Regular'}
            {rating === 1 && 'Ruim'}
          </Text>
        )}
      </View>

      {/* Tags (show only if rating >= 4) */}
      {rating >= 4 && (
        <View style={[styles.tagsCard, { backgroundColor: colors.background.secondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            O Que Você Mais Gostou?
          </Text>

          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tag,
                  {
                    backgroundColor: selectedTags.includes(tag.id)
                      ? colors.primary + '20'
                      : colors.background.primary,
                    borderColor: selectedTags.includes(tag.id)
                      ? colors.primary
                      : colors.border,
                  },
                ]}
                onPress={() => toggleTag(tag.id)}
              >
                <Text style={styles.tagIcon}>{tag.icon}</Text>
                <Text
                  style={[
                    styles.tagLabel,
                    {
                      color: selectedTags.includes(tag.id)
                        ? colors.primary
                        : colors.text.secondary,
                    },
                  ]}
                >
                  {tag.label}
                </Text>
                {selectedTags.includes(tag.id) && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Comment */}
      <View style={[styles.commentCard, { backgroundColor: colors.background.secondary }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Comentário (Opcional)
        </Text>

        <TextInput
          style={[
            styles.commentInput,
            {
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
              borderColor: colors.border,
            },
          ]}
          placeholder="Conte-nos mais sobre sua experiência..."
          placeholderTextColor={colors.text.tertiary}
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          maxLength={500}
        />

        <Text style={[styles.charCount, { color: colors.text.tertiary }]}>
          {comment.length}/500
        </Text>
      </View>

      {/* Tips Section (for highly rated drivers) */}
      {ratingType === 'driver' && rating >= 4 && (
        <View style={[styles.tipsCard, { backgroundColor: colors.primary + '10' }]}>
          <Ionicons name="cash-outline" size={32} color={colors.primary} />
          <View style={styles.tipsText}>
            <Text style={[styles.tipsTitle, { color: colors.text.primary }]}>
              Quer dar uma gorjeta?
            </Text>
            <Text style={[styles.tipsSubtitle, { color: colors.text.secondary }]}>
              100% vai para o motorista
            </Text>
          </View>
          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              // Open tips modal
            }}
          >
            Dar Gorjeta
          </Button>
        </View>
      )}

      {/* Submit Button */}
      <Button
        onPress={handleSubmit}
        loading={loading}
        disabled={rating === 0 || loading}
        style={styles.submitButton}
      >
        Enviar Avaliação
      </Button>

      {/* Skip Button */}
      <Button
        variant="ghost"
        onPress={handleSkip}
        disabled={loading}
        style={styles.skipButton}
      >
        Pular
      </Button>
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
  userSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  ratingCard: {
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  starButton: {
    padding: spacing.xs,
  },
  ratingText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing.md,
  },
  tagsCard: {
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.xs,
  },
  tagIcon: {
    fontSize: 20,
  },
  tagLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  commentCard: {
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  charCount: {
    fontSize: typography.fontSize.xs,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  tipsText: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  tipsSubtitle: {
    fontSize: typography.fontSize.sm,
  },
  submitButton: {
    marginBottom: spacing.sm,
  },
  skipButton: {
    marginBottom: spacing.xl,
  },
});
