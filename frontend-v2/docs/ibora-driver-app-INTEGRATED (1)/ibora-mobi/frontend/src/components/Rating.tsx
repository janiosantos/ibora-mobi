import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/tokens';

interface RatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
  maxRating?: number;
}

export const Rating: React.FC<RatingProps> = ({
  value = 0,
  onChange,
  readonly = false,
  size = 32,
  maxRating = 5,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(value);
  
  const handlePress = (index: number) => {
    if (readonly) return;
    const newRating = index + 1;
    setRating(newRating);
    onChange?.(newRating);
  };
  
  const currentRating = hoverRating || rating;
  
  return (
    <View style={styles.container}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < currentRating;
        
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            disabled={readonly}
            activeOpacity={0.7}
            style={styles.star}
          >
            <Ionicons
              name={isFilled ? 'star' : 'star-outline'}
              size={size}
              color={isFilled ? colors.warning : colors.light.text.disabled}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  star: {
    padding: spacing.xs,
  },
});
