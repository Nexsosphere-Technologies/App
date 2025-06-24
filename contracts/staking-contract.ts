import { Contract } from '@algorandfoundation/tealscript';

/**
 * NEXDEN Staking Contract
 * 
 * Allows users to stake NEXDEN tokens to earn rewards and contribute to their reputation score.
 * Supports multiple staking pools with different lock periods and reward rates.
 */
export class StakingContract extends Contract {
  // Contract configuration
  admin = GlobalStateKey<Address>('admin');
  nexdenTokenId = GlobalStateKey<uint64>('nexden_token_id');
  reputationContract = GlobalStateKey<Address>('reputation_contract');
  paused = GlobalStateKey<boolean>('paused');
  
  // Pool configuration
  poolCount = GlobalStateKey<uint64>('pool_count');
  
  // Pool data structure
  poolExists = GlobalStateMap<uint64, boolean>('pool_exists');
  poolName = GlobalStateMap<uint64, string>('pool_name');
  poolLockPeriod = GlobalStateMap<uint64, uint64>('pool_lock_period'); // in seconds
  poolApy = GlobalStateMap<uint64, uint64>('pool_apy'); // basis points (10000 = 100%)
  poolMinStake = GlobalStateMap<uint64, uint64>('pool_min_stake');
  poolMaxStake = GlobalStateMap<uint64, uint64>('pool_max_stake');
  poolTotalStaked = GlobalStateMap<uint64, uint64>('pool_total_staked');
  poolActive = GlobalStateMap<uint64, boolean>('pool_active');
  
  // User staking data
  userStakeAmount = LocalStateMap<uint64, uint64>('user_stake_amount'); // poolId -> amount
  userStakeTime = LocalStateMap<uint64, uint64>('user_stake_time'); // poolId -> timestamp
  userLastClaim = LocalStateMap<uint64, uint64>('user_last_claim'); // poolId -> timestamp
  userTotalStaked = LocalStateKey<uint64>('user_total_staked');
  userReputationBonus = LocalStateKey<uint64>('user_reputation_bonus');

  /**
   * Initialize the staking contract
   */
  createApplication(
    nexdenToken: uint64,
    reputationContractAddress: Address
  ): void {
    assert(this.txn.sender === this.app.creator);
    
    this.admin.value = this.txn.sender;
    this.nexdenTokenId.value = nexdenToken;
    this.reputationContract.value = reputationContractAddress;
    this.paused.value = false;
    this.poolCount.value = 0;
  }

  /**
   * Opt user into the staking contract
   */
  optIn(): void {
    // Initialize user state
    this.userTotalStaked(this.txn.sender).value = 0;
    this.userReputationBonus(this.txn.sender).value = 0;
  }

  /**
   * Create a new staking pool (admin only)
   */
  createPool(
    name: string,
    lockPeriod: uint64,
    apy: uint64,
    minStake: uint64,
    maxStake: uint64
  ): uint64 {
    this.verifyAdmin();
    
    const poolId = this.poolCount.value + 1;
    this.poolCount.value = poolId;
    
    this.poolExists(poolId).value = true;
    this.poolName(poolId).value = name;
    this.poolLockPeriod(poolId).value = lockPeriod;
    this.poolApy(poolId).value = apy;
    this.poolMinStake(poolId).value = minStake;
    this.poolMaxStake(poolId).value = maxStake;
    this.poolTotalStaked(poolId).value = 0;
    this.poolActive(poolId).value = true;
    
    return poolId;
  }

