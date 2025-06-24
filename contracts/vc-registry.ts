import { Contract } from '@algorandfoundation/tealscript';

/**
 * Verifiable Credentials Registry Contract
 * 
 * Anchors verifiable credential hashes on-chain for verification and integrity.
 * Provides credential issuance, verification, and revocation functionality.
 */
export class VCRegistry extends Contract {
  // Contract configuration
  admin = GlobalStateKey<Address>('admin');
  didRegistry = GlobalStateKey<Address>('did_registry');
  reputationContract = GlobalStateKey<Address>('reputation_contract');
  paused = GlobalStateKey<boolean>('paused');
  
  // Credential management
  credentialCount = GlobalStateKey<uint64>('credential_count');
  
  // Trusted issuers
  trustedIssuers = GlobalStateMap<Address, boolean>('trusted_issuers');
  issuerMetadata = GlobalStateMap<Address, string>('issuer_metadata'); // JSON metadata
  
  // Credential data structure
  credentialExists = GlobalStateMap<string, boolean>('credential_exists');
  credentialHash = GlobalStateMap<string, string>('credential_hash'); // SHA-256 hash
  credentialIssuer = GlobalStateMap<string, Address>('credential_issuer');
  credentialSubject = GlobalStateMap<string, Address>('credential_subject');
  credentialType = GlobalStateMap<string, string>('credential_type');
  credentialSchema = GlobalStateMap<string, string>('credential_schema');
  credentialIssuanceDate = GlobalStateMap<string, uint64>('credential_issuance_date');
  credentialExpirationDate = GlobalStateMap<string, uint64>('credential_expiration_date');
  credentialRevoked = GlobalStateMap<string, boolean>('credential_revoked');
  credentialRevocationDate = GlobalStateMap<string, uint64>('credential_revocation_date');
  credentialRevocationReason = GlobalStateMap<string, string>('credential_revocation_reason');
  credentialMetadata = GlobalStateMap<string, string>('credential_metadata'); // Additional data
  
  // Credential verification
  credentialVerifications = GlobalStateMap<string, uint64>('credential_verifications'); // count
  credentialLastVerified = GlobalStateMap<string, uint64>('credential_last_verified');
  
  // User credentials
  userCredentialCount = LocalStateKey<uint64>('user_credential_count');
  userCredentialIds = LocalStateMap<uint64, string>('user_credential_ids'); // index -> credentialId

  /**
   * Initialize the VC registry contract
   */
  createApplication(
    didRegistryAddress: Address,
    reputationContractAddress: Address
  ): void {
    assert(this.txn.sender === this.app.creator);
    
    this.admin.value = this.txn.sender;
    this.didRegistry.value = didRegistryAddress;
    this.reputationContract.value = reputationContractAddress;
    this.paused.value = false;
    this.credentialCount.value = 0;
  }

  /**
   * Opt user into the VC registry
   */
  optIn(): void {
    this.userCredentialCount(this.txn.sender).value = 0;
  }

  /**
   * Add trusted issuer (admin only)
   */
  addTrustedIssuer(issuerAddress: Address, metadata: string): void {
    this.verifyAdmin();
    this.trustedIssuers(issuerAddress).value = true;
    this.issuerMetadata(issuerAddress).value = metadata;
  }

  /**
   * Remove trusted issuer (admin only)
   */
  removeTrustedIssuer(issuerAddress: Address): void {
    this.verifyAdmin();
    this.trustedIssuers(issuerAddress).delete();
    this.issuerMetadata(issuerAddress).delete();
  }

  /**
   * Issue a verifiable credential
   */
  issueCredential(
    credentialId: string,
    credentialHash: string,
    subject: Address,
    credentialType: string,
    schema: string,
    expirationDate: uint64,
    metadata: string
  ): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(!this.credentialExists(credentialId).value, 'Credential already exists');
    assert(credentialId.length > 0, 'Invalid credential ID');
    assert(credentialHash.length === 64, 'Invalid hash length'); // SHA-256 hex
    
    // Verify issuer is trusted or admin
    assert(
      this.trustedIssuers(this.txn.sender).value || 
      this.txn.sender === this.admin.value,
      'Unauthorized issuer'
    );
    
    // Verify expiration date
    if (expirationDate > 0) {
      assert(expirationDate > Global.latestTimestamp, 'Invalid expiration date');
    }
    
    // Create credential record
    this.credentialExists(credentialId).value = true;
    this.credentialHash(credentialId).value = credentialHash;
    this.credentialIssuer(credentialId).value = this.txn.sender;
    this.credentialSubject(credentialId).value = subject;
    this.credentialType(credentialId).value = credentialType;
    this.credentialSchema(credentialId).value = schema;
    this.credentialIssuanceDate(credentialId).value = Global.latestTimestamp;
    this.credentialExpirationDate(credentialId).value = expirationDate;
    this.credentialRevoked(credentialId).value = false;
    this.credentialMetadata(credentialId).value = metadata;
    this.credentialVerifications(credentialId).value = 0;
    
    // Update counters
    this.credentialCount.value = this.credentialCount.value + 1;
    
    // Add to user's credential list
    const userCredCount = this.userCredentialCount(subject).value;
    this.userCredentialIds(subject, userCredCount).value = credentialId;
    this.userCredentialCount(subject).value = userCredCount + 1;
    
