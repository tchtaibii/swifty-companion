import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NoInternetScreen } from '../components/NoInternetScreen';
import { router } from 'expo-router';

export default function NoConnectionScreen() {
  const handleRetry = async () => {
    try {
      // Try to make a request to check connection
      await fetch('https://www.google.com', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      // If successful, go back to the previous screen
      router.back();
    } catch (error) {
      // If still no connection, stay on this screen
      console.log('Still no internet connection');
    }
  };

  return (
    <View style={styles.container}>
      <NoInternetScreen onRetry={handleRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 