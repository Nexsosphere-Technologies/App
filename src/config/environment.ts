/**
 * Environment Configuration
 * Handles all environment variables and configuration validation
 */

export interface EnvironmentConfig {
  // App Configuration
  APP_ENV: 'development' | 'staging' | 'production';
  APP_NAME: string;
  APP_VERSION: string;
  
  // Algorand Configuration
  ALGORAND_NETWORK: 'mainnet' | 'testnet' | 'betanet' | 'localnet';
  ALGOD_SERVER: string;
  ALGOD_PORT: number;
  ALGOD_TOKEN: string;
  INDEXER_SERVER: string;
  INDEXER_PORT: number;
  INDEXER_TOKEN: string;
  
  // Contract IDs
  NEXDEN_TOKEN_ID: number;
  DID_REGISTRY_ID: number;
  VC_REGISTRY_ID: number;
  REPUTATION_SYSTEM_ID: number;
  STAKING_CONTRACT_ID: number;
  LP_FARMING_ID: number;
  
  // Feature Flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_ERROR_REPORTING: boolean;
  ENABLE_DEBUG: boolean;
  
  // Optional Services
  GA_TRACKING_ID?: string;
  SENTRY_DSN?: string;
  API_BASE_URL?: string;
  API_TIMEOUT: number;
  
  // Security
  ENCRYPTION_KEY: string;
}

// Default configuration for development
const defaultConfig: EnvironmentConfig = {
  APP_ENV: 'development',
  APP_NAME: 'NexDentify',
  APP_VERSION: '1.0.0',
  
  ALGORAND_NETWORK: 'testnet',
  ALGOD_SERVER: 'https://testnet-api.algonode.cloud',
  ALGOD_PORT: 443,
  ALGOD_TOKEN: '',
  INDEXER_SERVER: 'https://testnet-idx.algonode.cloud',
  INDEXER_PORT: 443,
  INDEXER_TOKEN: '',
  
  NEXDEN_TOKEN_ID: 0,
  DID_REGISTRY_ID: 0,
  VC_REGISTRY_ID: 0,
  REPUTATION_SYSTEM_ID: 0,
  STAKING_CONTRACT_ID: 0,
  LP_FARMING_ID: 0,
  
  ENABLE_ANALYTICS: false,
  ENABLE_ERROR_REPORTING: false,
  ENABLE_DEBUG: true,
  
  API_TIMEOUT: 10000,
  ENCRYPTION_KEY: 'nexdentify-local-dev-key-2024'
};

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key];
  if (value !== undefined && value !== '') {
    return value;
  }
  if (fallback !== undefined) {
    return fallback;
  }
  
  // Only throw error in production for critical variables
  const criticalVars = [
    'VITE_ALGORAND_NETWORK',
    'VITE_ALGOD_SERVER',
    'VITE_INDEXER_SERVER'
  ];
  
  if (import.meta.env.PROD && criticalVars.includes(key)) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return '';
}

/**
 * Get environment variable as number with fallback
 */
