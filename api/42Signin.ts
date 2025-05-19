import * as WebBrowser from 'expo-web-browser';
import { setToken, setRefreshToken } from './api';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { router } from 'expo-router';

const CLIENT_ID = Constants.expoConfig?.extra?.CLIENT_ID;
const CLIENT_SECRET = Constants.expoConfig?.extra?.CLIENT_SECRET;
const REDIRECT_URI = Constants.expoConfig?.extra?.REDIRECT_URI;
const AUTH_URL = Constants.expoConfig?.extra?.AUTH_URL;
const TOKEN_URL = Constants.expoConfig?.extra?.TOKEN_URL;

WebBrowser.maybeCompleteAuthSession();

interface AuthResult {
  type?: 'success' | 'cancel' | 'webview_needed' | 'error';
  authUrl?: string;
  redirectUri?: string;
  access_token?: string;
  refresh_token?: string;
  error?: any;
  cancelled?: boolean;
}

export async function signInWith42(): Promise<AuthResult> {
  if (!CLIENT_ID || !CLIENT_SECRET || !AUTH_URL || !TOKEN_URL || !REDIRECT_URI) {
    throw new Error('Missing environment variables for 42 OAuth');
  }

  try {    
    const authUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
    
    if (Platform.OS === 'ios') {
      return await handleIOSAuth(authUrl);
    } else {
      return {
        type: 'webview_needed',
        authUrl: authUrl,
        redirectUri: REDIRECT_URI
      };
    }
  } catch (e) {
    console.log('42 OAuth error:', e);
    if (e instanceof Error && e.message === 'Network Error') {
      router.replace('/no-connection');
    }
    return { type: 'error', error: e };
  }
}

async function handleIOSAuth(authUrl: string): Promise<AuthResult> {
  try {
    const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
    
    if (result.type === 'success' && result.url) {
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
  } catch (e) {
    console.log('iOS Auth error:', e);
    if (e instanceof Error && e.message === 'Network Error') {
      router.replace('/no-connection');
    }
    return { type: 'error', error: e };
  }
}

export async function exchangeCodeForToken(code: string): Promise<AuthResult> {
  if (!code) throw new Error('No code provided for token exchange');
    
  try {
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
    
    await setToken(data.access_token);
    if (data.refresh_token) {
      await setRefreshToken(data.refresh_token);
    }
    console.log('Authentication successful');
    return data;
  } catch (e) {
    console.log('Token exchange error:', e);
    if (e instanceof Error && e.message === 'Network Error') {
      router.replace('/no-connection');
    }
    throw e;
  }
}