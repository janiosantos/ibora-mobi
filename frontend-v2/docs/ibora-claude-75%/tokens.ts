// Design Tokens - iBora Driver App
// Based on screenshot analysis

export const colors = {
  // Primary colors (from screenshots - blue theme)
  primary: '#5B51FF',
  primaryDark: '#4B41EF',
  primaryLight: '#7B71FF',
  
  // Secondary colors
  secondary: '#FF6B6B',
  secondaryLight: '#FF8787',
  
  // Status colors
  success: '#4CAF50',
  successLight: '#66BB6A',
  warning: '#FFC107',
  warningLight: '#FFD54F',
  danger: '#F44336',
  dangerLight: '#EF5350',
  info: '#2196F3',
  infoLight: '#42A5F5',
  
  // Neutral colors - Light theme
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceAlt: '#FAFAFA',
    border: '#E0E0E0',
    divider: '#EEEEEE',
    text: {
      primary: '#212121',
      secondary: '#757575',
      tertiary: '#9E9E9E',
      disabled: '#BDBDBD',
    },
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Neutral colors - Dark theme
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceAlt: '#2C2C2C',
    border: '#383838',
    divider: '#2C2C2C',
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      tertiary: '#808080',
      disabled: '#606060',
    },
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Transparent variants
  transparent: {
    primary: 'rgba(91, 81, 255, 0.1)',
    success: 'rgba(76, 175, 80, 0.1)',
    warning: 'rgba(255, 193, 7, 0.1)',
    danger: 'rgba(244, 67, 54, 0.1)',
  },
  
  // Map specific colors
  map: {
    route: '#5B51FF',
    pickup: '#4CAF50',
    dropoff: '#F44336',
    driver: '#2196F3',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
  },
  
  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
};

export const transitions = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};

export const hitSlop = {
  small: { top: 8, bottom: 8, left: 8, right: 8 },
  medium: { top: 12, bottom: 12, left: 12, right: 12 },
  large: { top: 16, bottom: 16, left: 16, right: 16 },
};

export const layout = {
  screenPadding: spacing.base,
  cardPadding: spacing.base,
  inputHeight: 48,
  buttonHeight: 56,
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },
  avatarSize: {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  },
};
