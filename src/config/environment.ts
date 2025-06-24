/**
 * Environment Configuration
 * Centralized configuration management for different environments
 */

export interface EnvironmentConfig {
  // Network Configuration
  algorand: {
    network: 'mainnet' | 'testnet' | 'betanet' | 'localnet';
    algodServer: string;
    algodPort: number;
    indexerServer: string;
    indexerPort: number;
  };
  
  // Contract IDs
  contracts: {
    nexdenTokenId: number;
    didRegistryAppId: number;
    vcRegistryAppId: number;
    reputationSystemAppId: number;
    stakingContractAppId: number;
    lpFarmingAppId: number;
  };
  
  // Application Settings
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    domain: string;
  };
  
  // Feature Flags
  features: {
    analytics: boolean;
    errorReporting: boolean;
    debugMode: boolean;
  };
  
  // API Configuration
  api: {
    baseUrl: string;
    ipfsGateway: string;
  };
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    algorand: {
      network: (import.meta.env.VITE_ALGORAND_NETWORK as any) || 'testnet',
      algodServer: import.meta.env.VITE_ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
      algodPort: parseInt(import.meta.env.VITE_ALGOD_PORT) || 443,
      indexerServer: import.meta.env.VITE_INDEXER_SERVER || 'https://testnet-idx.algonode.cloud',
      indexerPort: parseInt(import.meta.env.VITE_INDEXER_PORT) || 443,
    },
    
    contracts: {
      nexdenTokenId: parseInt(import.meta.env.VITE_NEXDEN_TOKEN_ID) || 0,
      didRegistryAppId: parseInt(import.meta.env.VITE_DID_REGISTRY_APP_ID) || 0,
      vcRegistryAppId: parseInt(import.meta.env.VITE_VC_REGISTRY_APP_ID) || 0,
      reputationSystemAppId: parseInt(import.meta.env.VITE_REPUTATION_SYSTEM_APP_ID) || 0,
      stakingContractAppId: parseInt(import.meta.env.VITE_STAKING_CONTRACT_APP_ID) || 0,
      lpFarmingAppId: parseInt(import.meta.env.VITE_LP_FARMING_APP_ID) || 0,
    },
    
    app: {
      name: import.meta.env.VITE_APP_NAME || 'NexDentify',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: (import.meta.env.VITE_APP_ENVIRONMENT as any) || 'development',
      domain: import.meta.env.VITE_APP_DOMAIN || 'localhost',
    },
    
    features: {
      analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
      debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
    },
    
    api: {
      baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.nexdentify.com',
      ipfsGateway: import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/',
    },
  };
};

export const config = getEnvironmentConfig();

// Environment validation
export const validateEnvironment = (): boolean => {
  const requiredVars = [
    'VITE_ALGORAND_NETWORK',
    'VITE_ALGOD_SERVER',
    'VITE_INDEXER_SERVER',
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
};

// Development helpers
export const isDevelopment = () => config.app.environment === 'development';
export const isProduction = () => config.app.environment === 'production';
export const isStaging = () => config.app.environment === 'staging';