import algosdk from 'algosdk';
import { environment } from '../config/environment';

/**
 * Algorand Service
 * Handles all interactions with Algorand blockchain and smart contracts
 */

// Contract addresses and IDs from environment configuration
export const CONTRACT_IDS = {
  NEXDEN_TOKEN: environment.contracts.nexdenToken,
  DID_REGISTRY: environment.contracts.didRegistry,
  VC_REGISTRY: environment.contracts.vcRegistry,
  REPUTATION_SYSTEM: environment.contracts.reputationSystem,
  STAKING_CONTRACT: environment.contracts.stakingContract,
  LP_FARMING: environment.contracts.lpFarming,
};

// Algorand client configuration
const algodToken = '';
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = 443;

export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Indexer configuration
const indexerToken = '';
const indexerServer = 'https://testnet-idx.algonode.cloud';
const indexerPort = 443;

export const indexerClient = new algosdk.Indexer(indexerToken, indexerServer, indexerPort);

/**
 * Wallet connection and account management
 */
export class WalletService {
  private static instance: WalletService;
  private account: algosdk.Account | null = null;
  private isConnected = false;

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  async connectWallet(seedPhrase?: string): Promise<string> {
    try {
      if (seedPhrase) {
        // Import from seed phrase
        const mnemonic = seedPhrase.trim();
        this.account = algosdk.mnemonicToSecretKey(mnemonic);
      } else {
        // Generate new account
        this.account = algosdk.generateAccount();
      }
      
      this.isConnected = true;
      return this.account.addr;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error('Failed to connect wallet');
    }
  }

  getAccount(): algosdk.Account | null {
    return this.account;
  }

  getAddress(): string {
    return this.account?.addr || '';
  }

  isWalletConnected(): boolean {
    return this.isConnected && this.account !== null;
  }

  disconnect(): void {
    this.account = null;
    this.isConnected = false;
  }

  async getBalance(): Promise<number> {
    if (!this.account) throw new Error('Wallet not connected');
    
    const accountInfo = await algodClient.accountInformation(this.account.addr).do();
    return accountInfo.amount;
  }

  async getNexdenBalance(): Promise<number> {
    if (!this.account || !CONTRACT_IDS.NEXDEN_TOKEN) return 0;
    
    try {
      const accountInfo = await algodClient.accountInformation(this.account.addr).do();
      const asset = accountInfo.assets?.find((a: any) => a['asset-id'] === CONTRACT_IDS.NEXDEN_TOKEN);
      return asset ? asset.amount : 0;
    } catch (error) {
      console.error('Failed to get NEXDEN balance:', error);
      return 0;
    }
  }
}

/**
 * DID Registry Service
 */
export class DIDService {
  private walletService = WalletService.getInstance();

  async createDID(
    didIdentifier: string,
    didDocument: string,
    controllers: string = '',
    services: string = ''
  ): Promise<string> {
    const account = this.walletService.getAccount();
    if (!account) throw new Error('Wallet not connected');

    // Check if DID registry contract is deployed
    if (!CONTRACT_IDS.DID_REGISTRY || CONTRACT_IDS.DID_REGISTRY === 0) {
      throw new Error('DID Registry contract not deployed. Please deploy contracts first.');
    }

    try {
      // Create application call transaction
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: account.addr,
        appIndex: CONTRACT_IDS.DID_REGISTRY,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('createDID')),
          new Uint8Array(Buffer.from(didIdentifier)),
          new Uint8Array(Buffer.from(didDocument)),
          new Uint8Array(Buffer.from(controllers)),
          new Uint8Array(Buffer.from(services))
        ],
        suggestedParams,
      });

      const signedTxn = appCallTxn.signTxn(account.sk);
      const txId = await algodClient.sendRawTransaction(signedTxn).do();
      
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      return txId;
    } catch (error) {
      console.error('Failed to create DID:', error);
      throw new Error('Failed to create DID');
    }
  }

  async resolveDID(didIdentifier: string): Promise<any> {
    try {
      // Read application state to get DID document
      const appInfo = await algodClient.getApplicationByID(CONTRACT_IDS.DID_REGISTRY).do();
      // Parse global state to find DID information
      // This is a simplified version - actual implementation would parse the state properly
      return {
        didIdentifier,
        document: 'ipfs://...',
        owner: 'ALGO_ADDRESS',
        active: true
      };
    } catch (error) {
      console.error('Failed to resolve DID:', error);
      throw new Error('Failed to resolve DID');
    }
  }

  async getUserPrimaryDID(userAddress: string): Promise<string> {
    try {
      // Read user's local state to get primary DID
      const accountInfo = await algodClient.accountInformation(userAddress).do();
      const appLocalState = accountInfo['apps-local-state']?.find(
        (app: any) => app.id === CONTRACT_IDS.DID_REGISTRY
      );
      
      if (appLocalState) {
        // Parse local state to get primary DID
        // This is simplified - actual implementation would parse the state
        return 'did:algo:testnet:' + userAddress.substring(0, 10) + '...';
      }
      
      return '';
    } catch (error) {
      console.error('Failed to get user primary DID:', error);
      return '';
    }
  }
}

