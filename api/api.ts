import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useNetworkStore } from '../stores/networkStore';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const TOKEN_URL = Constants.expoConfig?.extra?.TOKEN_URL;

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Attach access token to every request if present
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle connection errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check if it's a network error (no connection)
    if (!error.response && error.message === 'Network Error') {
      useNetworkStore.getState().setIsConnected(false);
      return Promise.reject(error);
    }

    // Handle 401 and refresh token logic
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await removeToken();
        return Promise.reject(refreshError);
      }
    }

    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }

    return Promise.reject(error);
  }
);

// Refresh token logic
export const setToken = async (token: string) => {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
};
export const setRefreshToken = async (token: string) => {
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
};
export const getToken = async () => {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
};
export const getRefreshToken = async () => {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
};
export const removeToken = async () => {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Function to refresh the access token for 42 API
async function refreshToken() {
  const uid = Constants.expoConfig?.extra?.UUID;
  const client_id = Constants.expoConfig?.extra?.CLIENT_ID;
  const client_secret = Constants.expoConfig?.extra?.CLIENT_SECRET;
  const refresh_token = await getRefreshToken();
  
  if (!uid || !client_id || !client_secret) {
    throw new Error('Missing 42 API credentials');
  }

  try {
    const response = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: refresh_token
      } as any).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 2000
      }
    );

    const { access_token } = response.data;
    await setToken(access_token);
    return access_token;
  } catch (error) {
    console.error('Error refreshing 42 API token:', error);
    throw error;
  }
}

// Test function to verify token refresh
export const testTokenRefresh = async () => {
  try {
    console.log('Testing token refresh...');
    const newToken = await refreshToken();
    console.log('New token obtained:', newToken);
    return newToken;
  } catch (error) {
    console.error('Token refresh test failed:', error);
    throw error;
  }
};