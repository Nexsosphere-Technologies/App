/**
 * Deployment Configuration for NexDentify Smart Contracts
 * 
 * This file contains the deployment configuration and initialization parameters
 * for all NexDentify smart contracts on Algorand.
 */

export interface DeploymentConfig {
  // Network configuration
  network: 'mainnet' | 'testnet' | 'betanet' | 'localnet';
  
  // Contract deployment order and dependencies
  contracts: {
    nexdenToken: {
      name: string;
      symbol: string;
      decimals: number;
      initialSupply: number;
      adminAddress?: string;
    };
    
    didRegistry: {
      // No additional config needed
    };
    
    vcRegistry: {
      didRegistryAppId?: number;
      reputationContractAppId?: number;
    };
    
    reputationSystem: {
      didRegistryAppId?: number;
      vcRegistryAppId?: number;
      stakingContractAppId?: number;
      maxReputationScore: number;
      reputationDecayRate: number;
      weights: {
        credential: number;
        attestation: number;
        staking: number;
        participation: number;
        time: number;
      };
    };
    
    stakingContract: {
      nexdenTokenId?: number;
      reputationContractAppId?: number;
      initialPools: Array<{
        name: string;
        lockPeriod: number;
        apy: number;
        minStake: number;
        maxStake: number;
      }>;
    };
    
    lpFarming: {
      nexdenTokenId?: number;
      reputationContractAppId?: number;
      initialFarms: Array<{
        name: string;
        lpTokenId: number;
        rewardRate: number;
        lockPeriod: number;
        minDeposit: number;
        maxDeposit: number;
        startTime: number;
        endTime: number;
        rewardPool: number;
      }>;
    };
  };
}

// Default configuration for testnet deployment
export const testnetConfig: DeploymentConfig = {
  network: 'testnet',
  contracts: {
    nexdenToken: {
      name: 'NexDen Token',
      symbol: 'NEXDEN',
      decimals: 6,
      initialSupply: 1000000000, // 1 billion tokens
    },
    
    didRegistry: {},
    
    vcRegistry: {},
    
    reputationSystem: {
      maxReputationScore: 100,
      reputationDecayRate: 10, // 0.1% per day
      weights: {
        credential: 3000, // 30%
        attestation: 2500, // 25%
        staking: 2000, // 20%
        participation: 1500, // 15%
        time: 1000, // 10%
      },
    },
    
    stakingContract: {
      initialPools: [
        {
          name: 'NEXDEN Flexible Staking',
          lockPeriod: 0, // No lock
          apy: 1250, // 12.5%
          minStake: 100000000, // 100 NEXDEN
          maxStake: 100000000000, // 100,000 NEXDEN
        },
        {
          name: 'NEXDEN 30-Day Lock',
          lockPeriod: 30 * 24 * 3600, // 30 days
          apy: 1800, // 18%
          minStake: 100000000, // 100 NEXDEN
          maxStake: 100000000000, // 100,000 NEXDEN
        },
        {
          name: 'NEXDEN 90-Day Lock',
          lockPeriod: 90 * 24 * 3600, // 90 days
          apy: 2500, // 25%
          minStake: 500000000, // 500 NEXDEN
          maxStake: 500000000000, // 500,000 NEXDEN
        },
      ],
    },
    
    lpFarming: {
      initialFarms: [
        {
          name: 'NEXDEN-ALGO LP Farm',
          lpTokenId: 0, // To be set after LP token creation
          rewardRate: 1000, // Rewards per second per LP token
          lockPeriod: 0, // No lock
          minDeposit: 1000000, // 1 LP token
          maxDeposit: 1000000000000, // 1M LP tokens
          startTime: 0, // To be set at deployment
          endTime: 0, // To be set at deployment (1 year later)
          rewardPool: 10000000000, // 10,000 NEXDEN
        },
      ],
    },
  },
};

