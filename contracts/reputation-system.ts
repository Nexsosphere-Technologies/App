import { Contract } from '@algorandfoundation/tealscript';

/**
 * Reputation System Contract
 * 
 * Manages user reputation scores based on verified credentials, community attestations,
 * staking history, and network participation. Provides reputation-based benefits and governance.
 */
export class ReputationSystem extends Contract {
  // Contract configuration
  admin = GlobalStateKey<Address>('admin');
  didRegistry = GlobalStateKey<Address>('did_registry');
  vcRegistry = GlobalStateKey<Address>('vc_registry');
  stakingContract = GlobalStateKey<Address>('staking_contract');
  paused = GlobalStateKey<boolean>('paused');
  
  // Reputation configuration
  maxReputationScore = GlobalStateKey<uint64>('max_reputation_score');
  reputationDecayRate = GlobalStateKey<uint64>('reputation_decay_rate'); // per day in basis points
  
  // Score weights (basis points, 10000 = 100%)
  credentialWeight = GlobalStateKey<uint64>('credential_weight');
  attestationWeight = GlobalStateKey<uint64>('attestation_weight');
  stakingWeight = GlobalStateKey<uint64>('staking_weight');
  participationWeight = GlobalStateKey<uint64>('participation_weight');
  timeWeight = GlobalStateKey<uint64>('time_weight');
  
  // User reputation data
  userReputationScore = LocalStateKey<uint64>('user_reputation_score');
  userLastUpdate = LocalStateKey<uint64>('user_last_update');
  userCredentialScore = LocalStateKey<uint64>('user_credential_score');
  userAttestationScore = LocalStateKey<uint64>('user_attestation_score');
  userStakingScore = LocalStateKey<uint64>('user_staking_score');
  userParticipationScore = LocalStateKey<uint64>('user_participation_score');
  userTimeScore = LocalStateKey<uint64>('user_time_score');
  userFirstActivity = LocalStateKey<uint64>('user_first_activity');
  
  // Attestations
  attestationCount = GlobalStateKey<uint64>('attestation_count');
  attestationExists = GlobalStateMap<string, boolean>('attestation_exists');
  attestationAttester = GlobalStateMap<string, Address>('attestation_attester');
  attestationSubject = GlobalStateMap<string, Address>('attestation_subject');
  attestationWeight = GlobalStateMap<string, uint64>('attestation_weight');
  attestationTimestamp = GlobalStateMap<string, uint64>('attestation_timestamp');
  attestationMetadata = GlobalStateMap<string, string>('attestation_metadata');
  attestationRevoked = GlobalStateMap<string, boolean>('attestation_revoked');
  
  // User attestation tracking
  userAttestationCount = LocalStateKey<uint64>('user_attestation_count');
  userAttestationIds = LocalStateMap<uint64, string>('user_attestation_ids');
  userGivenAttestations = LocalStateKey<uint64>('user_given_attestations');
  
  // Reputation badges
  badgeCount = GlobalStateKey<uint64>('badge_count');
  badgeExists = GlobalStateMap<uint64, boolean>('badge_exists');
  badgeName = GlobalStateMap<uint64, string>('badge_name');
  badgeDescription = GlobalStateMap<uint64, string>('badge_description');
  badgeRequirement = GlobalStateMap<uint64, uint64>('badge_requirement'); // min reputation score
  badgeActive = GlobalStateMap<uint64, boolean>('badge_active');
  
  // User badges
  userBadges = LocalStateMap<uint64, boolean>('user_badges'); // badgeId -> earned
  userBadgeEarnedDate = LocalStateMap<uint64, uint64>('user_badge_earned_date');

  /**
   * Initialize the reputation system contract
   */
  createApplication(
    didRegistryAddress: Address,
    vcRegistryAddress: Address,
    stakingContractAddress: Address
  ): void {
    assert(this.txn.sender === this.app.creator);
    
    this.admin.value = this.txn.sender;
    this.didRegistry.value = didRegistryAddress;
    this.vcRegistry.value = vcRegistryAddress;
    this.stakingContract.value = stakingContractAddress;
    this.paused.value = false;
    
    // Set default configuration
    this.maxReputationScore.value = 100;
    this.reputationDecayRate.value = 10; // 0.1% per day
    
    // Set default weights (total should be 10000)
    this.credentialWeight.value = 3000; // 30%
    this.attestationWeight.value = 2500; // 25%
    this.stakingWeight.value = 2000; // 20%
    this.participationWeight.value = 1500; // 15%
    this.timeWeight.value = 1000; // 10%
    
    this.attestationCount.value = 0;
    this.badgeCount.value = 0;
  }

