import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Shield, 
  Award, 
  Users, 
  TrendingUp, 
  Eye, 
  EyeOff, 
  QrCode, 
  Download,
  ChevronRight,
  Calendar,
  CheckCircle,
  Clock,
  Coins,
  User,
  Globe,
  Lock,
  ArrowLeft,
  ExternalLink,
  Plus,
  Sparkles
} from 'lucide-react';
import { useAlgorand, useReputation } from '../hooks/useAlgorand';

const ReputationPage: React.FC = () => {
  const { isConnected, address } = useAlgorand();
  const { reputation, loading, createAttestation, updateReputation } = useReputation();
  const [activeView, setActiveView] = useState<'overview' | 'attestations' | 'badges' | 'profile' | 'proof'>('overview');
  const [showProofQR, setShowProofQR] = useState(false);
  const [showAttestationModal, setShowAttestationModal] = useState(false);
  const [attestationForm, setAttestationForm] = useState({
    subject: '',
    weight: 50,
    metadata: ''
  });
  const [transactionLoading, setTransactionLoading] = useState(false);

  const [publicProfileSettings, setPublicProfileSettings] = useState({
    showScore: true,
    showBadges: true,
    showCredentials: false,
    showAttestations: true,
    showStakingHistory: false
  });

  // Mock data for demonstration
  const mockAttestations = [
    {
      id: '1',
      attester: 'MIT Alumni Network',
      attestationType: 'Education Verification',
      description: 'Confirmed graduation from Computer Science program',
      weight: 8.5,
      timestamp: '2024-01-15T10:30:00Z',
      verified: true,
      txHash: '0x1a2b3c4d...'
    },
    {
      id: '2',
      attester: 'TechCorp HR Department',
      attestationType: 'Employment Verification',
      description: 'Senior Software Engineer role confirmation',
      weight: 7.2,
      timestamp: '2024-01-10T14:20:00Z',
      verified: true,
      txHash: '0x2b3c4d5e...'
    }
  ];

  const mockBadges = [
    {
      id: '1',
      name: 'Early Adopter',
      description: 'Among the first 1000 users on NexDentify',
      earnedDate: '2023-06-15',
      rarity: 'legendary',
      requirements: 'Join NexDentify in the first month of launch'
    },
    {
      id: '2',
      name: 'Community Builder',
      description: 'Provided 10+ attestations to other users',
      earnedDate: '2024-01-10',
      rarity: 'rare',
      requirements: 'Successfully attest to 10 other community members'
    }
  ];

  const handleCreateAttestation = async () => {
    if (!attestationForm.subject || !attestationForm.metadata) {
      alert('Please fill in all fields');
      return;
    }

    setTransactionLoading(true);
    try {
      await createAttestation(
        attestationForm.subject,
        attestationForm.weight,
        attestationForm.metadata
      );
      setShowAttestationModal(false);
      setAttestationForm({ subject: '', weight: 50, metadata: '' });
      alert('Attestation created successfully!');
    } catch (error) {
      console.error('Failed to create attestation:', error);
      alert('Failed to create attestation. Please try again.');
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleUpdateReputation = async () => {
    setTransactionLoading(true);
    try {
      await updateReputation();
      alert('Reputation updated successfully!');
    } catch (error) {
      console.error('Failed to update reputation:', error);
      alert('Failed to update reputation. Please try again.');
    } finally {
      setTransactionLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      case 'common': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-bg pb-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Star className="w-16 h-16 text-primary-red mx-auto animate-pulse-glow" />
          <h2 className="text-xl font-semibold text-dark-text">Connect Your Wallet</h2>
          <p className="text-dark-text-secondary">Please connect your Algorand wallet to view your reputation</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Reputation Score Card */}
      <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border rounded-2xl p-6 text-center animate-fade-in-scale relative overflow-hidden">
        <div className="absolute top-4 right-4 animate-sparkle">
          <Sparkles className="w-4 h-4 text-primary-red opacity-60" />
        </div>
        
        <div className="w-24 h-24 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <Star className="w-12 h-12 text-white" />
        </div>
        
        <h3 className="text-3xl font-bold text-primary-red mb-2 animate-heartbeat">
          {reputation?.totalScore || 85}
        </h3>
        <p className="text-dark-text-secondary mb-4">Reputation Score</p>
        
        <div className="bg-dark-bg border border-dark-border rounded-lg p-3">
          <p className="text-sm text-green-400 font-medium">Highly Trusted Member</p>
        </div>
        
        <button
          onClick={handleUpdateReputation}
          disabled={transactionLoading}
          className="mt-4 bg-gradient-to-r from-primary-red to-primary-red-dark text-white px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {transactionLoading ? 'Updating...' : 'Update Score'}
        </button>
      </div>

      {/* Score Breakdown */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Score Breakdown</h3>
        <div className="space-y-4 stagger-animation">
          {[
            { category: 'Verified Credentials', score: reputation?.credentialScore || 25, maxScore: 30, color: 'from-blue-500 to-blue-600', icon: <Shield className="w-5 h-5" /> },
            { category: 'Community Attestations', score: reputation?.attestationScore || 20, maxScore: 25, color: 'from-green-500 to-green-600', icon: <Users className="w-5 h-5" /> },
            { category: 'Staking History', score: reputation?.stakingScore || 18, maxScore: 20, color: 'from-purple-500 to-purple-600', icon: <Coins className="w-5 h-5" /> },
            { category: 'Network Participation', score: reputation?.participationScore || 15, maxScore: 15, color: 'from-orange-500 to-orange-600', icon: <TrendingUp className="w-5 h-5" /> },
            { category: 'Time-based Trust', score: reputation?.timeScore || 7, maxScore: 10, color: 'from-indigo-500 to-indigo-600', icon: <Clock className="w-5 h-5" /> }
          ].map((item, index) => (
            <div key={index} className="space-y-2 hover-lift transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-dark-text font-medium">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-dark-text font-semibold">{item.score}/{item.maxScore}</p>
                </div>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center hover-lift transition-all duration-300">
          <div className="text-2xl font-bold text-green-500 mb-1 animate-bounce-gentle">
            {mockAttestations.length}
          </div>
          <div className="text-sm text-dark-text-secondary">Total Attestations</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center hover-lift transition-all duration-300">
          <div className="text-2xl font-bold text-purple-500 mb-1 animate-bounce-gentle">
            {mockBadges.length}
          </div>
          <div className="text-sm text-dark-text-secondary">Badges Earned</div>
        </div>
      </div>
    </div>
  );

  const renderAttestations = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text">Attestations & Endorsements</h3>
        <button
          onClick={() => setShowAttestationModal(true)}
          className="bg-gradient-to-r from-primary-red to-primary-red-dark text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Attestation</span>
        </button>
      </div>
      
      <div className="space-y-3 stagger-animation">
        {mockAttestations.map((attestation, index) => (
          <div key={attestation.id} className="bg-dark-card border border-dark-border rounded-xl p-4 hover-lift transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-dark-text font-medium">{attestation.attestationType}</h4>
                  {attestation.verified && <CheckCircle className="w-4 h-4 text-green-500 animate-bounce-gentle" />}
                </div>
                <p className="text-sm text-dark-text-secondary mb-2">{attestation.description}</p>
                <p className="text-sm text-dark-text-secondary">
                  By <span className="text-dark-text">{attestation.attester}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-primary-red animate-pulse">+{attestation.weight}</div>
                <div className="text-xs text-dark-text-secondary">weight</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-dark-text-secondary">
              <span>{formatDate(attestation.timestamp)}</span>
              <button className="flex items-center space-x-1 hover:text-dark-text transition-colors">
                <ExternalLink className="w-3 h-3" />
                <span>View on chain</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBadges = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text">Reputation Badges</h3>
        <span className="text-sm text-dark-text-secondary">{mockBadges.length} earned</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 stagger-animation">
        {mockBadges.map((badge, index) => (
          <div key={badge.id} className="bg-dark-card border border-dark-border rounded-xl p-4 text-center hover-lift transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center animate-pulse-glow`}>
              <Award className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-dark-text font-medium mb-1">{badge.name}</h4>
            <p className="text-xs text-dark-text-secondary mb-2">{badge.description}</p>
            <div className="flex items-center justify-center space-x-1 mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                badge.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                badge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                badge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {badge.rarity}
              </span>
            </div>
            <p className="text-xs text-dark-text-secondary">
              Earned {formatDate(badge.earnedDate)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPublicProfile = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text mb-2">Public Profile Settings</h3>
        <p className="text-sm text-dark-text-secondary mb-4">
          Control what information is visible on your public NexDentify profile
        </p>
      </div>

      <div className="space-y-4 stagger-animation">
        {Object.entries(publicProfileSettings).map(([key, value], index) => (
          <div key={key} className="bg-dark-card border border-dark-border rounded-xl p-4 hover-lift transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {value ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-500" />}
                <div>
                  <p className="text-dark-text font-medium">
                    {key === 'showScore' ? 'Reputation Score' :
                     key === 'showBadges' ? 'Reputation Badges' :
                     key === 'showCredentials' ? 'Verified Credentials' :
                     key === 'showAttestations' ? 'Attestations' :
                     'Staking History'}
                  </p>
                  <p className="text-sm text-dark-text-secondary">
                    {value ? 'Visible to public' : 'Private'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPublicProfileSettings(prev => ({ ...prev, [key]: !value }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary-red' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Globe className="w-5 h-5 text-primary-red" />
          <h4 className="text-dark-text font-medium">Public Profile Preview</h4>
        </div>
        <p className="text-sm text-dark-text-secondary mb-3">
          This is how your profile appears to others
        </p>
        <button className="w-full bg-dark-bg border border-dark-border rounded-lg py-3 text-dark-text hover:border-primary-red-light/30 transition-colors">
          View Public Profile
        </button>
      </div>
    </div>
  );

  const renderProofGeneration = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text mb-2">Prove Your Reputation</h3>
        <p className="text-sm text-dark-text-secondary mb-4">
          Generate verifiable proofs of your reputation score for external platforms
        </p>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center animate-fade-in-scale">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h4 className="text-xl font-semibold text-dark-text mb-2">
          Reputation Score: {reputation?.totalScore || 85}
        </h4>
        <p className="text-dark-text-secondary mb-4">Highly Trusted Member</p>
        
        <button
          onClick={() => setShowProofQR(!showProofQR)}
          className="w-full bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity mb-3"
        >
          <QrCode className="w-5 h-5" />
          <span>{showProofQR ? 'Hide Proof' : 'Generate Proof'}</span>
        </button>

        {showProofQR && (
          <div className="bg-white p-6 rounded-xl mb-4 animate-fade-in-scale">
            <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center animate-pulse-glow">
              <QrCode className="w-16 h-16 text-gray-400 animate-float" />
            </div>
            <p className="text-gray-600 text-sm">Scan to verify reputation proof</p>
            <div className="mt-2 text-xs text-gray-500 font-mono">
              Proof ID: {address.substring(0, 10)}...
            </div>
          </div>
        )}

        <button className="w-full bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl flex items-center justify-center space-x-2 hover:border-primary-red-light/30 transition-colors">
          <Download className="w-4 h-4" />
          <span>Download Proof Certificate</span>
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-4">
        <h4 className="text-dark-text font-medium mb-3">Proof Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Proof Type:</span>
            <span className="text-dark-text">Zero-Knowledge Reputation Proof</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Valid Until:</span>
            <span className="text-dark-text">30 days from generation</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Verification Method:</span>
            <span className="text-dark-text">Algorand Smart Contract</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Network:</span>
            <span className="text-dark-text">Algorand Testnet</span>
          </div>
        </div>
      </div>
    </div>
  );

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: <Star className="w-5 h-5" /> },
    { id: 'attestations', label: 'Attestations', icon: <Users className="w-5 h-5" /> },
    { id: 'badges', label: 'Badges', icon: <Award className="w-5 h-5" /> },
    { id: 'profile', label: 'Public Profile', icon: <Globe className="w-5 h-5" /> },
    { id: 'proof', label: 'Prove Reputation', icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-4 animate-slide-in-up">
        <h1 className="text-xl font-semibold text-dark-text">Reputation</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-2">
        <div className="flex space-x-1 overflow-x-auto">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors hover-scale ${
                activeView === item.id
                  ? 'bg-primary-red text-white animate-pulse-glow'
                  : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-bg'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red"></div>
          </div>
        ) : (
          <>
            {activeView === 'overview' && renderOverview()}
            {activeView === 'attestations' && renderAttestations()}
            {activeView === 'badges' && renderBadges()}
            {activeView === 'profile' && renderPublicProfile()}
            {activeView === 'proof' && renderProofGeneration()}
          </>
        )}
      </div>

      {/* Create Attestation Modal */}
      {showAttestationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md animate-fade-in-scale">
            <h3 className="text-lg font-semibold text-dark-text mb-4">Create Attestation</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">Subject Address</label>
                <input
                  type="text"
                  value={attestationForm.subject}
                  onChange={(e) => setAttestationForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter Algorand address"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">
                  Weight: {attestationForm.weight}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={attestationForm.weight}
                  onChange={(e) => setAttestationForm(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-dark-text-secondary mt-1">
                  <span>Low Impact</span>
                  <span>High Impact</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">Attestation Details</label>
                <textarea
                  value={attestationForm.metadata}
                  onChange={(e) => setAttestationForm(prev => ({ ...prev, metadata: e.target.value }))}
                  placeholder="Describe what you're attesting to..."
                  rows={3}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none resize-none"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAttestationModal(false)}
                className="flex-1 bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAttestation}
                disabled={transactionLoading}
                className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {transactionLoading ? 'Creating...' : 'Create Attestation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReputationPage;