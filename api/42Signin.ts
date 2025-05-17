import * as WebBrowser from 'expo-web-browser';
import { setToken, setRefreshToken } from '../api/api'; // your helpers
import Constants from 'expo-constants';
// IMPORTANT: Make sure your .env is loaded via babel.config.js or Expo config

const CLIENT_ID = Constants.expoConfig?.extra?.CLIENT_ID;
const CLIENT_SECRET = Constants.expoConfig?.extra?.CLIENT_SECRET;
const REDIRECT_URI = Constants.expoConfig?.extra?.REDIRECT_URI;
const AUTH_URL = Constants.expoConfig?.extra?.AUTH_URL;
const TOKEN_URL = Constants.expoConfig?.extra?.TOKEN_URL;

export async function signInWith42() {
  // Check for missing env variables
  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !AUTH_URL || !TOKEN_URL) {
    throw new Error('Missing environment variables for 42 OAuth');
  }

  try {
    const authUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
    const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

    if (result.type === 'success' && result.url) {
      // Extract code from URL using regex (avoid new URL())
      const codeMatch = result.url.match(/[?&]code=([^&]+)/);
      const code = codeMatch ? codeMatch[1] : null;
      if (!code) throw new Error('No code found in redirect URL');
      // Exchange code for access token
      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
      });
      const data = await response.json();
      if (!data.access_token) throw new Error('No access token received');
      // Save tokens
      await setToken(data.access_token);
      await setRefreshToken(data.refresh_token);
      // You can now use the access token to call the 42 API!
      return data;
    } else {
      throw new Error('Authentication failed or cancelled');
    }
  } catch (e) {
    console.error('42 OAuth error:', e);
    throw e;
  }
}