function getEnvNumber(key: string, fallback: number): number {
  const value = import.meta.env[key];
  if (value !== undefined && value !== '') {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

/**
 * Get environment variable as boolean with fallback
 */
function getEnvBoolean(key: string, fallback: boolean): boolean {
  const value = import.meta.env[key];
  if (value !== undefined && value !== '') {
    return value.toLowerCase() === 'true';
  }
  return fallback;
}

/**
 * Load and validate environment configuration
 */
export function loadEnvironmentConfig(): EnvironmentConfig {
  try {
    const config: EnvironmentConfig = {
      // App Configuration
      APP_ENV: getEnvVar('VITE_APP_ENV', defaultConfig.APP_ENV) as EnvironmentConfig['APP_ENV'],
      APP_NAME: getEnvVar('VITE_APP_NAME', defaultConfig.APP_NAME),
      APP_VERSION: getEnvVar('VITE_APP_VERSION', defaultConfig.APP_VERSION),
      
      // Algorand Configuration
      ALGORAND_NETWORK: getEnvVar('VITE_ALGORAND_NETWORK', defaultConfig.ALGORAND_NETWORK) as EnvironmentConfig['ALGORAND_NETWORK'],
      ALGOD_SERVER: getEnvVar('VITE_ALGOD_SERVER', defaultConfig.ALGOD_SERVER),
      ALGOD_PORT: getEnvNumber('VITE_ALGOD_PORT', defaultConfig.ALGOD_PORT),
      ALGOD_TOKEN: getEnvVar('VITE_ALGOD_TOKEN', defaultConfig.ALGOD_TOKEN),
      INDEXER_SERVER: getEnvVar('VITE_INDEXER_SERVER', defaultConfig.INDEXER_SERVER),
      INDEXER_PORT: getEnvNumber('VITE_INDEXER_PORT', defaultConfig.INDEXER_PORT),
      INDEXER_TOKEN: getEnvVar('VITE_INDEXER_TOKEN', defaultConfig.INDEXER_TOKEN),
      
      // Contract IDs
      NEXDEN_TOKEN_ID: getEnvNumber('VITE_NEXDEN_TOKEN_ID', defaultConfig.NEXDEN_TOKEN_ID),
      DID_REGISTRY_ID: getEnvNumber('VITE_DID_REGISTRY_ID', defaultConfig.DID_REGISTRY_ID),
      VC_REGISTRY_ID: getEnvNumber('VITE_VC_REGISTRY_ID', defaultConfig.VC_REGISTRY_ID),
      REPUTATION_SYSTEM_ID: getEnvNumber('VITE_REPUTATION_SYSTEM_ID', defaultConfig.REPUTATION_SYSTEM_ID),
      STAKING_CONTRACT_ID: getEnvNumber('VITE_STAKING_CONTRACT_ID', defaultConfig.STAKING_CONTRACT_ID),
      LP_FARMING_ID: getEnvNumber('VITE_LP_FARMING_ID', defaultConfig.LP_FARMING_ID),
      
      // Feature Flags
      ENABLE_ANALYTICS: getEnvBoolean('VITE_ENABLE_ANALYTICS', defaultConfig.ENABLE_ANALYTICS),
      ENABLE_ERROR_REPORTING: getEnvBoolean('VITE_ENABLE_ERROR_REPORTING', defaultConfig.ENABLE_ERROR_REPORTING),
      ENABLE_DEBUG: getEnvBoolean('VITE_ENABLE_DEBUG', defaultConfig.ENABLE_DEBUG),
      
      // Optional Services
      GA_TRACKING_ID: getEnvVar('VITE_GA_TRACKING_ID'),
      SENTRY_DSN: getEnvVar('VITE_SENTRY_DSN'),
      API_BASE_URL: getEnvVar('VITE_API_BASE_URL'),
      API_TIMEOUT: getEnvNumber('VITE_API_TIMEOUT', defaultConfig.API_TIMEOUT),
      
      // Security
      ENCRYPTION_KEY: getEnvVar('VITE_ENCRYPTION_KEY', defaultConfig.ENCRYPTION_KEY)
    };

    return config;
  } catch (error) {
    console.error('Environment configuration error:', error);
    
    // In development, return default config with warning
    if (!import.meta.env.PROD) {
      console.warn('Using default configuration for development. Please check your .env file.');
      return defaultConfig;
    }
    
    // In production, re-throw the error
    throw error;
  }
}

/**
 * Validate environment configuration
 */
export function validateEnvironment(config: EnvironmentConfig): void {
  const errors: string[] = [];
  
  // Only validate critical variables in production
  if (import.meta.env.PROD) {
    if (!config.ALGOD_SERVER) {
      errors.push('ALGOD_SERVER is required');
    }
    
    if (!config.INDEXER_SERVER) {
      errors.push('INDEXER_SERVER is required');
    }
    
    if (!config.ALGORAND_NETWORK) {
      errors.push('ALGORAND_NETWORK is required');
    }
    
    if (!config.ENCRYPTION_KEY || config.ENCRYPTION_KEY === defaultConfig.ENCRYPTION_KEY) {
      errors.push('ENCRYPTION_KEY must be set to a secure value in production');
    }
  }
  
  // Validate network values
  const validNetworks = ['mainnet', 'testnet', 'betanet', 'localnet'];
  if (!validNetworks.includes(config.ALGORAND_NETWORK)) {
    errors.push(`ALGORAND_NETWORK must be one of: ${validNetworks.join(', ')}`);
  }
  
  // Validate URLs
  if (config.ALGOD_SERVER && !isValidUrl(config.ALGOD_SERVER)) {
    errors.push('ALGOD_SERVER must be a valid URL');
  }
  
  if (config.INDEXER_SERVER && !isValidUrl(config.INDEXER_SERVER)) {
    errors.push('INDEXER_SERVER must be a valid URL');
  }
  
  if (errors.length > 0) {
    const errorMessage = `Environment validation failed:\n${errors.join('\n')}`;
    
    // In development, log warning instead of throwing
    if (!import.meta.env.PROD) {
      console.warn(errorMessage);
      console.warn('Continuing with default configuration for development...');
      return;
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Check if a string is a valid URL
 */
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the current environment configuration
 */
export const environment = loadEnvironmentConfig();

/**
 * Validate the loaded configuration
 */
try {
  validateEnvironment(environment);
} catch (error) {
  if (import.meta.env.PROD) {
    throw error;
  }
  // In development, just log the error and continue
  console.warn('Environment validation warning:', error);
}

/**
 * Export commonly used values
 */
export const isDevelopment = environment.APP_ENV === 'development';
export const isProduction = environment.APP_ENV === 'production';
export const isStaging = environment.APP_ENV === 'staging';

export default environment;