    // Update reputation score
    this.updateReputationScore(subject, credentialType, true);
  }

  /**
   * Verify a credential hash
   */
  verifyCredential(credentialId: string, providedHash: string): boolean {
    assert(this.credentialExists(credentialId).value, 'Credential does not exist');
    assert(!this.credentialRevoked(credentialId).value, 'Credential is revoked');
    
    const storedHash = this.credentialHash(credentialId).value;
    const expirationDate = this.credentialExpirationDate(credentialId).value;
    
    // Check expiration
    if (expirationDate > 0 && Global.latestTimestamp > expirationDate) {
      return false;
    }
    
    // Verify hash
    const isValid = storedHash === providedHash;
    
    if (isValid) {
      // Update verification statistics
      this.credentialVerifications(credentialId).value = this.credentialVerifications(credentialId).value + 1;
      this.credentialLastVerified(credentialId).value = Global.latestTimestamp;
    }
    
    return isValid;
  }

  /**
   * Revoke a credential
   */
  revokeCredential(credentialId: string, reason: string): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.credentialExists(credentialId).value, 'Credential does not exist');
    assert(!this.credentialRevoked(credentialId).value, 'Credential already revoked');
    
    const issuer = this.credentialIssuer(credentialId).value;
    const subject = this.credentialSubject(credentialId).value;
    
    // Only issuer, subject, or admin can revoke
    assert(
      this.txn.sender === issuer ||
      this.txn.sender === subject ||
      this.txn.sender === this.admin.value,
      'Not authorized to revoke'
    );
    
    // Revoke credential
    this.credentialRevoked(credentialId).value = true;
    this.credentialRevocationDate(credentialId).value = Global.latestTimestamp;
    this.credentialRevocationReason(credentialId).value = reason;
    
    // Update reputation score
    const credentialType = this.credentialType(credentialId).value;
    this.updateReputationScore(subject, credentialType, false);
  }

  /**
   * Update credential metadata (issuer only)
   */
  updateCredentialMetadata(credentialId: string, newMetadata: string): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.credentialExists(credentialId).value, 'Credential does not exist');
    
    const issuer = this.credentialIssuer(credentialId).value;
    assert(this.txn.sender === issuer, 'Only issuer can update metadata');
    
    this.credentialMetadata(credentialId).value = newMetadata;
  }

  /**
   * Get credential information
   */
  getCredential(credentialId: string): {
    hash: string;
    issuer: Address;
    subject: Address;
    credentialType: string;
    schema: string;
    issuanceDate: uint64;
    expirationDate: uint64;
    revoked: boolean;
    revocationDate: uint64;
    revocationReason: string;
    metadata: string;
    verifications: uint64;
    lastVerified: uint64;
  } {
    assert(this.credentialExists(credentialId).value, 'Credential does not exist');
    
    return {
      hash: this.credentialHash(credentialId).value,
      issuer: this.credentialIssuer(credentialId).value,
      subject: this.credentialSubject(credentialId).value,
      credentialType: this.credentialType(credentialId).value,
      schema: this.credentialSchema(credentialId).value,
      issuanceDate: this.credentialIssuanceDate(credentialId).value,
      expirationDate: this.credentialExpirationDate(credentialId).value,
      revoked: this.credentialRevoked(credentialId).value,
      revocationDate: this.credentialRevocationDate(credentialId).value,
      revocationReason: this.credentialRevocationReason(credentialId).value,
      metadata: this.credentialMetadata(credentialId).value,
      verifications: this.credentialVerifications(credentialId).value,
      lastVerified: this.credentialLastVerified(credentialId).value,
    };
  }

  /**
   * Get user's credentials
   */
  getUserCredentials(user: Address): string[] {
    const credCount = this.userCredentialCount(user).value;
    const credentials: string[] = [];
    
    for (let i = 0; i < credCount; i++) {
      const credentialId = this.userCredentialIds(user, i).value;
      if (credentialId.length > 0) {
        credentials.push(credentialId);
      }
    }
    
    return credentials;
  }

  /**
   * Check if issuer is trusted
   */
  isTrustedIssuer(issuer: Address): boolean {
    return this.trustedIssuers(issuer).value;
  }

  /**
   * Get issuer metadata
   */
  getIssuerMetadata(issuer: Address): string {
    return this.issuerMetadata(issuer).value;
  }

  /**
   * Batch verify credentials
   */
  batchVerifyCredentials(credentialIds: string[], hashes: string[]): boolean[] {
    assert(credentialIds.length === hashes.length, 'Array length mismatch');
    
    const results: boolean[] = [];
    
    for (let i = 0; i < credentialIds.length; i++) {
      const isValid = this.verifyCredential(credentialIds[i], hashes[i]);
      results.push(isValid);
    }
    
    return results;
  }

  /**
   * Get credential statistics
   */
  getCredentialStats(): {
    totalCredentials: uint64;
    totalVerifications: uint64;
    trustedIssuersCount: uint64;
  } {
    // Note: trustedIssuersCount would need to be tracked separately
    // This is a simplified version
    return {
      totalCredentials: this.credentialCount.value,
      totalVerifications: 0, // Would need to aggregate
      trustedIssuersCount: 0, // Would need to track separately
    };
  }

  /**
   * Update reputation score (internal call to reputation contract)
   */
  private updateReputationScore(user: Address, credentialType: string, isIssuing: boolean): void {
    // This would make an inner transaction to the reputation contract
    // Implementation depends on the reputation contract interface
    // Different credential types would have different reputation weights
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