  /**
   * Opt user into the reputation system
   */
  optIn(): void {
    this.userReputationScore(this.txn.sender).value = 0;
    this.userLastUpdate(this.txn.sender).value = Global.latestTimestamp;
    this.userCredentialScore(this.txn.sender).value = 0;
    this.userAttestationScore(this.txn.sender).value = 0;
    this.userStakingScore(this.txn.sender).value = 0;
    this.userParticipationScore(this.txn.sender).value = 0;
    this.userTimeScore(this.txn.sender).value = 0;
    this.userFirstActivity(this.txn.sender).value = Global.latestTimestamp;
    this.userAttestationCount(this.txn.sender).value = 0;
    this.userGivenAttestations(this.txn.sender).value = 0;
  }

  /**
   * Update user reputation score
   */
  updateReputationScore(user: Address): void {
    assert(!this.paused.value, 'Contract is paused');
    
    // Apply decay first
    this.applyReputationDecay(user);
    
    // Calculate component scores
    const credentialScore = this.calculateCredentialScore(user);
    const attestationScore = this.calculateAttestationScore(user);
    const stakingScore = this.calculateStakingScore(user);
    const participationScore = this.calculateParticipationScore(user);
    const timeScore = this.calculateTimeScore(user);
    
    // Update component scores
    this.userCredentialScore(user).value = credentialScore;
    this.userAttestationScore(user).value = attestationScore;
    this.userStakingScore(user).value = stakingScore;
    this.userParticipationScore(user).value = participationScore;
    this.userTimeScore(user).value = timeScore;
    
    // Calculate weighted total
    const totalScore = (
      (credentialScore * this.credentialWeight.value) +
      (attestationScore * this.attestationWeight.value) +
      (stakingScore * this.stakingWeight.value) +
      (participationScore * this.participationWeight.value) +
      (timeScore * this.timeWeight.value)
    ) / 10000;
    
    // Cap at maximum score
    const finalScore = Math.min(totalScore, this.maxReputationScore.value);
    
    this.userReputationScore(user).value = finalScore;
    this.userLastUpdate(user).value = Global.latestTimestamp;
    
    // Check for new badges
    this.checkAndAwardBadges(user, finalScore);
  }

  /**
   * Create attestation
   */
  createAttestation(
    subject: Address,
    weight: uint64,
    metadata: string
  ): string {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.txn.sender !== subject, 'Cannot attest to yourself');
    assert(weight > 0 && weight <= 100, 'Invalid attestation weight');
    
    // Generate attestation ID
    const attestationId = this.generateAttestationId(this.txn.sender, subject);
    assert(!this.attestationExists(attestationId).value, 'Attestation already exists');
    
    // Create attestation
    this.attestationExists(attestationId).value = true;
    this.attestationAttester(attestationId).value = this.txn.sender;
    this.attestationSubject(attestationId).value = subject;
    this.attestationWeight(attestationId).value = weight;
    this.attestationTimestamp(attestationId).value = Global.latestTimestamp;
    this.attestationMetadata(attestationId).value = metadata;
    this.attestationRevoked(attestationId).value = false;
    
    // Update counters
    this.attestationCount.value = this.attestationCount.value + 1;
    
    // Add to subject's attestation list
    const subjectAttestationCount = this.userAttestationCount(subject).value;
    this.userAttestationIds(subject, subjectAttestationCount).value = attestationId;
    this.userAttestationCount(subject).value = subjectAttestationCount + 1;
    
    // Update attester's given attestations count
    this.userGivenAttestations(this.txn.sender).value = this.userGivenAttestations(this.txn.sender).value + 1;
    
