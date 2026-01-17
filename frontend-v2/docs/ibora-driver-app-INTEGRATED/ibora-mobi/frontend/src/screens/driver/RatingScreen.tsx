import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Avatar, Rating, Chip } from '../../components';
import { colors, spacing, typography, radius } from '../../theme/tokens';
import { useTheme } from '../../theme';
import { mockActiveRide } from '../../mock/data';

const feedbackTags = [
  'Comfortable ride',
  'Professional ride',
  'Affordable',
  'Clean Helmet',
  'Safe Driving',
  'Friendly',
];

export const RatingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors: themeColors } = useTheme();
  const [ride] = useState(mockActiveRide);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
  
  const handleSubmit = () => {
    // Submit rating
    navigation.navigate('MainTabs');
  };
  
  const handleSkip = () => {
    navigation.navigate('MainTabs');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Payment Confirmation */}
        <View style={[styles.paymentBanner, { backgroundColor: colors.transparent.success }]}>
          <Text style={[styles.paymentText, { color: colors.success }]}>
            ✓ Paid ${ride.actual_price?.toFixed(2) || ride.estimated_price.toFixed(2)}
          </Text>
          <Text style={[styles.helpText, { color: themeColors.text.secondary }]}>
            ⓘ Help
          </Text>
        </View>
        
        {/* Passenger Avatar */}
        <View style={styles.avatarContainer}>
          <Avatar size="xl" name={ride.passenger.full_name} />
        </View>
        
        {/* Rating Title */}
        <Text style={[styles.title, { color: themeColors.text.primary }]}>
          How was your ride with {ride.passenger.full_name}
        </Text>
        
        {/* Star Rating */}
        <View style={styles.ratingContainer}>
          <Rating value={rating} onChange={setRating} size={40} />
        </View>
        
        {/* Feedback Prompt */}
        <Text style={[styles.prompt, { color: themeColors.text.secondary }]}>
          Great, what did you like the most? 😊
        </Text>
        
        {/* Feedback Tags */}
        <View style={styles.tagsContainer}>
          {feedbackTags.map((tag) => (
            <View key={tag} style={styles.tagItem}>
              <Chip
                label={tag}
                selected={selectedTags.includes(tag)}
                onPress={() => toggleTag(tag)}
                variant="filled"
              />
            </View>
          ))}
        </View>
        
        {/* Comment Input */}
        <View
          style={[
            styles.commentContainer,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            },
          ]}
        >
          <TextInput
            style={[
              styles.commentInput,
              {
                color: themeColors.text.primary,
              },
            ]}
            placeholder="Tell us more..."
            placeholderTextColor={themeColors.text.tertiary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleSubmit}
            disabled={rating === 0}
          >
            Done
          </Button>
          
          <Button
            variant="outline"
            size="large"
            fullWidth
            onPress={handleSkip}
          >
            Skip
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingTop: spacing.lg,
  },
  paymentBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  paymentText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  helpText: {
    fontSize: typography.fontSize.base,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  prompt: {
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tagItem: {
    marginBottom: spacing.sm,
  },
  commentContainer: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  commentInput: {
    fontSize: typography.fontSize.base,
    minHeight: 80,
  },
  actions: {
    gap: spacing.md,
  },
});
