import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useEffect, useState } from 'react';

export function useColorScheme() {
  const colorScheme = useNativeColorScheme();
  const [currentColorScheme, setCurrentColorScheme] = useState(colorScheme || 'light');

  useEffect(() => {
    if (colorScheme) {
      setCurrentColorScheme(colorScheme);
    }
  }, [colorScheme]);

  const toggleColorScheme = () => {
    setCurrentColorScheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return {
    colorScheme: currentColorScheme,
    isDarkColorScheme: currentColorScheme === 'dark',
    setColorScheme: setCurrentColorScheme,
    toggleColorScheme,
  };
}