    // Update subject's reputation
    this.updateReputationScore(subject);
    
    return attestationId;
  }

  /**
   * Revoke attestation
   */
  revokeAttestation(attestationId: string): void {
    assert(!this.paused.value, 'Contract is paused');
    assert(this.attestationExists(attestationId).value, 'Attestation does not exist');
    assert(!this.attestationRevoked(attestationId).value, 'Attestation already revoked');
    
    const attester = this.attestationAttester(attestationId).value;
    const subject = this.attestationSubject(attestationId).value;
    
    // Only attester, subject, or admin can revoke
    assert(
      this.txn.sender === attester ||
      this.txn.sender === subject ||
      this.txn.sender === this.admin.value,
      'Not authorized to revoke'
    );
    
    this.attestationRevoked(attestationId).value = true;
    
    // Update subject's reputation
    this.updateReputationScore(subject);
  }

  /**
   * Create reputation badge (admin only)
   */
  createBadge(
    name: string,
    description: string,
    requirement: uint64
  ): uint64 {
    this.verifyAdmin();
    
    const badgeId = this.badgeCount.value + 1;
    this.badgeCount.value = badgeId;
    
    this.badgeExists(badgeId).value = true;
    this.badgeName(badgeId).value = name;
    this.badgeDescription(badgeId).value = description;
    this.badgeRequirement(badgeId).value = requirement;
    this.badgeActive(badgeId).value = true;
    
    return badgeId;
  }

  /**
   * Award badge to user (admin only or automatic)
   */
  awardBadge(user: Address, badgeId: uint64): void {
    assert(this.badgeExists(badgeId).value, 'Badge does not exist');
    assert(this.badgeActive(badgeId).value, 'Badge is not active');
    assert(!this.userBadges(user, badgeId).value, 'Badge already earned');
    
    // Check if admin or automatic award
    if (this.txn.sender !== this.admin.value) {
      // Automatic award - check requirements
      const userScore = this.userReputationScore(user).value;
      const requirement = this.badgeRequirement(badgeId).value;
      assert(userScore >= requirement, 'Requirements not met');
    }
    
    this.userBadges(user, badgeId).value = true;
    this.userBadgeEarnedDate(user, badgeId).value = Global.latestTimestamp;
  }

  /**
   * Get user reputation information
   */
  getUserReputation(user: Address): {
    totalScore: uint64;
    credentialScore: uint64;
    attestationScore: uint64;
    stakingScore: uint64;
    participationScore: uint64;
    timeScore: uint64;
    lastUpdate: uint64;
    firstActivity: uint64;
    attestationCount: uint64;
    givenAttestations: uint64;
  } {
    return {
      totalScore: this.userReputationScore(user).value,
      credentialScore: this.userCredentialScore(user).value,
      attestationScore: this.userAttestationScore(user).value,
      stakingScore: this.userStakingScore(user).value,
      participationScore: this.userParticipationScore(user).value,
      timeScore: this.userTimeScore(user).value,
      lastUpdate: this.userLastUpdate(user).value,
      firstActivity: this.userFirstActivity(user).value,
      attestationCount: this.userAttestationCount(user).value,
      givenAttestations: this.userGivenAttestations(user).value,
    };
  }

  /**
   * Get user badges
   */
  getUserBadges(user: Address): uint64[] {
    const badges: uint64[] = [];
    
    for (let i = 1; i <= this.badgeCount.value; i++) {
      if (this.userBadges(user, i).value) {
        badges.push(i);
      }
    }
    
    return badges;
  }

  /**
   * Calculate credential score based on verified credentials
   */
  private calculateCredentialScore(user: Address): uint64 {
    // This would query the VC registry for user's verified credentials
    // Different credential types would have different weights
    // Implementation depends on VC registry interface
    return 0; // Placeholder
  }

  /**
   * Calculate attestation score based on received attestations
   */
  private calculateAttestationScore(user: Address): uint64 {
    const attestationCount = this.userAttestationCount(user).value;
    let totalWeight = 0;
    let validAttestations = 0;
    
    for (let i = 0; i < attestationCount; i++) {
      const attestationId = this.userAttestationIds(user, i).value;
      if (!this.attestationRevoked(attestationId).value) {
        const weight = this.attestationWeight(attestationId).value;
        const attester = this.attestationAttester(attestationId).value;
        
        // Weight attestations by attester's reputation
        const attesterReputation = this.userReputationScore(attester).value;
        const weightedValue = (weight * (attesterReputation + 10)) / 110; // Avoid zero division
        
        totalWeight += weightedValue;
        validAttestations += 1;
      }
    }
    
    if (validAttestations === 0) return 0;
    
    // Average weighted attestation score, capped at max component score
    const maxComponentScore = this.maxReputationScore.value;
    return Math.min(totalWeight / validAttestations, maxComponentScore);
  }

  /**
   * Calculate staking score based on staking history
   */
  private calculateStakingScore(user: Address): uint64 {
    // This would query the staking contract for user's staking data
    // Implementation depends on staking contract interface
    return 0; // Placeholder
  }

  /**
   * Calculate participation score based on network activity
   */
  private calculateParticipationScore(user: Address): uint64 {
    // Based on various activities like:
    // - Number of attestations given
    // - DID management activities
    // - Governance participation
    
    const givenAttestations = this.userGivenAttestations(user).value;
    const maxComponentScore = this.maxReputationScore.value;
    
    // Simple calculation based on given attestations
    const participationScore = Math.min(givenAttestations * 2, maxComponentScore);
    
    return participationScore;
  }

  /**
   * Calculate time-based score
   */
  private calculateTimeScore(user: Address): uint64 {
    const firstActivity = this.userFirstActivity(user).value;
    const currentTime = Global.latestTimestamp;
    const daysSinceFirst = (currentTime - firstActivity) / (24 * 3600);
    
    const maxComponentScore = this.maxReputationScore.value;
    
    // Score increases with time, capped at max
    const timeScore = Math.min(daysSinceFirst / 30, maxComponentScore); // 1 point per 30 days
    
    return timeScore;
  }

  /**
   * Apply reputation decay over time
   */
  private applyReputationDecay(user: Address): void {
    const lastUpdate = this.userLastUpdate(user).value;
    const currentTime = Global.latestTimestamp;
    const daysSinceUpdate = (currentTime - lastUpdate) / (24 * 3600);
    
    if (daysSinceUpdate > 0) {
      const currentScore = this.userReputationScore(user).value;
      const decayRate = this.reputationDecayRate.value;
      
      // Apply exponential decay
      const decayFactor = Math.pow(1 - (decayRate / 10000), daysSinceUpdate);
      const newScore = currentScore * decayFactor;
      
      this.userReputationScore(user).value = newScore;
    }
  }

  /**
   * Check and award badges based on reputation score
   */
  private checkAndAwardBadges(user: Address, score: uint64): void {
    for (let i = 1; i <= this.badgeCount.value; i++) {
      if (this.badgeExists(i).value && this.badgeActive(i).value) {
        const requirement = this.badgeRequirement(i).value;
        
        if (score >= requirement && !this.userBadges(user, i).value) {
          this.awardBadge(user, i);
        }
      }
    }
  }

  /**
   * Generate unique attestation ID
   */
  private generateAttestationId(attester: Address, subject: Address): string {
    // Simple ID generation - in production, use more sophisticated method
    const timestamp = Global.latestTimestamp.toString();
    return attester.toString() + '-' + subject.toString() + '-' + timestamp;
  }

  /**
   * Update reputation weights (admin only)
   */
  updateWeights(
    credentialWeight: uint64,
    attestationWeight: uint64,
    stakingWeight: uint64,
    participationWeight: uint64,
    timeWeight: uint64
  ): void {
    this.verifyAdmin();
    
    // Verify weights sum to 10000 (100%)
    const totalWeight = credentialWeight + attestationWeight + stakingWeight + participationWeight + timeWeight;
    assert(totalWeight === 10000, 'Weights must sum to 10000');
    
    this.credentialWeight.value = credentialWeight;
    this.attestationWeight.value = attestationWeight;
    this.stakingWeight.value = stakingWeight;
    this.participationWeight.value = participationWeight;
    this.timeWeight.value = timeWeight;
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