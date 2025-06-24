import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';

interface AttestationItem {
  id: string;
  attester: string;
  attestationType: string;
  description: string;
  weight: number;
  timestamp: string;
  verified: boolean;
  txHash: string;
}

interface ReputationBadge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedDate: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: string;
}

interface ScoreBreakdown {
  category: string;
  score: number;
  maxScore: number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const ReputationPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'attestations' | 'badges' | 'profile' | 'proof'>('overview');
  const [showProofQR, setShowProofQR] = useState(false);
  const [publicProfileSettings, setPublicProfileSettings] = useState({
    showScore: true,
    showBadges: true,
    showCredentials: false,
    showAttestations: true,
    showStakingHistory: false
  });

  const totalScore = 85;
  const maxScore = 100;

  const scoreBreakdown: ScoreBreakdown[] = [
    {
      category: 'Verified Credentials',
      score: 25,
      maxScore: 30,
      description: '5 verified credentials from trusted issuers',
      icon: <Shield className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: 'Community Attestations',
      score: 20,
      maxScore: 25,
      description: '12 positive attestations from network members',
      icon: <Users className="w-5 h-5" />,
      color: 'from-green-500 to-green-600'
    },
    {
      category: 'Staking History',
      score: 18,
      maxScore: 20,
      description: '6 months consistent staking, 500 NEXDEN locked',
      icon: <Coins className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      category: 'Network Participation',
      score: 15,
      maxScore: 15,
      description: 'Active governance participation and proposals',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600'
    },
    {
      category: 'Time-based Trust',
      score: 7,
      maxScore: 10,
      description: '8 months since first credential verification',
      icon: <Clock className="w-5 h-5" />,
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const attestations: AttestationItem[] = [
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
    },
    {
      id: '3',
      attester: 'John Smith (Colleague)',
      attestationType: 'Professional Endorsement',
      description: 'Excellent collaboration and technical skills',
      weight: 4.1,
      timestamp: '2024-01-08T09:15:00Z',
      verified: true,
      txHash: '0x3c4d5e6f...'
    },
    {
      id: '4',
      attester: 'Algorand Foundation',
      attestationType: 'Developer Certification',
      description: 'Certified Algorand Smart Contract Developer',
      weight: 6.8,
      timestamp: '2024-01-05T16:45:00Z',
      verified: true,
      txHash: '0x4d5e6f7g...'
    }
  ];

  const reputationBadges: ReputationBadge[] = [
    {
      id: '1',
      name: 'Early Adopter',
      description: 'Among the first 1000 users on NexDentify',
      imageUrl: '/api/placeholder/80/80',
      earnedDate: '2023-06-15',
      rarity: 'legendary',
      requirements: 'Join NexDentify in the first month of launch'
    },
    {
      id: '2',
      name: 'Credential Collector',
      description: 'Verified 5+ credentials from different categories',
      imageUrl: '/api/placeholder/80/80',
      earnedDate: '2023-12-20',
      rarity: 'epic',
      requirements: 'Obtain verified credentials in 5 different categories'
    },
    {
      id: '3',
      name: 'Community Builder',
      description: 'Provided 10+ attestations to other users',
      imageUrl: '/api/placeholder/80/80',
      earnedDate: '2024-01-10',
      rarity: 'rare',
      requirements: 'Successfully attest to 10 other community members'
    },
    {
      id: '4',
      name: 'Staking Champion',
      description: 'Maintained staking for 6+ consecutive months',
      imageUrl: '/api/placeholder/80/80',
      earnedDate: '2024-01-25',
      rarity: 'common',
      requirements: 'Stake NEXDEN tokens for 6 months without interruption'
    }
  ];

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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Score Breakdown */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Reputation Score Breakdown</h3>
        <div className="space-y-4">
          {scoreBreakdown.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-dark-text font-medium">{item.category}</p>
                    <p className="text-sm text-dark-text-secondary">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-dark-text font-semibold">{item.score}/{item.maxScore}</p>
                </div>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                  style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-500 mb-1">{attestations.length}</div>
          <div className="text-sm text-dark-text-secondary">Total Attestations</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-500 mb-1">{reputationBadges.length}</div>
          <div className="text-sm text-dark-text-secondary">Badges Earned</div>
        </div>
      </div>
    </div>
  );

  const renderAttestations = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text">Attestations & Endorsements</h3>
        <span className="text-sm text-dark-text-secondary">{attestations.length} total</span>
      </div>
      
      {attestations.map((attestation) => (
        <div key={attestation.id} className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-dark-text font-medium">{attestation.attestationType}</h4>
                {attestation.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
              <p className="text-sm text-dark-text-secondary mb-2">{attestation.description}</p>
              <p className="text-sm text-dark-text-secondary">
                By <span className="text-dark-text">{attestation.attester}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-primary-red">+{attestation.weight}</div>
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
  );

  const renderBadges = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text">Reputation Badges</h3>
        <span className="text-sm text-dark-text-secondary">{reputationBadges.length} earned</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {reputationBadges.map((badge) => (
          <div key={badge.id} className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center`}>
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

      <div className="space-y-4">
        {Object.entries(publicProfileSettings).map(([key, value]) => (
          <div key={key} className="bg-dark-card border border-dark-border rounded-xl p-4">
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

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h4 className="text-xl font-semibold text-dark-text mb-2">Reputation Score: {totalScore}</h4>
        <p className="text-dark-text-secondary mb-4">Highly Trusted Member</p>
        
        <button
          onClick={() => setShowProofQR(!showProofQR)}
          className="w-full bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity mb-3"
        >
          <QrCode className="w-5 h-5" />
          <span>{showProofQR ? 'Hide Proof' : 'Generate Proof'}</span>
        </button>

        {showProofQR && (
          <div className="bg-white p-6 rounded-xl mb-4">
            <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm">Scan to verify reputation proof</p>
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
      <div className="bg-dark-card border-b border-dark-border px-4 py-4">
        <h1 className="text-xl font-semibold text-dark-text">Reputation</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-2">
        <div className="flex space-x-1 overflow-x-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeView === item.id
                  ? 'bg-primary-red text-white'
                  : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-bg'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'attestations' && renderAttestations()}
        {activeView === 'badges' && renderBadges()}
        {activeView === 'profile' && renderPublicProfile()}
        {activeView === 'proof' && renderProofGeneration()}
      </div>
    </div>
  );
};

export default ReputationPage;