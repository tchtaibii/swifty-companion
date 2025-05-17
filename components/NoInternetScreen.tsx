import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

interface NoInternetScreenProps {
  onRetry: () => void;
}

export function NoInternetScreen({ onRetry }: NoInternetScreenProps) {
  const { width } = Dimensions.get('window');
  
  const [pulseAnim] = React.useState(new Animated.Value(1));
  
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle" size={80} color="#FFF" />
        </View>
        
        <Text style={styles.title}>No Internet Connection</Text>
        
        <Text style={styles.message}>
          Please check your connection and try again. You need an internet connection to use this app.
        </Text>
        
        <Animated.View 
          style={[
            styles.waveContainer, 
            { 
              width: width * 2,
              transform: [{ scale: pulseAnim }]
            }
          ]}
        >
          <View style={styles.wave} />
          <View style={[styles.wave, styles.wave2]} />
          <View style={[styles.wave, styles.wave3]} />
        </Animated.View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={20} color="#007AFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#AAA',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  waveContainer: {
    position: 'absolute',
    height: 200,
    bottom: -100,
    left: -100,
    zIndex: 1,
    opacity: 0.05,
    justifyContent: 'center',
  },
  wave: {
    position: 'absolute',
    width: '100%',
    height: '33%',
    backgroundColor: '#FFF',
    borderRadius: 1000,
    opacity: 0.5,
  },
  wave2: {
    height: '66%',
    opacity: 0.3,
  },
  wave3: {
    height: '100%',
    opacity: 0.1,
  },
}); 