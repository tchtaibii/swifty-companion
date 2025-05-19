import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useNetworkStore } from '../stores/networkStore';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

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

// Function to refresh the access token
async function refreshToken() {
  const refresh_token = await getRefreshToken();
  if (!refresh_token) throw new Error('No refresh token');
  // Adjust the endpoint and payload as per your API
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token });
  const { access_token, refresh_token: new_refresh_token } = response.data;
  await setToken(access_token);
  if (new_refresh_token) await setRefreshToken(new_refresh_token);
  return access_token;
}
