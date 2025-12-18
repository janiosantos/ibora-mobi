
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-constants', () => ({
    manifest: {
        extra: {
            apiUrl: 'http://localhost:8000'
        }
    },
    default: {
        manifest: {
            extra: {
                apiUrl: 'http://localhost:8000'
            }
        }
    }
}));

jest.mock('@expo/vector-icons', () => {
    const { View } = require('react-native');
    const MockIcon = (props) => <View {...props} />;
    return {
        Ionicons: MockIcon,
        MaterialIcons: MockIcon,
        AntDesign: MockIcon,
        FontAwesome: MockIcon,
        Entypo: MockIcon
    };
});

jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
    isLoaded: jest.fn(() => true),
}));

jest.mock('expo-asset', () => ({
    Asset: {
        loadAsync: jest.fn(),
        fromModule: jest.fn(() => ({ downloadAsync: jest.fn() })),
    },
}));

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaProvider: ({ children }) => children,
}));
