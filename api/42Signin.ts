import * as WebBrowser from 'expo-web-browser';
import { setToken, setRefreshToken } from './api';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const CLIENT_ID = Constants.expoConfig?.extra?.CLIENT_ID;
const CLIENT_SECRET = Constants.expoConfig?.extra?.CLIENT_SECRET;
const REDIRECT_URI = "swiftycompanion://auth/callback";
const AUTH_URL = Constants.expoConfig?.extra?.AUTH_URL;
const TOKEN_URL = Constants.expoConfig?.extra?.TOKEN_URL;

// Register the custom URL scheme handler
WebBrowser.maybeCompleteAuthSession();

// Type definitions for the return values
interface AuthResult {
  type?: 'success' | 'cancel' | 'webview_needed';
  authUrl?: string;
  redirectUri?: string;
  access_token?: string;
  refresh_token?: string;
  error?: any;
  cancelled?: boolean;
}

export async function signInWith42(): Promise<AuthResult> {
  // Check for missing env variables
  if (!CLIENT_ID || !CLIENT_SECRET || !AUTH_URL || !TOKEN_URL) {
    throw new Error('Missing environment variables for 42 OAuth');
  }

  try {
    console.log('Using redirect URI:', REDIRECT_URI);
    
    // Create the OAuth URL
    const authUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
    console.log('Opening auth URL:', authUrl);
    
    // Different flow for iOS vs Android
    if (Platform.OS === 'ios') {
      return await handleIOSAuth(authUrl);
    } else {
      // For Android, return info to show the WebView
      return {
        type: 'webview_needed',
        authUrl: authUrl,
        redirectUri: REDIRECT_URI
      };
    }
  } catch (e) {
    console.log('42 OAuth error:', e);
    return { error: e };
  }
}

// iOS-specific authentication flow
async function handleIOSAuth(authUrl: string): Promise<AuthResult> {
  const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
  console.log('iOS browser result:', result);
  
  if (result.type === 'success' && result.url) {
    // Extract code from URL using regex
    const codeMatch = result.url.match(/[?&]code=([^&]+)/);
    const code = codeMatch ? codeMatch[1] : null;
    
    if (!code) {
      throw new Error('No code found in redirect URL');
    }
    
    return await exchangeCodeForToken(code);
  } else if (result.type === 'cancel') {
    console.log('Authentication cancelled by user');
    return { cancelled: true };
  } else {
    throw new Error(`Authentication failed: ${result.type}`);
  }
}

// Exchange code for token - can be called from WebView success
export async function exchangeCodeForToken(code: string): Promise<AuthResult> {
  if (!code) throw new Error('No code provided for token exchange');
  
  console.log('Exchanging code for token');
  
  try {
    // Exchange code for access token
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Token exchange error:', response.status, errorText);
      throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    if (!data.access_token) throw new Error('No access token received');
    
    // Save tokens
    await setToken(data.access_token);
    if (data.refresh_token) {
      await setRefreshToken(data.refresh_token);
    }
    console.log('Authentication successful');
    return data;
  } catch (e) {
    console.log('Token exchange error:', e);
    throw e;
  }
}