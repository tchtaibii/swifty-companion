import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, View, ActivityIndicator, StyleSheet } from 'react-native';
import { NAV_THEME } from '../lib/constants';
import { useColorScheme } from '../lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { setAndroidNavigationBar } from '../lib/android-navigation-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { checkRequiredEnvVars } from '../lib/envCheck';
import { MissingEnvError } from '../components/MissingEnvError';
import * as Linking from 'expo-linking';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  ErrorBoundary,
} from 'expo-router';

const linking = {
  prefixes: ['swiftycompanion://'],
  config: {
    screens: {
      'auth/callback': 'auth/callback',
    },
  },
};

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const hasMounted = React.useRef(false);
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const { isAuthenticated } = useAuthStore();
  
  const [envCheck, setEnvCheck] = useState(() => checkRequiredEnvVars());

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      console.log('Deep link received:', event.url);
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('App launched with deep link:', url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      document.documentElement.classList.add('bg-background');
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!isLoading) {
      if (isAuthenticated && !inAuthGroup) {
        router.replace('/home');
      } else if (!isAuthenticated && inAuthGroup) {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, segments, isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!envCheck.isValid) {
    return <MissingEnvError missingVars={envCheck.missingVars} />;
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!isColorSchemeLoaded) {
    return null;
  }

  const backgroundColor = isDarkColorScheme ? NAV_THEME.dark.background : NAV_THEME.light.background;
  const barStyle = isDarkColorScheme ? 'light' : 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={barStyle} backgroundColor={backgroundColor} translucent={false} />
        <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'left', 'right']}> 
          <Stack 
            screenOptions={{ headerShown: false }}
            // @ts-ignore - expo-router has incomplete types
            linking={linking}
          >
            {!isAuthenticated ? (
              <Stack.Screen name="(unauthenticated)" />
            ) : (
              <Stack.Screen name="(auth)" />
            )}
            <Stack.Screen name="auth/callback" />
            <Stack.Screen name="_not-found" options={{ title: 'Not Found' }} />
          </Stack>
          <PortalHost />
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
