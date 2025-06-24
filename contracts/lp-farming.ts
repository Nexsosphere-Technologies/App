import { Contract } from '@algorandfoundation/tealscript';

/**
 * LP Farming Contract
 * 
 * Allows users to farm liquidity provider (LP) tokens to earn NEXDEN rewards.
 * Supports multiple farming pools with different reward rates and lock periods.
 */
export class LPFarmingContract extends Contract {
  // Contract configuration
  admin = GlobalStateKey<Address>('admin');
  nexdenTokenId = GlobalStateKey<uint64>('nexden_token_id');
  reputationContract = GlobalStateKey<Address>('reputation_contract');
  paused = GlobalStateKey<boolean>('paused');
  
  // Farm configuration
  farmCount = GlobalStateKey<uint64>('farm_count');
  totalRewardsDistributed = GlobalStateKey<uint64>('total_rewards_distributed');
  
  // Farm data structure
  farmExists = GlobalStateMap<uint64, boolean>('farm_exists');
  farmName = GlobalStateMap<uint64, string>('farm_name');
  farmLpTokenId = GlobalStateMap<uint64, uint64>('farm_lp_token_id');
  farmRewardRate = GlobalStateMap<uint64, uint64>('farm_reward_rate'); // rewards per second per LP token
  farmLockPeriod = GlobalStateMap<uint64, uint64>('farm_lock_period'); // in seconds
  farmMinDeposit = GlobalStateMap<uint64, uint64>('farm_min_deposit');
  farmMaxDeposit = GlobalStateMap<uint64, uint64>('farm_max_deposit');
  farmTotalDeposited = GlobalStateMap<uint64, uint64>('farm_total_deposited');
  farmActive = GlobalStateMap<uint64, boolean>('farm_active');
  farmStartTime = GlobalStateMap<uint64, uint64>('farm_start_time');
  farmEndTime = GlobalStateMap<uint64, uint64>('farm_end_time');
  farmRewardPool = GlobalStateMap<uint64, uint64>('farm_reward_pool');
  
  // User farming data
  userDepositAmount = LocalStateMap<uint64, uint64>('user_deposit_amount'); // farmId -> amount
  userDepositTime = LocalStateMap<uint64, uint64>('user_deposit_time'); // farmId -> timestamp
  userLastClaim = LocalStateMap<uint64, uint64>('user_last_claim'); // farmId -> timestamp
  userTotalDeposited = LocalStateKey<uint64>('user_total_deposited');
  userTotalRewards = LocalStateKey<uint64>('user_total_rewards');
  userReputationMultiplier = LocalStateKey<uint64>('user_reputation_multiplier');

  /**
   * Initialize the LP farming contract
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
    this.farmCount.value = 0;
    this.totalRewardsDistributed.value = 0;
  }

  /**
   * Opt user into the farming contract
   */
  optIn(): void {
    this.userTotalDeposited(this.txn.sender).value = 0;
    this.userTotalRewards(this.txn.sender).value = 0;
    this.userReputationMultiplier(this.txn.sender).value = 10000; // 100% (basis points)
  }

  /**
   * Create a new farming pool (admin only)
   */
  createFarm(
    name: string,
    lpTokenId: uint64,
    rewardRate: uint64,
    lockPeriod: uint64,
    minDeposit: uint64,
    maxDeposit: uint64,
    startTime: uint64,
    endTime: uint64,
    rewardPool: uint64
  ): uint64 {
    this.verifyAdmin();
    assert(startTime < endTime, 'Invalid time range');
    assert(rewardRate > 0, 'Invalid reward rate');
    
    const farmId = this.farmCount.value + 1;
    this.farmCount.value = farmId;
    
    this.farmExists(farmId).value = true;
    this.farmName(farmId).value = name;
    this.farmLpTokenId(farmId).value = lpTokenId;
    this.farmRewardRate(farmId).value = rewardRate;
    this.farmLockPeriod(farmId).value = lockPeriod;
    this.farmMinDeposit(farmId).value = minDeposit;
    this.farmMaxDeposit(farmId).value = maxDeposit;
    this.farmTotalDeposited(farmId).value = 0;
    this.farmActive(farmId).value = true;
    this.farmStartTime(farmId).value = startTime;
    this.farmEndTime(farmId).value = endTime;
    this.farmRewardPool(farmId).value = rewardPool;
    
    return farmId;
  }