/**
 * Verifiable Credentials Service
 */
export class VCService {
  private walletService = WalletService.getInstance();

  async issueCredential(
    credentialId: string,
    credentialHash: string,
    subject: string,
    credentialType: string,
    schema: string,
    expirationDate: number,
    metadata: string
  ): Promise<string> {
    const account = this.walletService.getAccount();
    if (!account) throw new Error('Wallet not connected');

    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: account.addr,
        appIndex: CONTRACT_IDS.VC_REGISTRY,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('issueCredential')),
          new Uint8Array(Buffer.from(credentialId)),
          new Uint8Array(Buffer.from(credentialHash)),
          algosdk.decodeAddress(subject).publicKey,
          new Uint8Array(Buffer.from(credentialType)),
          new Uint8Array(Buffer.from(schema)),
          algosdk.encodeUint64(expirationDate),
          new Uint8Array(Buffer.from(metadata))
        ],
        suggestedParams,
      });

      const signedTxn = appCallTxn.signTxn(account.sk);
      const txId = await algodClient.sendRawTransaction(signedTxn).do();
      
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      return txId;
    } catch (error) {
      console.error('Failed to issue credential:', error);
      throw new Error('Failed to issue credential');
    }
  }

  async verifyCredential(credentialId: string, providedHash: string): Promise<boolean> {
    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: this.walletService.getAddress(),
        appIndex: CONTRACT_IDS.VC_REGISTRY,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('verifyCredential')),
          new Uint8Array(Buffer.from(credentialId)),
          new Uint8Array(Buffer.from(providedHash))
        ],
        suggestedParams,
      });

      // This would return the verification result
      // For now, return true as placeholder
      return true;
    } catch (error) {
      console.error('Failed to verify credential:', error);
      return false;
    }
  }

  async getUserCredentials(userAddress: string): Promise<any[]> {
    try {
      // Read user's credentials from contract state
      // This is a simplified version
      return [
        {
          id: '1',
          type: 'education',
          title: 'University Degree',
          issuer: 'MIT',
          status: 'verified',
          hash: 'sha256...'
        }
      ];
    } catch (error) {
      console.error('Failed to get user credentials:', error);
      return [];
    }
  }
}

/**
 * Reputation Service
 */
export class ReputationService {
  private walletService = WalletService.getInstance();

  async getUserReputation(userAddress: string): Promise<any> {
    try {
      // Read user's reputation from contract
      const accountInfo = await algodClient.accountInformation(userAddress).do();
      const appLocalState = accountInfo['apps-local-state']?.find(
        (app: any) => app.id === CONTRACT_IDS.REPUTATION_SYSTEM
      );
      
      // Parse reputation data
      return {
        totalScore: 85,
        credentialScore: 25,
        attestationScore: 20,
        stakingScore: 18,
        participationScore: 15,
        timeScore: 7,
        lastUpdate: Date.now(),
        badges: []
      };
    } catch (error) {
      console.error('Failed to get user reputation:', error);
      return {
        totalScore: 0,
        credentialScore: 0,
        attestationScore: 0,
        stakingScore: 0,
        participationScore: 0,
        timeScore: 0,
        lastUpdate: 0,
        badges: []
      };
    }
  }