// Production mainnet configuration
export const mainnetConfig: DeploymentConfig = {
  network: 'mainnet',
  contracts: {
    nexdenToken: {
      name: 'NexDen Token',
      symbol: 'NEXDEN',
      decimals: 6,
      initialSupply: 1000000000, // 1 billion tokens
    },
    
    didRegistry: {},
    
    vcRegistry: {},
    
    reputationSystem: {
      maxReputationScore: 100,
      reputationDecayRate: 5, // 0.05% per day (slower decay on mainnet)
      weights: {
        credential: 3000, // 30%
        attestation: 2500, // 25%
        staking: 2000, // 20%
        participation: 1500, // 15%
        time: 1000, // 10%
      },
    },
    
    stakingContract: {
      initialPools: [
        {
          name: 'NEXDEN Flexible Staking',
          lockPeriod: 0,
          apy: 1000, // 10%
          minStake: 1000000000, // 1,000 NEXDEN
          maxStake: 1000000000000, // 1,000,000 NEXDEN
        },
        {
          name: 'NEXDEN 90-Day Lock',
          lockPeriod: 90 * 24 * 3600,
          apy: 1500, // 15%
          minStake: 5000000000, // 5,000 NEXDEN
          maxStake: 5000000000000, // 5,000,000 NEXDEN
        },
        {
          name: 'NEXDEN 365-Day Lock',
          lockPeriod: 365 * 24 * 3600,
          apy: 2000, // 20%
          minStake: 10000000000, // 10,000 NEXDEN
          maxStake: 10000000000000, // 10,000,000 NEXDEN
        },
      ],
    },
    
    lpFarming: {
      initialFarms: [
        {
          name: 'NEXDEN-ALGO LP Farm',
          lpTokenId: 0,
          rewardRate: 500, // Lower rate for mainnet
          lockPeriod: 7 * 24 * 3600, // 7 days lock
          minDeposit: 10000000, // 10 LP tokens
          maxDeposit: 10000000000000, // 10M LP tokens
          startTime: 0,
          endTime: 0,
          rewardPool: 100000000000, // 100,000 NEXDEN
        },
      ],
    },
  },
};

/**
 * Deployment script utilities
 */
export class DeploymentManager {
  private config: DeploymentConfig;
  private deployedContracts: Map<string, number> = new Map();
  
  constructor(config: DeploymentConfig) {
    this.config = config;
  }
  
  /**
   * Deploy all contracts in the correct order
   */
  async deployAll(): Promise<Map<string, number>> {
    console.log(`Deploying NexDentify contracts to ${this.config.network}...`);
    
    // 1. Deploy NexDen Token (ASA)
    const nexdenTokenId = await this.deployNexDenToken();
    this.deployedContracts.set('nexdenToken', nexdenTokenId);
    
    // 2. Deploy DID Registry
    const didRegistryAppId = await this.deployDIDRegistry();
    this.deployedContracts.set('didRegistry', didRegistryAppId);
    
    // 3. Deploy VC Registry
    const vcRegistryAppId = await this.deployVCRegistry(didRegistryAppId);
    this.deployedContracts.set('vcRegistry', vcRegistryAppId);
    
    // 4. Deploy Reputation System
    const reputationAppId = await this.deployReputationSystem(
      didRegistryAppId,
      vcRegistryAppId
    );
    this.deployedContracts.set('reputationSystem', reputationAppId);
    
    // 5. Deploy Staking Contract
    const stakingAppId = await this.deployStakingContract(
      nexdenTokenId,
      reputationAppId
    );
    this.deployedContracts.set('stakingContract', stakingAppId);
    
    // 6. Deploy LP Farming Contract
    const lpFarmingAppId = await this.deployLPFarming(
      nexdenTokenId,
      reputationAppId
    );
    this.deployedContracts.set('lpFarming', lpFarmingAppId);
    
    // 7. Configure cross-contract references
    await this.configureContracts();
    
    console.log('Deployment completed successfully!');
    console.log('Deployed contracts:', this.deployedContracts);
    
    return this.deployedContracts;
  }
  
  private async deployNexDenToken(): Promise<number> {
    console.log('Deploying NexDen Token...');
    // Implementation would use Algorand SDK to deploy the token
    return 0; // Placeholder
  }
  
  private async deployDIDRegistry(): Promise<number> {
    console.log('Deploying DID Registry...');
    // Implementation would compile and deploy the contract
    return 0; // Placeholder
  }
  
  private async deployVCRegistry(didRegistryAppId: number): Promise<number> {
    console.log('Deploying VC Registry...');
    // Implementation would deploy with DID registry reference
    return 0; // Placeholder
  }
  
  private async deployReputationSystem(
    didRegistryAppId: number,
    vcRegistryAppId: number
  ): Promise<number> {
    console.log('Deploying Reputation System...');
    // Implementation would deploy with references to other contracts
    return 0; // Placeholder
  }
  
  private async deployStakingContract(
    nexdenTokenId: number,
    reputationAppId: number
  ): Promise<number> {
    console.log('Deploying Staking Contract...');
    // Implementation would deploy and create initial pools
    return 0; // Placeholder
  }
  
  private async deployLPFarming(
    nexdenTokenId: number,
    reputationAppId: number
  ): Promise<number> {
    console.log('Deploying LP Farming Contract...');
    // Implementation would deploy and create initial farms
    return 0; // Placeholder
  }
  
  private async configureContracts(): Promise<void> {
    console.log('Configuring cross-contract references...');
    // Set up references between contracts
    // Configure initial parameters
    // Create initial pools/farms
  }
}

/**
 * Usage example:
 * 
 * const manager = new DeploymentManager(testnetConfig);
 * const deployedContracts = await manager.deployAll();
 */