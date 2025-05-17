import Constants from 'expo-constants';

// Define the required environment variables
const REQUIRED_ENV_VARS = [
  'API_BASE_URL',
  'CLIENT_ID',
  'CLIENT_SECRET',
  'REDIRECT_URI',
  'AUTH_URL',
  'TOKEN_URL',
];

export interface EnvCheckResult {
  isValid: boolean;
  missingVars: string[];
}

/**
 * Checks if all required environment variables are set
 */
export function checkRequiredEnvVars(): EnvCheckResult {
  const missingVars: string[] = [];
  
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!Constants.expoConfig?.extra?.[envVar]) {
      missingVars.push(envVar);
    }
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
} 