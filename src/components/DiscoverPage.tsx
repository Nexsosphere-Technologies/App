import React, { useState } from 'react';
import { Search, Shield, Building2, Globe, Star, Users, CheckCircle, ExternalLink, Filter, ArrowRight, Award, Handshake, Zap, Code, GraduationCap, Briefcase, Heart, Landmark, Smartphone, TowerControl as GameController2, ShoppingCart, CreditCard, TrendingUp, Lock, Eye, Clock, MapPin } from 'lucide-react';

interface TrustedIssuer {
  id: string;
  name: string;
  type: 'education' | 'government' | 'healthcare' | 'employment' | 'certification' | 'financial';
  description: string;
  credentialTypes: string[];
  verificationLevel: 'basic' | 'enhanced' | 'premium';
  memberSince: string;
  totalCredentials: number;
  rating: number;
  logo: React.ReactNode;
  color: string;
  website?: string;
  location: string;
}

interface IntegratedPlatform {
  id: string;
  name: string;
  category: 'defi' | 'social' | 'gaming' | 'ecommerce' | 'productivity' | 'dao';
  description: string;
  features: string[];
  integrationLevel: 'basic' | 'advanced' | 'deep';
  users: string;
  logo: React.ReactNode;
  color: string;
  website?: string;
  launchDate: string;
}

interface Partnership {
  id: string;
  name: string;
  type: 'technology' | 'ecosystem' | 'infrastructure' | 'research';
  description: string;
  benefits: string[];
  status: 'active' | 'development' | 'planned';
  logo: React.ReactNode;
  color: string;
  website?: string;
  announcedDate: string;
}

const DiscoverPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'issuers' | 'platforms' | 'partnerships'>('issuers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const trustedIssuers: TrustedIssuer[] = [
    {
      id: '1',
      name: 'Massachusetts Institute of Technology',
      type: 'education',
      description: 'Leading technology university issuing verified academic credentials and certifications',
      credentialTypes: ['Degrees', 'Certificates', 'Course Completions', 'Research Credits'],
      verificationLevel: 'premium',
      memberSince: '2023-03-15',
      totalCredentials: 15420,
      rating: 4.9,
      logo: <GraduationCap className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      website: 'https://mit.edu',
      location: 'Cambridge, MA, USA'
    },
    {
      id: '2',
      name: 'U.S. Department of Health',
      type: 'government',
      description: 'Official government health credentials including vaccination records and health certifications',
      credentialTypes: ['Vaccination Records', 'Health Certificates', 'Medical Licenses', 'Public Health IDs'],
      verificationLevel: 'premium',
      memberSince: '2023-01-10',
      totalCredentials: 2840000,
      rating: 4.8,
      logo: <Shield className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      website: 'https://hhs.gov',
      location: 'Washington, DC, USA'
    },
    {
      id: '3',
      name: 'TechCorp Solutions',
      type: 'employment',
      description: 'Fortune 500 technology company providing employment verification and skill certifications',
      credentialTypes: ['Employment Verification', 'Skill Certifications', 'Performance Reviews', 'Training Records'],
      verificationLevel: 'enhanced',
      memberSince: '2023-06-20',
      totalCredentials: 45600,
      rating: 4.7,
      logo: <Briefcase className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      website: 'https://techcorp.com',
      location: 'San Francisco, CA, USA'
    },
    {
      id: '4',
      name: 'Algorand Foundation',
      type: 'certification',
      description: 'Official Algorand blockchain certifications and developer credentials',
      credentialTypes: ['Developer Certifications', 'Node Operator Licenses', 'Governance Participation', 'Smart Contract Audits'],
      verificationLevel: 'premium',
      memberSince: '2023-02-01',
      totalCredentials: 8750,
      rating: 4.9,
      logo: <Code className="w-8 h-8" />,
      color: 'from-orange-500 to-orange-600',
      website: 'https://algorand.foundation',
      location: 'Singapore'
    },
    {
      id: '5',
      name: 'Global Bank Consortium',
      type: 'financial',
      description: 'International banking alliance providing financial identity and credit verification',
      credentialTypes: ['Credit Scores', 'Bank Account Verification', 'KYC Compliance', 'Financial History'],
      verificationLevel: 'premium',
      memberSince: '2023-04-12',
      totalCredentials: 125000,
      rating: 4.6,
      logo: <Landmark className="w-8 h-8" />,
      color: 'from-indigo-500 to-indigo-600',
      website: 'https://globalbankingconsortium.org',
      location: 'London, UK'
    },
    {
      id: '6',
      name: 'MedCare Health Network',
      type: 'healthcare',
      description: 'Healthcare provider network issuing medical credentials and health records',
      credentialTypes: ['Medical Records', 'Insurance Verification', 'Treatment History', 'Prescription Records'],
      verificationLevel: 'enhanced',
      memberSince: '2023-05-08',
      totalCredentials: 89200,
      rating: 4.5,
      logo: <Heart className="w-8 h-8" />,
      color: 'from-red-500 to-red-600',
      website: 'https://medcare.health',
      location: 'Toronto, Canada'
    }
  ];

  const integratedPlatforms: IntegratedPlatform[] = [
    {
      id: '1',
      name: 'AlgoFi',
      category: 'defi',
      description: 'Leading DeFi platform on Algorand with reputation-based lending and advanced trading features',
      features: ['Reputation-based Lending', 'Lower Collateral Requirements', 'Premium Trading Features', 'Governance Rights'],
      integrationLevel: 'deep',
      users: '125K+',
      logo: <TrendingUp className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      website: 'https://algofi.org',
      launchDate: '2023-07-15'
    },
    {
      id: '2',
      name: 'SocialDAO',
      category: 'social',
      description: 'Decentralized social platform where reputation determines content reach and community influence',
      features: ['Verified Identity Badges', 'Reputation-based Reach', 'Trusted Content Curation', 'Community Governance'],
      integrationLevel: 'advanced',
      users: '89K+',
      logo: <Users className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      website: 'https://socialdao.app',
      launchDate: '2023-09-22'
    },
    {
      id: '3',
      name: 'GameVerse',
      category: 'gaming',
      description: 'Web3 gaming platform with skill-based matchmaking and reputation-gated tournaments',
      features: ['Skill-based Matchmaking', 'Tournament Access', 'Achievement Verification', 'Pro Player Recognition'],
      integrationLevel: 'advanced',
      users: '67K+',
      logo: <GameController2 className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      website: 'https://gameverse.gg',
      launchDate: '2023-11-10'
    },
    {
      id: '4',
      name: 'TrustMarket',
      category: 'ecommerce',
      description: 'Decentralized marketplace with reputation-based seller verification and buyer protection',
      features: ['Verified Seller Badges', 'Reputation-based Discounts', 'Trusted Buyer Program', 'Dispute Resolution'],
      integrationLevel: 'deep',
      users: '156K+',
      logo: <ShoppingCart className="w-8 h-8" />,
      color: 'from-orange-500 to-orange-600',
      website: 'https://trustmarket.io',
      launchDate: '2023-08-05'
    },
    {
      id: '5',
      name: 'WorkDAO',
      category: 'productivity',
      description: 'Freelance platform connecting verified professionals with reputation-based project matching',
      features: ['Skill Verification', 'Reputation Matching', 'Escrow Protection', 'Performance Tracking'],
      integrationLevel: 'advanced',
      users: '43K+',
      logo: <Briefcase className="w-8 h-8" />,
      color: 'from-indigo-500 to-indigo-600',
      website: 'https://workdao.org',
      launchDate: '2023-10-18'
    },
    {
      id: '6',
      name: 'CryptoCard',
      category: 'defi',
      description: 'Crypto credit card with spending limits based on NexDentify reputation scores',
      features: ['Reputation-based Limits', 'Cashback Rewards', 'DeFi Integration', 'Global Acceptance'],
      integrationLevel: 'basic',
      users: '34K+',
      logo: <CreditCard className="w-8 h-8" />,
      color: 'from-cyan-500 to-cyan-600',
      website: 'https://cryptocard.finance',
      launchDate: '2023-12-01'
    }
  ];

  const partnerships: Partnership[] = [
    {
      id: '1',
      name: 'Algorand Foundation',
      type: 'ecosystem',
      description: 'Strategic partnership for blockchain infrastructure and ecosystem development',
      benefits: ['Native Algorand Integration', 'Grant Funding', 'Technical Support', 'Marketing Collaboration'],
      status: 'active',
      logo: <Zap className="w-8 h-8" />,
      color: 'from-orange-500 to-orange-600',
      website: 'https://algorand.foundation',
      announcedDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'W3C Credentials Community',
      type: 'research',
      description: 'Collaboration on verifiable credentials standards and interoperability protocols',
      benefits: ['Standards Development', 'Interoperability', 'Research Collaboration', 'Industry Recognition'],
      status: 'active',
      logo: <Globe className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      website: 'https://w3c.org',
      announcedDate: '2023-03-22'
    },
    {
      id: '3',
      name: 'Microsoft Azure',
      type: 'technology',
      description: 'Cloud infrastructure partnership for enterprise identity solutions',
      benefits: ['Enterprise Integration', 'Cloud Infrastructure', 'Security Features', 'Global Reach'],
      status: 'development',
      logo: <Building2 className="w-8 h-8" />,
      color: 'from-cyan-500 to-cyan-600',
      website: 'https://azure.microsoft.com',
      announcedDate: '2023-11-08'
    },
    {
      id: '4',
      name: 'Chainlink Labs',
      type: 'infrastructure',
      description: 'Oracle integration for real-world data verification and cross-chain functionality',
      benefits: ['Oracle Integration', 'Cross-chain Support', 'Data Verification', 'DeFi Connectivity'],
      status: 'planned',
      logo: <Lock className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      website: 'https://chainlink.com',
      announcedDate: '2024-01-12'
    }
  ];

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case 'premium':
        return <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <Award className="w-3 h-3" />
          <span>Premium</span>
        </div>;
      case 'enhanced':
        return <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <Shield className="w-3 h-3" />
          <span>Enhanced</span>
        </div>;
      case 'basic':
        return <div className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <CheckCircle className="w-3 h-3" />
          <span>Basic</span>
        </div>;
      default:
        return null;
    }
  };

  const getIntegrationBadge = (level: string) => {
    switch (level) {
      case 'deep':
        return <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">Deep Integration</div>;
      case 'advanced':
        return <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">Advanced</div>;
      case 'basic':
        return <div className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs font-medium">Basic</div>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <CheckCircle className="w-3 h-3" />
          <span>Active</span>
        </div>;
      case 'development':
        return <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>In Development</span>
        </div>;
      case 'planned':
        return <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <Eye className="w-3 h-3" />
          <span>Planned</span>
        </div>;
      default:
        return null;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderTrustedIssuers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text">Trusted Issuers</h3>
        <span className="text-sm text-dark-text-secondary">{trustedIssuers.length} verified issuers</span>
      </div>

      {trustedIssuers.map((issuer) => (
        <div key={issuer.id} className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary-red-light/30 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${issuer.color}`}>
                {issuer.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-lg font-semibold text-dark-text">{issuer.name}</h4>
                  {getVerificationBadge(issuer.verificationLevel)}
                </div>
                <p className="text-sm text-dark-text-secondary mb-2">{issuer.description}</p>
                <div className="flex items-center space-x-4 text-xs text-dark-text-secondary">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{issuer.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Since {formatDate(issuer.memberSince)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-dark-text font-medium">{issuer.rating}</span>
              </div>
              <div className="text-xs text-dark-text-secondary">
                {formatNumber(issuer.totalCredentials)} credentials
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="text-sm font-medium text-dark-text mb-2">Credential Types:</h5>
            <div className="flex flex-wrap gap-2">
              {issuer.credentialTypes.map((type, index) => (
                <span key={index} className="bg-dark-bg border border-dark-border px-2 py-1 rounded-lg text-xs text-dark-text">
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button className="text-primary-red hover:text-primary-red-light transition-colors text-sm font-medium">
              Request Credential
            </button>
            {issuer.website && (
              <button className="flex items-center space-x-1 text-dark-text-secondary hover:text-dark-text transition-colors text-sm">
                <ExternalLink className="w-3 h-3" />
                <span>Visit Website</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderIntegratedPlatforms = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text">Integrated Platforms</h3>
        <span className="text-sm text-dark-text-secondary">{integratedPlatforms.length} platforms</span>
      </div>

      {integratedPlatforms.map((platform) => (
        <div key={platform.id} className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary-red-light/30 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${platform.color}`}>
                {platform.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-lg font-semibold text-dark-text">{platform.name}</h4>
                  {getIntegrationBadge(platform.integrationLevel)}
                </div>
                <p className="text-sm text-dark-text-secondary mb-2">{platform.description}</p>
                <div className="flex items-center space-x-4 text-xs text-dark-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{platform.users} users</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Launched {formatDate(platform.launchDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="text-sm font-medium text-dark-text mb-2">Integration Features:</h5>
            <div className="space-y-1">
              {platform.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-dark-text-secondary">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button className="bg-gradient-to-r from-primary-red to-primary-red-dark text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center space-x-2">
              <span>Connect Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {platform.website && (
              <button className="flex items-center space-x-1 text-dark-text-secondary hover:text-dark-text transition-colors text-sm">
                <ExternalLink className="w-3 h-3" />
                <span>Visit Platform</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPartnerships = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text">Strategic Partnerships</h3>
        <span className="text-sm text-dark-text-secondary">{partnerships.length} partnerships</span>
      </div>

      {partnerships.map((partnership) => (
        <div key={partnership.id} className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary-red-light/30 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${partnership.color}`}>
                {partnership.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-lg font-semibold text-dark-text">{partnership.name}</h4>
                  {getStatusBadge(partnership.status)}
                </div>
                <p className="text-sm text-dark-text-secondary mb-2">{partnership.description}</p>
                <div className="flex items-center space-x-4 text-xs text-dark-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Handshake className="w-3 h-3" />
                    <span className="capitalize">{partnership.type} Partnership</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Announced {formatDate(partnership.announcedDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="text-sm font-medium text-dark-text mb-2">Partnership Benefits:</h5>
            <div className="space-y-1">
              {partnership.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-dark-text-secondary">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button className="text-primary-red hover:text-primary-red-light transition-colors text-sm font-medium">
              Learn More
            </button>
            {partnership.website && (
              <button className="flex items-center space-x-1 text-dark-text-secondary hover:text-dark-text transition-colors text-sm">
                <ExternalLink className="w-3 h-3" />
                <span>Visit Website</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const navigationItems = [
    { id: 'issuers', label: 'Trusted Issuers', icon: <Shield className="w-5 h-5" /> },
    { id: 'platforms', label: 'Integrated Platforms', icon: <Globe className="w-5 h-5" /> },
    { id: 'partnerships', label: 'Partnerships', icon: <Handshake className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-4">
        <h1 className="text-xl font-semibold text-dark-text">Discover</h1>
      </div>

      {/* Search Bar */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
          <input
            type="text"
            placeholder="Search issuers, platforms, or partnerships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-dark-text placeholder-dark-text-secondary focus:border-primary-red focus:outline-none"
          />
        </div>
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

      {/* Stats Bar */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-3">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-primary-red">{trustedIssuers.length}</div>
            <div className="text-xs text-dark-text-secondary">Trusted Issuers</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-500">{integratedPlatforms.length}</div>
            <div className="text-xs text-dark-text-secondary">Integrated Platforms</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-500">{partnerships.length}</div>
            <div className="text-xs text-dark-text-secondary">Active Partnerships</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {activeView === 'issuers' && renderTrustedIssuers()}
        {activeView === 'platforms' && renderIntegratedPlatforms()}
        {activeView === 'partnerships' && renderPartnerships()}
      </div>
    </div>
  );
};

export default DiscoverPage;