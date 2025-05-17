import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

interface OAuthWebViewProps {
  url: string;
  redirectUri: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export function OAuthWebView({ url, redirectUri, visible, onClose, onSuccess }: OAuthWebViewProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [url]);

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    
    if (url.startsWith(redirectUri)) {
      const codeMatch = url.match(/[?&]code=([^&]+)/);
      if (codeMatch && codeMatch[1]) {
        onSuccess(codeMatch[1]);
      } else {
        console.error('No authorization code found in redirect URL');
      }
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>42 Authentication</Text>
          <View style={styles.rightPlaceholder} />
        </View>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        
        <WebView
          source={{ uri: url }}
          incognito={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onNavigationStateChange={handleNavigationStateChange}
          onLoad={() => setLoading(false)}
          onLoadStart={() => setLoading(true)}
          onError={(error) => {
            console.log('WebView error:', error);
            setLoading(false);
          }}
          userAgent="Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36"
          style={[styles.webView, loading && styles.hidden]}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  rightPlaceholder: {
    width: 70,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 10,
  },
  hidden: {
    opacity: 0,
  },
}); 