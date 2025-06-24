import { useState, useEffect, useCallback } from 'react';
import {
  walletService,
  didService,
  vcService,
  reputationService,
  stakingService,
  farmingService,
  WalletService
} from '../services/algorand';

/**
 * Custom hook for Algorand wallet and contract interactions
 */
export const useAlgorand = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [nexdenBalance, setNexdenBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize wallet connection status
  useEffect(() => {
    const checkConnection = () => {
      const connected = walletService.isWalletConnected();
      setIsConnected(connected);
      if (connected) {
        setAddress(walletService.getAddress());
        updateBalances();
      }
    };

    checkConnection();
  }, []);

  const updateBalances = useCallback(async () => {
    try {
      const [algoBalance, nexdenBal] = await Promise.all([
        walletService.getBalance(),
        walletService.getNexdenBalance()
      ]);
      setBalance(algoBalance / 1000000); // Convert from microAlgos
      setNexdenBalance(nexdenBal / 1000000); // Convert from microNEXDEN
    } catch (err) {
      console.error('Failed to update balances:', err);
    }
  }, []);

  const connectWallet = useCallback(async (seedPhrase?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const walletAddress = await walletService.connectWallet(seedPhrase);
      setAddress(walletAddress);
      setIsConnected(true);
      await updateBalances();
      
      // Store connection in localStorage
      localStorage.setItem('nexdentify-wallet-connected', 'true');
      if (seedPhrase) {
        // In production, use secure storage
        localStorage.setItem('nexdentify-seed-phrase', seedPhrase);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  }, [updateBalances]);

  const disconnectWallet = useCallback(() => {
    walletService.disconnect();
    setIsConnected(false);
    setAddress('');
    setBalance(0);
    setNexdenBalance(0);
    
    // Clear localStorage
    localStorage.removeItem('nexdentify-wallet-connected');
    localStorage.removeItem('nexdentify-seed-phrase');
  }, []);

  const refreshBalances = useCallback(async () => {
    if (isConnected) {
      await updateBalances();
    }
  }, [isConnected, updateBalances]);

  return {
    // Wallet state
    isConnected,
    address,
    balance,
    nexdenBalance,
    loading,
    error,
    
    // Wallet actions
    connectWallet,
    disconnectWallet,
    refreshBalances,
    
    // Service instances
    didService,
    vcService,
    reputationService,
    stakingService,
    farmingService
  };
};

/**
 * Hook for DID operations
 */
export const useDID = () => {
  const { isConnected, address } = useAlgorand();
  const [userDID, setUserDID] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadUserDID();
    }
  }, [isConnected, address]);

  const loadUserDID = async () => {
    try {
      const primaryDID = await didService.getUserPrimaryDID(address);
      setUserDID(primaryDID);
    } catch (error) {
      console.error('Failed to load user DID:', error);
    }
  };

  const createDID = async (didDocument: string) => {
    setLoading(true);
    try {
      const didIdentifier = `did:algo:testnet:${address}`;
      const txId = await didService.createDID(didIdentifier, didDocument);
      await loadUserDID();
      return txId;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    userDID,
    loading,
    createDID,
    loadUserDID
  };
};

/**
 * Hook for reputation operations
 */
export const useReputation = () => {
  const { isConnected, address } = useAlgorand();
  const [reputation, setReputation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadReputation();
    }
  }, [isConnected, address]);

  const loadReputation = async () => {
    setLoading(true);
    try {
      const reputationData = await reputationService.getUserReputation(address);
      setReputation(reputationData);
    } catch (error) {
      console.error('Failed to load reputation:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAttestation = async (subject: string, weight: number, metadata: string) => {
    try {
      const txId = await reputationService.createAttestation(subject, weight, metadata);
      return txId;
    } catch (error) {
      throw error;
    }
  };

  const updateReputation = async () => {
    try {
      const txId = await reputationService.updateReputationScore();
      await loadReputation();
      return txId;
    } catch (error) {
      throw error;
    }
  };

  return {
    reputation,
    loading,
    loadReputation,
    createAttestation,
    updateReputation
  };
};

/**
 * Hook for staking operations
 */
export const useStaking = () => {
  const { isConnected, refreshBalances } = useAlgorand();
  const [pools, setPools] = useState<any[]>([]);
  const [userStakes, setUserStakes] = useState<Map<number, any>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadStakingData();
    }
  }, [isConnected]);

  const loadStakingData = async () => {
    setLoading(true);
    try {
      const stakingPools = await stakingService.getStakingPools();
      setPools(stakingPools);
      
      // Load user stake info for each pool
      const userStakeData = new Map();
      for (const pool of stakingPools) {
        const stakeInfo = await stakingService.getUserStakeInfo(pool.id);
        if (stakeInfo) {
          userStakeData.set(pool.id, stakeInfo);
        }
      }
      setUserStakes(userStakeData);
    } catch (error) {
      console.error('Failed to load staking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stake = async (poolId: number, amount: number) => {
    try {
      const txId = await stakingService.stake(poolId, amount);
      await loadStakingData();
      await refreshBalances();
      return txId;
    } catch (error) {
      throw error;
    }
  };

  const unstake = async (poolId: number) => {
    try {
      const txId = await stakingService.unstake(poolId);
      await loadStakingData();
      await refreshBalances();
      return txId;
    } catch (error) {
      throw error;
    }
  };

  const claimRewards = async (poolId: number) => {
    try {
      const txId = await stakingService.claimRewards(poolId);
      await loadStakingData();
      await refreshBalances();
      return txId;
    } catch (error) {
      throw error;
    }
  };

  return {
    pools,
    userStakes,
    loading,
    stake,
    unstake,
    claimRewards,
    loadStakingData
  };
};

/**
 * Hook for farming operations
 */
export const useFarming = () => {
  const { isConnected, refreshBalances } = useAlgorand();
  const [farms, setFarms] = useState<any[]>([]);
  const [userFarms, setUserFarms] = useState<Map<number, any>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadFarmingData();
    }
  }, [isConnected]);

  const loadFarmingData = async () => {
    setLoading(true);
    try {
      const farmingPools = await farmingService.getFarms();
      setFarms(farmingPools);
      
      // Load user farm info for each farm
      const userFarmData = new Map();
      for (const farm of farmingPools) {
        // This would call a getUserFarmInfo method
        // For now, using placeholder data
        userFarmData.set(farm.id, {
          depositAmount: 300,
          pendingRewards: 22.15
        });
      }
      setUserFarms(userFarmData);
    } catch (error) {
      console.error('Failed to load farming data:', error);
    } finally {
      setLoading(false);
    }
  };

  const depositLP = async (farmId: number, amount: number) => {
    try {
      const txId = await farmingService.depositLP(farmId, amount);
      await loadFarmingData();
      await refreshBalances();
      return txId;
    } catch (error) {
      throw error;
    }
  };

  const withdrawLP = async (farmId: number) => {
    try {
      const txId = await farmingService.withdrawLP(farmId);
      await loadFarmingData();
      await refreshBalances();
      return txId;
    } catch (error) {
      throw error;
    }
  };

  const claimFarmRewards = async (farmId: number) => {
    try {
      const txId = await farmingService.claimFarmRewards(farmId);
      await loadFarmingData();
      await refreshBalances();
      return txId;
    } catch (error) {
      throw error;
    }
  };

  return {
    farms,
    userFarms,
    loading,
    depositLP,
    withdrawLP,
    claimFarmRewards,
    loadFarmingData
  };
};