import { Contract } from '@algorandfoundation/tealscript';

/**
 * DID Registry Contract
 * 
 * Manages Decentralized Identifiers (DIDs) on Algorand blockchain.
 * Provides DID anchoring, resolution, and management functionality.
 */
export class DIDRegistry extends Contract {
  // Contract configuration
  admin = GlobalStateKey<Address>('admin');
  paused = GlobalStateKey<boolean>('paused');
  
  // DID management
  didCount = GlobalStateKey<uint64>('did_count');
  
  // DID data structure
  didExists = GlobalStateMap<string, boolean>('did_exists');
  didOwner = GlobalStateMap<string, Address>('did_owner');
  didDocument = GlobalStateMap<string, string>('did_document'); // IPFS hash or direct document
  didCreated = GlobalStateMap<string, uint64>('did_created');
  didUpdated = GlobalStateMap<string, uint64>('did_updated');
  didActive = GlobalStateMap<string, boolean>('did_active');
  didVersion = GlobalStateMap<string, uint64>('did_version');
  
  // DID controllers and delegates
  didControllers = GlobalStateMap<string, string>('did_controllers'); // comma-separated addresses
  didDelegates = GlobalStateMap<string, string>('did_delegates'); // comma-separated addresses
  
  // Service endpoints
  didServices = GlobalStateMap<string, string>('did_services'); // JSON string of services
  
  // User DID mapping
  userPrimaryDid = LocalStateKey<string>('user_primary_did');
  userDidCount = LocalStateKey<uint64>('user_did_count');

  /**
   * Initialize the DID registry contract
   */
  createApplication(): void {
    assert(this.txn.sender === this.app.creator);
    
    this.admin.value = this.txn.sender;
    this.paused.value = false;
    this.didCount.value = 0;
  }

  /**
   * Opt user into the DID registry
   */
  optIn(): void {
    this.userDidCount(this.txn.sender).value = 0;
  }

  /**
   * Create a new DID
   */
  createDID(
    didIdentifier: string,
    didDocument: string,
    controllers: string,
    services: string
  ): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(!this.didExists(didIdentifier).value, 'DID already exists');
    assert(didIdentifier.length > 0, 'Invalid DID identifier');
    
    // Validate DID format (did:algo:network:identifier)
    this.validateDIDFormat(didIdentifier);
    
    // Create DID
    this.didExists(didIdentifier).value = true;
    this.didOwner(didIdentifier).value = this.txn.sender;
    this.didDocument(didIdentifier).value = didDocument;
    this.didCreated(didIdentifier).value = Global.latestTimestamp;
    this.didUpdated(didIdentifier).value = Global.latestTimestamp;
    this.didActive(didIdentifier).value = true;
    this.didVersion(didIdentifier).value = 1;
    this.didControllers(didIdentifier).value = controllers;
    this.didServices(didIdentifier).value = services;
    
    // Update counters
    this.didCount.value = this.didCount.value + 1;
    this.userDidCount(this.txn.sender).value = this.userDidCount(this.txn.sender).value + 1;
    