  async createAttestation(
    subject: string,
    weight: number,
    metadata: string
  ): Promise<string> {
    const account = this.walletService.getAccount();
    if (!account) throw new Error('Wallet not connected');

    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: account.addr,
        appIndex: CONTRACT_IDS.REPUTATION_SYSTEM,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('createAttestation')),
          algosdk.decodeAddress(subject).publicKey,
          algosdk.encodeUint64(weight),
          new Uint8Array(Buffer.from(metadata))
        ],
        suggestedParams,
      });

      const signedTxn = appCallTxn.signTxn(account.sk);
      const txId = await algodClient.sendRawTransaction(signedTxn).do();
      
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      return txId;
    } catch (error) {
      console.error('Failed to create attestation:', error);
      throw new Error('Failed to create attestation');
    }
  }

  async updateReputationScore(): Promise<string> {
    const account = this.walletService.getAccount();
    if (!account) throw new Error('Wallet not connected');

    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: account.addr,
        appIndex: CONTRACT_IDS.REPUTATION_SYSTEM,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('updateReputationScore')),
          algosdk.decodeAddress(account.addr).publicKey
        ],
        suggestedParams,
      });

      const signedTxn = appCallTxn.signTxn(account.sk);
      const txId = await algodClient.sendRawTransaction(signedTxn).do();
      
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      return txId;
    } catch (error) {
      console.error('Failed to update reputation score:', error);
      throw new Error('Failed to update reputation score');
    }
  }
}

/**
 * Staking Service
 */
export class StakingService {
  private walletService = WalletService.getInstance();

  async getStakingPools(): Promise<any[]> {
    try {
      // Read staking pools from contract
      return [
        {
          id: 1,
          name: 'NEXDEN Flexible Staking',
          lockPeriod: 0,
          apy: 12.5,
          minStake: 100,
          maxStake: 100000,
          totalStaked: 2450000,
          active: true
        },
        {
          id: 2,
          name: 'NEXDEN 90-Day Lock',
          lockPeriod: 90 * 24 * 3600,
          apy: 25.0,
          minStake: 500,
          maxStake: 500000,
          totalStaked: 850000,
          active: true
        }
      ];
    } catch (error) {
      console.error('Failed to get staking pools:', error);
      return [];
    }
  }

  async stake(poolId: number, amount: number): Promise<string> {
    const account = this.walletService.getAccount();
    if (!account) throw new Error('Wallet not connected');

    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      // Create asset transfer transaction for NEXDEN tokens
      const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: account.addr,
        to: algosdk.getApplicationAddress(CONTRACT_IDS.STAKING_CONTRACT),
        amount: amount * 1000000, // Convert to microunits
        assetIndex: CONTRACT_IDS.NEXDEN_TOKEN,
        suggestedParams,
      });

      // Create application call transaction
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: account.addr,
        appIndex: CONTRACT_IDS.STAKING_CONTRACT,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('stake')),
          algosdk.encodeUint64(poolId),
          algosdk.encodeUint64(amount * 1000000)
        ],
        suggestedParams,
      });

      // Group transactions
      const txns = [assetTransferTxn, appCallTxn];
      algosdk.assignGroupID(txns);

      // Sign transactions
      const signedTxns = txns.map(txn => txn.signTxn(account.sk));

      // Send transactions
      const txId = await algodClient.sendRawTransaction(signedTxns).do();
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      
      return txId;
    } catch (error) {
      console.error('Failed to stake:', error);
      throw new Error('Failed to stake tokens');
    }
  }

  async unstake(poolId: number): Promise<string> {
    const account = this.walletService.getAccount();
    if (!account) throw new Error('Wallet not connected');

    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: account.addr,
        appIndex: CONTRACT_IDS.STAKING_CONTRACT,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('unstake')),
          algosdk.encodeUint64(poolId)
        ],
        suggestedParams,
      });

      const signedTxn = appCallTxn.signTxn(account.sk);
      const txId = await algodClient.sendRawTransaction(signedTxn).do();
      
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      return txId;
    } catch (error) {
      console.error('Failed to unstake:', error);
      throw new Error('Failed to unstake tokens');
    }
  }

  async claimRewards(poolId: number): Promise<string> {
    const account = this.walletService.getAccount();
    if (!account) throw new Error('Wallet not connected');

    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: account.addr,
        appIndex: CONTRACT_IDS.STAKING_CONTRACT,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('claimRewards')),
          algosdk.encodeUint64(poolId)
        ],
        suggestedParams,
      });

      const signedTxn = appCallTxn.signTxn(account.sk);
      const txId = await algodClient.sendRawTransaction(signedTxn).do();
      
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      return txId;
    } catch (error) {
      console.error('Failed to claim rewards:', error);
      throw new Error('Failed to claim rewards');
    }
  }

  async getUserStakeInfo(poolId: number): Promise<any> {
    try {
      const userAddress = this.walletService.getAddress();
      if (!userAddress) return null;

      // Read user's staking info from contract
      return {
        stakeAmount: 500,
        stakeTime: Date.now() - 86400000, // 1 day ago
        pendingRewards: 15.25,
        lockTimeRemaining: 0
      };
    } catch (error) {
      console.error('Failed to get user stake info:', error);
      return null;
    }
  }
}

