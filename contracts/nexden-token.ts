import { Contract } from '@algorandfoundation/tealscript';

/**
 * NexDen Token (NEXDEN) - ASA Contract
 * 
 * This contract defines the NexDen token as an Algorand Standard Asset (ASA)
 * with additional functionality for governance, staking rewards, and ecosystem integration.
 */
export class NexDenToken extends Contract {
  // Token metadata
  tokenName = GlobalStateKey<string>('token_name');
  tokenSymbol = GlobalStateKey<string>('token_symbol');
  tokenDecimals = GlobalStateKey<uint64>('token_decimals');
  totalSupply = GlobalStateKey<uint64>('total_supply');
  
  // Governance and control
  admin = GlobalStateKey<Address>('admin');
  paused = GlobalStateKey<boolean>('paused');
  
  // Staking and rewards
  stakingContract = GlobalStateKey<Address>('staking_contract');
  rewardPool = GlobalStateKey<uint64>('reward_pool');
  
  // Ecosystem integration
  authorizedMinters = GlobalStateMap<Address, boolean>('authorized_minters');
  burnEnabled = GlobalStateKey<boolean>('burn_enabled');

  /**
   * Initialize the NexDen token contract
   */
  createApplication(
    name: string,
    symbol: string,
    decimals: uint64,
    initialSupply: uint64,
    adminAddress: Address
  ): void {
    // Verify caller is the creator
    assert(this.txn.sender === this.app.creator);
    
    // Set token metadata
    this.tokenName.value = name;
    this.tokenSymbol.value = symbol;
    this.tokenDecimals.value = decimals;
    this.totalSupply.value = initialSupply;
    
    // Set admin
    this.admin.value = adminAddress;
    this.paused.value = false;
    this.burnEnabled.value = false;
    
    // Initialize reward pool
    this.rewardPool.value = 0;
  }

  /**
   * Set the staking contract address (admin only)
   */
  setStakingContract(stakingAddress: Address): void {
    this.verifyAdmin();
    this.stakingContract.value = stakingAddress;
  }

  /**
   * Add authorized minter (admin only)
   */
  addAuthorizedMinter(minterAddress: Address): void {
    this.verifyAdmin();
    this.authorizedMinters(minterAddress).value = true;
  }

  /**
   * Remove authorized minter (admin only)
   */
  removeAuthorizedMinter(minterAddress: Address): void {
    this.verifyAdmin();
    this.authorizedMinters(minterAddress).delete();
  }

  /**
   * Mint new tokens (authorized minters only)
   */
  mint(recipient: Address, amount: uint64): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(
      this.txn.sender === this.admin.value || 
      this.authorizedMinters(this.txn.sender).value,
      'Unauthorized minter'
    );
    
    // Update total supply
    this.totalSupply.value = this.totalSupply.value + amount;
    
    // Transfer tokens to recipient
    sendAssetTransfer({
      assetReceiver: recipient,
      assetAmount: amount,
      xferAsset: AssetID.fromUint64(this.app.id),
    });
  }

  /**
   * Burn tokens (if enabled)
   */
  burn(amount: uint64): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.burnEnabled.value, 'Burning is disabled');
    
    // Verify sender has sufficient balance
    const senderBalance = this.getAssetBalance(this.txn.sender);
    assert(senderBalance >= amount, 'Insufficient balance');
    
    // Update total supply
    this.totalSupply.value = this.totalSupply.value - amount;
    
    // Burn tokens by sending to zero address
    sendAssetTransfer({
      assetReceiver: Address.zeroAddress,
      assetAmount: amount,
      xferAsset: AssetID.fromUint64(this.app.id),
    });
  }

  /**
   * Add tokens to reward pool (staking contract only)
   */
  addToRewardPool(amount: uint64): void {
    assert(this.txn.sender === this.stakingContract.value, 'Only staking contract');
    this.rewardPool.value = this.rewardPool.value + amount;
  }

  /**
   * Distribute rewards from pool (staking contract only)
   */
  distributeRewards(recipient: Address, amount: uint64): void {
    assert(this.txn.sender === this.stakingContract.value, 'Only staking contract');
    assert(this.rewardPool.value >= amount, 'Insufficient reward pool');
    
    this.rewardPool.value = this.rewardPool.value - amount;
    
    sendAssetTransfer({
      assetReceiver: recipient,
      assetAmount: amount,
      xferAsset: AssetID.fromUint64(this.app.id),
    });
  }

  /**
   * Pause/unpause contract (admin only)
   */
  setPaused(pauseState: boolean): void {
    this.verifyAdmin();
    this.paused.value = pauseState;
  }

  /**
   * Enable/disable burning (admin only)
   */
  setBurnEnabled(burnState: boolean): void {
    this.verifyAdmin();
    this.burnEnabled.value = burnState;
  }

  /**
   * Transfer admin rights (admin only)
   */
  transferAdmin(newAdmin: Address): void {
    this.verifyAdmin();
    this.admin.value = newAdmin;
  }

  /**
   * Get token information
   */
  getTokenInfo(): {
    name: string;
    symbol: string;
    decimals: uint64;
    totalSupply: uint64;
    rewardPool: uint64;
    paused: boolean;
  } {
    return {
      name: this.tokenName.value,
      symbol: this.tokenSymbol.value,
      decimals: this.tokenDecimals.value,
      totalSupply: this.totalSupply.value,
      rewardPool: this.rewardPool.value,
      paused: this.paused.value,
    };
  }

  /**
   * Get asset balance for an address
   */
  private getAssetBalance(address: Address): uint64 {
    return sendAssetTransfer({
      assetReceiver: address,
      assetAmount: 0,
      xferAsset: AssetID.fromUint64(this.app.id),
    }).assetBalance;
  }

  /**
   * Verify admin privileges
   */
  private verifyAdmin(): void {
    assert(this.txn.sender === this.admin.value, 'Admin only');
  }
}