  /**
   * Deposit LP tokens to farm
   */
  depositLP(farmId: uint64, amount: uint64): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.farmExists(farmId).value, 'Farm does not exist');
    assert(this.farmActive(farmId).value, 'Farm is not active');
    
    const currentTime = Global.latestTimestamp;
    const startTime = this.farmStartTime(farmId).value;
    const endTime = this.farmEndTime(farmId).value;
    
    assert(currentTime >= startTime, 'Farm has not started');
    assert(currentTime <= endTime, 'Farm has ended');
    
    const minDeposit = this.farmMinDeposit(farmId).value;
    const maxDeposit = this.farmMaxDeposit(farmId).value;
    
    assert(amount >= minDeposit, 'Amount below minimum deposit');
    assert(amount <= maxDeposit, 'Amount above maximum deposit');
    
    // Check if user already has deposit in this farm
    const currentDeposit = this.userDepositAmount(this.txn.sender, farmId).value;
    assert(currentDeposit === 0, 'Already deposited in this farm');
    
    // Verify LP token transfer
    const lpTokenId = this.farmLpTokenId(farmId).value;
    assert(this.txn.assetTransfer !== undefined, 'Asset transfer required');
    assert(this.txn.assetTransfer.xferAsset.id === lpTokenId, 'Wrong LP token');
    assert(this.txn.assetTransfer.assetAmount === amount, 'Amount mismatch');
    
    // Update user state
    this.userDepositAmount(this.txn.sender, farmId).value = amount;
    this.userDepositTime(this.txn.sender, farmId).value = currentTime;
    this.userLastClaim(this.txn.sender, farmId).value = currentTime;
    this.userTotalDeposited(this.txn.sender).value = this.userTotalDeposited(this.txn.sender).value + amount;
    
    // Update farm state
    this.farmTotalDeposited(farmId).value = this.farmTotalDeposited(farmId).value + amount;
    
    // Update reputation score for LP farming
    this.updateReputationScore(this.txn.sender, amount, true);
  }

  /**
   * Withdraw LP tokens from farm
   */
  withdrawLP(farmId: uint64): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.farmExists(farmId).value, 'Farm does not exist');
    
    const depositAmount = this.userDepositAmount(this.txn.sender, farmId).value;
    assert(depositAmount > 0, 'No deposit in this farm');
    
    const depositTime = this.userDepositTime(this.txn.sender, farmId).value;
    const lockPeriod = this.farmLockPeriod(farmId).value;
    
    // Check if lock period has passed
    if (lockPeriod > 0) {
      assert(
        Global.latestTimestamp >= depositTime + lockPeriod,
        'Deposit is still locked'
      );
    }
    
    // Claim pending rewards first
    this.claimFarmRewards(farmId);
    
    // Update user state
    this.userDepositAmount(this.txn.sender, farmId).delete();
    this.userDepositTime(this.txn.sender, farmId).delete();
    this.userLastClaim(this.txn.sender, farmId).delete();
    this.userTotalDeposited(this.txn.sender).value = this.userTotalDeposited(this.txn.sender).value - depositAmount;
    
    // Update farm state
    this.farmTotalDeposited(farmId).value = this.farmTotalDeposited(farmId).value - depositAmount;
    
    // Return LP tokens
    const lpTokenId = this.farmLpTokenId(farmId).value;
    sendAssetTransfer({
      assetReceiver: this.txn.sender,
      assetAmount: depositAmount,
      xferAsset: AssetID.fromUint64(lpTokenId),
    });
    
    // Update reputation score
    this.updateReputationScore(this.txn.sender, depositAmount, false);
  }

  /**
   * Claim farming rewards
   */
  claimFarmRewards(farmId: uint64): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.farmExists(farmId).value, 'Farm does not exist');
    
    const depositAmount = this.userDepositAmount(this.txn.sender, farmId).value;
    assert(depositAmount > 0, 'No deposit in this farm');
    
    const rewards = this.calculateFarmRewards(this.txn.sender, farmId);
    
    if (rewards > 0) {
      // Check if farm has enough rewards
      const farmRewardPool = this.farmRewardPool(farmId).value;
      assert(farmRewardPool >= rewards, 'Insufficient farm reward pool');
      
      // Update last claim time
      this.userLastClaim(this.txn.sender, farmId).value = Global.latestTimestamp;
      
      // Apply reputation multiplier
      const reputationMultiplier = this.userReputationMultiplier(this.txn.sender).value;
      const bonusRewards = (rewards * (reputationMultiplier - 10000)) / 10000; // bonus above 100%
      const totalRewards = rewards + bonusRewards;
      
      // Update farm reward pool
      this.farmRewardPool(farmId).value = farmRewardPool - totalRewards;
      
      // Update user total rewards
      this.userTotalRewards(this.txn.sender).value = this.userTotalRewards(this.txn.sender).value + totalRewards;
      
      // Update global rewards distributed
      this.totalRewardsDistributed.value = this.totalRewardsDistributed.value + totalRewards;
      
      // Send NEXDEN rewards
      sendAssetTransfer({
        assetReceiver: this.txn.sender,
        assetAmount: totalRewards,
        xferAsset: AssetID.fromUint64(this.nexdenTokenId.value),
      });
    }
  }

  /**
   * Calculate pending farming rewards
   */
  calculateFarmRewards(user: Address, farmId: uint64): uint64 {
    const depositAmount = this.userDepositAmount(user, farmId).value;
    if (depositAmount === 0) return 0;
    
    const lastClaim = this.userLastClaim(user, farmId).value;
    const rewardRate = this.farmRewardRate(farmId).value;
    const endTime = this.farmEndTime(farmId).value;
    
    // Calculate time for rewards (up to farm end time)
    const currentTime = Math.min(Global.latestTimestamp, endTime);
    const timeDiff = currentTime - lastClaim;
    
    if (timeDiff <= 0) return 0;
    
    // Calculate rewards: depositAmount * rewardRate * timeDiff
    const rewards = depositAmount * rewardRate * timeDiff;
    
    return rewards;
  }

  /**
   * Emergency withdraw (admin only, for farm issues)
   */
  emergencyWithdraw(farmId: uint64, user: Address): void {
    this.verifyAdmin();
    assert(this.farmExists(farmId).value, 'Farm does not exist');
    
    const depositAmount = this.userDepositAmount(user, farmId).value;
    assert(depositAmount > 0, 'No deposit in this farm');
    
    // Update user state
    this.userDepositAmount(user, farmId).delete();
    this.userDepositTime(user, farmId).delete();
    this.userLastClaim(user, farmId).delete();
    this.userTotalDeposited(user).value = this.userTotalDeposited(user).value - depositAmount;
    
    // Update farm state
    this.farmTotalDeposited(farmId).value = this.farmTotalDeposited(farmId).value - depositAmount;
    
    // Return LP tokens
    const lpTokenId = this.farmLpTokenId(farmId).value;
    sendAssetTransfer({
      assetReceiver: user,
      assetAmount: depositAmount,
      xferAsset: AssetID.fromUint64(lpTokenId),
    });
  }

  /**
   * Update farm parameters (admin only)
   */
  updateFarm(
    farmId: uint64,
    rewardRate: uint64,
    endTime: uint64,
    active: boolean
  ): void {
    this.verifyAdmin();
    assert(this.farmExists(farmId).value, 'Farm does not exist');
    
    this.farmRewardRate(farmId).value = rewardRate;
    this.farmEndTime(farmId).value = endTime;
    this.farmActive(farmId).value = active;
  }

  /**
   * Add rewards to farm pool (admin only)
   */
  addFarmRewards(farmId: uint64, amount: uint64): void {
    this.verifyAdmin();
    assert(this.farmExists(farmId).value, 'Farm does not exist');
    
    // Verify NEXDEN transfer
    assert(this.txn.assetTransfer !== undefined, 'Asset transfer required');
    assert(this.txn.assetTransfer.xferAsset.id === this.nexdenTokenId.value, 'Wrong asset');
    assert(this.txn.assetTransfer.assetAmount === amount, 'Amount mismatch');
    
    this.farmRewardPool(farmId).value = this.farmRewardPool(farmId).value + amount;
  }

  /**
   * Set user reputation multiplier (reputation contract only)
   */
  setReputationMultiplier(user: Address, multiplier: uint64): void {
    assert(this.txn.sender === this.reputationContract.value, 'Only reputation contract');
    this.userReputationMultiplier(user).value = multiplier;
  }

  /**
   * Get user farming information
   */
  getUserFarmInfo(user: Address, farmId: uint64): {
    depositAmount: uint64;
    depositTime: uint64;
    pendingRewards: uint64;
    lockTimeRemaining: uint64;
  } {
    const depositAmount = this.userDepositAmount(user, farmId).value;
    const depositTime = this.userDepositTime(user, farmId).value;
    const pendingRewards = this.calculateFarmRewards(user, farmId);
    
    const lockPeriod = this.farmLockPeriod(farmId).value;
    const lockTimeRemaining = lockPeriod > 0 ? 
      Math.max(0, (depositTime + lockPeriod) - Global.latestTimestamp) : 0;
    
    return {
      depositAmount,
      depositTime,
      pendingRewards,
      lockTimeRemaining,
    };
  }

  /**
   * Get farm information
   */
  getFarmInfo(farmId: uint64): {
    name: string;
    lpTokenId: uint64;
    rewardRate: uint64;
    lockPeriod: uint64;
    minDeposit: uint64;
    maxDeposit: uint64;
    totalDeposited: uint64;
    active: boolean;
    startTime: uint64;
    endTime: uint64;
    rewardPool: uint64;
  } {
    return {
      name: this.farmName(farmId).value,
      lpTokenId: this.farmLpTokenId(farmId).value,
      rewardRate: this.farmRewardRate(farmId).value,
      lockPeriod: this.farmLockPeriod(farmId).value,
      minDeposit: this.farmMinDeposit(farmId).value,
      maxDeposit: this.farmMaxDeposit(farmId).value,
      totalDeposited: this.farmTotalDeposited(farmId).value,
      active: this.farmActive(farmId).value,
      startTime: this.farmStartTime(farmId).value,
      endTime: this.farmEndTime(farmId).value,
      rewardPool: this.farmRewardPool(farmId).value,
    };
  }

  /**
   * Update reputation score (internal call to reputation contract)
   */
  private updateReputationScore(user: Address, amount: uint64, isDepositing: boolean): void {
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