  /**
   * Stake tokens in a specific pool
   */
  stake(poolId: uint64, amount: uint64): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.poolExists(poolId).value, 'Pool does not exist');
    assert(this.poolActive(poolId).value, 'Pool is not active');
    
    const minStake = this.poolMinStake(poolId).value;
    const maxStake = this.poolMaxStake(poolId).value;
    
    assert(amount >= minStake, 'Amount below minimum stake');
    assert(amount <= maxStake, 'Amount above maximum stake');
    
    // Check if user already has stake in this pool
    const currentStake = this.userStakeAmount(this.txn.sender, poolId).value;
    assert(currentStake === 0, 'Already staked in this pool');
    
    // Verify asset transfer
    assert(this.txn.assetTransfer !== undefined, 'Asset transfer required');
    assert(this.txn.assetTransfer.xferAsset.id === this.nexdenTokenId.value, 'Wrong asset');
    assert(this.txn.assetTransfer.assetAmount === amount, 'Amount mismatch');
    
    // Update user state
    this.userStakeAmount(this.txn.sender, poolId).value = amount;
    this.userStakeTime(this.txn.sender, poolId).value = Global.latestTimestamp;
    this.userLastClaim(this.txn.sender, poolId).value = Global.latestTimestamp;
    this.userTotalStaked(this.txn.sender).value = this.userTotalStaked(this.txn.sender).value + amount;
    
    // Update pool state
    this.poolTotalStaked(poolId).value = this.poolTotalStaked(poolId).value + amount;
    
    // Update reputation score
    this.updateReputationScore(this.txn.sender, amount, true);
  }

  /**
   * Unstake tokens from a pool
   */
  unstake(poolId: uint64): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.poolExists(poolId).value, 'Pool does not exist');
    
    const stakeAmount = this.userStakeAmount(this.txn.sender, poolId).value;
    assert(stakeAmount > 0, 'No stake in this pool');
    
    const stakeTime = this.userStakeTime(this.txn.sender, poolId).value;
    const lockPeriod = this.poolLockPeriod(poolId).value;
    
    // Check if lock period has passed
    if (lockPeriod > 0) {
      assert(
        Global.latestTimestamp >= stakeTime + lockPeriod,
        'Stake is still locked'
      );
    }
    
    // Claim pending rewards first
    this.claimRewards(poolId);
    
    // Update user state
    this.userStakeAmount(this.txn.sender, poolId).delete();
    this.userStakeTime(this.txn.sender, poolId).delete();
    this.userLastClaim(this.txn.sender, poolId).delete();
    this.userTotalStaked(this.txn.sender).value = this.userTotalStaked(this.txn.sender).value - stakeAmount;
    
    // Update pool state
    this.poolTotalStaked(poolId).value = this.poolTotalStaked(poolId).value - stakeAmount;
    
    // Return staked tokens
    sendAssetTransfer({
      assetReceiver: this.txn.sender,
      assetAmount: stakeAmount,
      xferAsset: AssetID.fromUint64(this.nexdenTokenId.value),
    });
    
    // Update reputation score
    this.updateReputationScore(this.txn.sender, stakeAmount, false);
  }

  /**
   * Claim staking rewards
   */
  claimRewards(poolId: uint64): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.poolExists(poolId).value, 'Pool does not exist');
    
    const stakeAmount = this.userStakeAmount(this.txn.sender, poolId).value;
    assert(stakeAmount > 0, 'No stake in this pool');
    
    const rewards = this.calculateRewards(this.txn.sender, poolId);
    
    if (rewards > 0) {
      // Update last claim time
      this.userLastClaim(this.txn.sender, poolId).value = Global.latestTimestamp;
      
      // Apply reputation bonus
      const reputationBonus = this.userReputationBonus(this.txn.sender).value;
      const bonusRewards = (rewards * reputationBonus) / 10000; // basis points
      const totalRewards = rewards + bonusRewards;
      
      // Send rewards
      sendAssetTransfer({
        assetReceiver: this.txn.sender,
        assetAmount: totalRewards,
        xferAsset: AssetID.fromUint64(this.nexdenTokenId.value),
      });
    }
  }

  /**
   * Calculate pending rewards for a user in a pool
   */
  calculateRewards(user: Address, poolId: uint64): uint64 {
    const stakeAmount = this.userStakeAmount(user, poolId).value;
    if (stakeAmount === 0) return 0;
    
    const lastClaim = this.userLastClaim(user, poolId).value;
    const timeDiff = Global.latestTimestamp - lastClaim;
    const apy = this.poolApy(poolId).value;
    
    // Calculate rewards: (stakeAmount * apy * timeDiff) / (365 * 24 * 3600 * 10000)
    const yearInSeconds = 365 * 24 * 3600;
    const rewards = (stakeAmount * apy * timeDiff) / (yearInSeconds * 10000);
    
    return rewards;
  }

  /**
   * Update pool parameters (admin only)
   */
  updatePool(
    poolId: uint64,
    apy: uint64,
    minStake: uint64,
    maxStake: uint64,
    active: boolean
  ): void {
    this.verifyAdmin();
    assert(this.poolExists(poolId).value, 'Pool does not exist');
    
    this.poolApy(poolId).value = apy;
    this.poolMinStake(poolId).value = minStake;
    this.poolMaxStake(poolId).value = maxStake;
    this.poolActive(poolId).value = active;
  }

  /**
   * Set user reputation bonus (reputation contract only)
   */
  setReputationBonus(user: Address, bonus: uint64): void {
    assert(this.txn.sender === this.reputationContract.value, 'Only reputation contract');
    this.userReputationBonus(user).value = bonus;
  }

  /**
   * Get user staking information
   */
  getUserStakeInfo(user: Address, poolId: uint64): {
    stakeAmount: uint64;
    stakeTime: uint64;
    pendingRewards: uint64;
    lockTimeRemaining: uint64;
  } {
    const stakeAmount = this.userStakeAmount(user, poolId).value;
    const stakeTime = this.userStakeTime(user, poolId).value;
    const pendingRewards = this.calculateRewards(user, poolId);
    
    const lockPeriod = this.poolLockPeriod(poolId).value;
    const lockTimeRemaining = lockPeriod > 0 ? 
      Math.max(0, (stakeTime + lockPeriod) - Global.latestTimestamp) : 0;
    
    return {
      stakeAmount,
      stakeTime,
      pendingRewards,
      lockTimeRemaining,
    };
  }

  /**
   * Get pool information
   */
  getPoolInfo(poolId: uint64): {
    name: string;
    lockPeriod: uint64;
    apy: uint64;
    minStake: uint64;
    maxStake: uint64;
    totalStaked: uint64;
    active: boolean;
  } {
    return {
      name: this.poolName(poolId).value,
      lockPeriod: this.poolLockPeriod(poolId).value,
      apy: this.poolApy(poolId).value,
      minStake: this.poolMinStake(poolId).value,
      maxStake: this.poolMaxStake(poolId).value,
      totalStaked: this.poolTotalStaked(poolId).value,
      active: this.poolActive(poolId).value,
    };
  }

  /**
   * Update reputation score (internal call to reputation contract)
   */
  private updateReputationScore(user: Address, amount: uint64, isStaking: boolean): void {
    // This would make an inner transaction to the reputation contract
    // Implementation depends on the reputation contract interface
  }

  /**
   * Pause/unpause contract (admin only)
   */
  setPaused(pauseState: boolean): void {
    this.verifyAdmin();
    this.paused.value = pauseState;
  }

  /**
   * Verify admin privileges
   */
  private verifyAdmin(): void {
    assert(this.txn.sender === this.admin.value, 'Admin only');
  }
}