import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface MissingEnvErrorProps {
  missingVars: string[];
}

export function MissingEnvError({ missingVars }: MissingEnvErrorProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>⚠️ Environment Error</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.message}>
          The application cannot start because required environment variables are missing:
        </Text>
        
        <View style={styles.errorBox}>
          {missingVars.map(envVar => (
            <Text key={envVar} style={styles.envVar}>• {envVar}</Text>
          ))}
        </View>
        
        <Text style={styles.instructions}>
          To fix this error:
        </Text>
        
        <Text style={styles.step}>
          1. Create a <Text style={styles.code}>.env</Text> file in the project root
        </Text>
        
        <Text style={styles.step}>
          2. Add the missing variables with appropriate values
        </Text>
        
        <Text style={styles.step}>
          3. Restart the application
        </Text>
        
        <Text style={styles.note}>
          See <Text style={styles.link} onPress={() => Linking.openURL('https://docs.expo.dev/guides/environment-variables/')}>
            Expo documentation
          </Text> for more information on environment variables.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ff3b30',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  envVar: {
    fontSize: 16,
    color: '#ff6b6b',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  instructions: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  step: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    lineHeight: 22,
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#2a2a2a',
    color: '#e6e6e6',
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  note: {
    marginTop: 20,
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 20,
  },
  link: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
}); 