    // Set as primary DID if it's the user's first
    if (this.userDidCount(this.txn.sender).value === 1) {
      this.userPrimaryDid(this.txn.sender).value = didIdentifier;
    }
  }

  /**
   * Update DID document
   */
  updateDIDDocument(
    didIdentifier: string,
    newDocument: string,
    newControllers: string,
    newServices: string
  ): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.didExists(didIdentifier).value, 'DID does not exist');
    this.verifyDIDControl(didIdentifier);
    
    // Update DID document
    this.didDocument(didIdentifier).value = newDocument;
    this.didUpdated(didIdentifier).value = Global.latestTimestamp;
    this.didVersion(didIdentifier).value = this.didVersion(didIdentifier).value + 1;
    this.didControllers(didIdentifier).value = newControllers;
    this.didServices(didIdentifier).value = newServices;
  }

  /**
   * Add delegate to DID
   */
  addDelegate(didIdentifier: string, delegateAddress: Address): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.didExists(didIdentifier).value, 'DID does not exist');
    this.verifyDIDControl(didIdentifier);
    
    const currentDelegates = this.didDelegates(didIdentifier).value;
    const delegateStr = delegateAddress.toString();
    
    // Check if delegate already exists
    if (currentDelegates.length === 0) {
      this.didDelegates(didIdentifier).value = delegateStr;
    } else {
      assert(!this.containsAddress(currentDelegates, delegateStr), 'Delegate already exists');
      this.didDelegates(didIdentifier).value = currentDelegates + ',' + delegateStr;
    }
    
    this.didUpdated(didIdentifier).value = Global.latestTimestamp;
    this.didVersion(didIdentifier).value = this.didVersion(didIdentifier).value + 1;
  }

  /**
   * Remove delegate from DID
   */
  removeDelegate(didIdentifier: string, delegateAddress: Address): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.didExists(didIdentifier).value, 'DID does not exist');
    this.verifyDIDControl(didIdentifier);
    
    const currentDelegates = this.didDelegates(didIdentifier).value;
    const delegateStr = delegateAddress.toString();
    
    assert(this.containsAddress(currentDelegates, delegateStr), 'Delegate does not exist');
    
    // Remove delegate from list
    const newDelegates = this.removeAddressFromList(currentDelegates, delegateStr);
    this.didDelegates(didIdentifier).value = newDelegates;
    
    this.didUpdated(didIdentifier).value = Global.latestTimestamp;
    this.didVersion(didIdentifier).value = this.didVersion(didIdentifier).value + 1;
  }

  /**
   * Transfer DID ownership
   */
  transferOwnership(didIdentifier: string, newOwner: Address): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.didExists(didIdentifier).value, 'DID does not exist');
    assert(this.didOwner(didIdentifier).value === this.txn.sender, 'Only owner can transfer');
    
    const oldOwner = this.didOwner(didIdentifier).value;
    
    // Update ownership
    this.didOwner(didIdentifier).value = newOwner;
    this.didUpdated(didIdentifier).value = Global.latestTimestamp;
    this.didVersion(didIdentifier).value = this.didVersion(didIdentifier).value + 1;
    
    // Update user counters
    this.userDidCount(oldOwner).value = this.userDidCount(oldOwner).value - 1;
    this.userDidCount(newOwner).value = this.userDidCount(newOwner).value + 1;
    
    // Update primary DID if necessary
    if (this.userPrimaryDid(oldOwner).value === didIdentifier) {
      this.userPrimaryDid(oldOwner).delete();
    }
    
    if (this.userDidCount(newOwner).value === 1) {
      this.userPrimaryDid(newOwner).value = didIdentifier;
    }
  }

  /**
   * Deactivate DID
   */
  deactivateDID(didIdentifier: string): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.didExists(didIdentifier).value, 'DID does not exist');
    this.verifyDIDControl(didIdentifier);
    
    this.didActive(didIdentifier).value = false;
    this.didUpdated(didIdentifier).value = Global.latestTimestamp;
    this.didVersion(didIdentifier).value = this.didVersion(didIdentifier).value + 1;
  }

  /**
   * Reactivate DID
   */
  reactivateDID(didIdentifier: string): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.didExists(didIdentifier).value, 'DID does not exist');
    this.verifyDIDControl(didIdentifier);
    
    this.didActive(didIdentifier).value = true;
    this.didUpdated(didIdentifier).value = Global.latestTimestamp;
    this.didVersion(didIdentifier).value = this.didVersion(didIdentifier).value + 1;
  }

  /**
   * Set primary DID for user
   */
  setPrimaryDID(didIdentifier: string): void {
    assert(this.didExists(didIdentifier).value, 'DID does not exist');
    assert(this.didOwner(didIdentifier).value === this.txn.sender, 'Not DID owner');
    assert(this.didActive(didIdentifier).value, 'DID is not active');
    
    this.userPrimaryDid(this.txn.sender).value = didIdentifier;
  }

  /**
   * Resolve DID document
   */
  resolveDID(didIdentifier: string): {
    owner: Address;
    document: string;
    created: uint64;
    updated: uint64;
    version: uint64;
    active: boolean;
    controllers: string;
    delegates: string;
    services: string;
  } {
    assert(this.didExists(didIdentifier).value, 'DID does not exist');
    
    return {
      owner: this.didOwner(didIdentifier).value,
      document: this.didDocument(didIdentifier).value,
      created: this.didCreated(didIdentifier).value,
      updated: this.didUpdated(didIdentifier).value,
      version: this.didVersion(didIdentifier).value,
      active: this.didActive(didIdentifier).value,
      controllers: this.didControllers(didIdentifier).value,
      delegates: this.didDelegates(didIdentifier).value,
      services: this.didServices(didIdentifier).value,
    };
  }

  /**
   * Get user's primary DID
   */
  getUserPrimaryDID(user: Address): string {
    return this.userPrimaryDid(user).value;
  }

  /**
   * Validate DID format
   */
  private validateDIDFormat(didIdentifier: string): void {
    // Basic validation for did:algo:network:identifier format
    assert(didIdentifier.startsWith('did:algo:'), 'Invalid DID format');
    assert(didIdentifier.length >= 20, 'DID identifier too short');
  }

  /**
   * Verify DID control (owner, controller, or delegate)
   */
  private verifyDIDControl(didIdentifier: string): void {
    const owner = this.didOwner(didIdentifier).value;
    const controllers = this.didControllers(didIdentifier).value;
    const delegates = this.didDelegates(didIdentifier).value;
    const sender = this.txn.sender.toString();
    
    assert(
      this.txn.sender === owner ||
      this.containsAddress(controllers, sender) ||
      this.containsAddress(delegates, sender),
      'Not authorized to control this DID'
    );
  }

  /**
   * Check if address list contains specific address
   */
  private containsAddress(addressList: string, address: string): boolean {
    if (addressList.length === 0) return false;
    
    // Simple string search - in production, use proper parsing
    return addressList.includes(address);
  }

  /**
   * Remove address from comma-separated list
   */
  private removeAddressFromList(addressList: string, address: string): string {
    // Simple implementation - in production, use proper parsing
    if (addressList === address) return '';
    
    const prefix = address + ',';
    const suffix = ',' + address;
    
    if (addressList.startsWith(prefix)) {
      return addressList.substring(prefix.length);
    } else if (addressList.endsWith(suffix)) {
      return addressList.substring(0, addressList.length - suffix.length);
    } else {
      const middle = ',' + address + ',';
      return addressList.replace(middle, ',');
    }
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