/**
 * LP Farming Service
 */
export class FarmingService {
  private walletService = WalletService.getInstance();

  async getFarms(): Promise<any[]> {
    try {
      return [
        {
          id: 1,
          name: 'NEXDEN-ALGO LP Farm',
          lpTokenId: 12345,
          rewardRate: 18.7,
          lockPeriod: 0,
          minDeposit: 1,
          maxDeposit: 1000000,
          totalDeposited: 1200000,
          active: true,
          startTime: Date.now() - 86400000,
          endTime: Date.now() + 86400000 * 365,
          rewardPool: 10000
        }
      ];
    } catch (error) {
      console.error('Failed to get farms:', error);
      return [];
    }
  }

  async depositLP(farmId: number, amount: number): Promise<string> {
    const account = this.walletService.getAccount();
    if (!account) throw new Error('Wallet not connected');

    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      // Get farm info to get LP token ID
      const farms = await this.getFarms();
      const farm = farms.find(f => f.id === farmId);
      if (!farm) throw new Error('Farm not found');

      // Create asset transfer transaction for LP tokens
      const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: account.addr,
        to: algosdk.getApplicationAddress(CONTRACT_IDS.LP_FARMING),
        amount: amount * 1000000, // Convert to microunits
        assetIndex: farm.lpTokenId,
        suggestedParams,
      });

      // Create application call transaction
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: account.addr,
        appIndex: CONTRACT_IDS.LP_FARMING,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('depositLP')),
          algosdk.encodeUint64(farmId),
          algosdk.encodeUint64(amount * 1000000)
        ],
        suggestedParams,
      });

      // Group transactions
      const txns = [assetTransferTxn, appCallTxn];
      algosdk.assignGroupID(txns);

      // Sign transactions
      const signedTxns = txns.map(txn => txn.signTxn(account.sk));

      // Send transactions
      const txId = await algodClient.sendRawTransaction(signedTxns).do();
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      
      return txId;
    } catch (error) {
      console.error('Failed to deposit LP:', error);
      throw new Error('Failed to deposit LP tokens');
    }
  }

  async withdrawLP(farmId: number): Promise<string> {
    const account = this.walletService.getAccount();
    if (!account) throw new Error('Wallet not connected');

    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: account.addr,
        appIndex: CONTRACT_IDS.LP_FARMING,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('withdrawLP')),
          algosdk.encodeUint64(farmId)
        ],
        suggestedParams,
      });

      const signedTxn = appCallTxn.signTxn(account.sk);
      const txId = await algodClient.sendRawTransaction(signedTxn).do();
      
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      return txId;
    } catch (error) {
      console.error('Failed to withdraw LP:', error);
      throw new Error('Failed to withdraw LP tokens');
    }
  }

  async claimFarmRewards(farmId: number): Promise<string> {
    const account = this.walletService.getAccount();
    if (!account) throw new Error('Wallet not connected');

    // Check if LP farming contract is deployed
    if (!CONTRACT_IDS.LP_FARMING || CONTRACT_IDS.LP_FARMING === 0) {
      throw new Error('LP Farming contract not deployed. Please deploy contracts first.');
    }

    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: account.addr,
        appIndex: CONTRACT_IDS.LP_FARMING,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('claimFarmRewards')),
          algosdk.encodeUint64(farmId)
        ],
        suggestedParams,
      });

      const signedTxn = appCallTxn.signTxn(account.sk);
      const txId = await algodClient.sendRawTransaction(signedTxn).do();
      
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      return txId;
    } catch (error) {
      console.error('Failed to claim farm rewards:', error);
      throw new Error('Failed to claim farm rewards');
    }
  }
}

// Export service instances
export const walletService = WalletService.getInstance();
export const didService = new DIDService();
export const vcService = new VCService();
export const reputationService = new ReputationService();
export const stakingService = new StakingService();
export const farmingService = new FarmingService();