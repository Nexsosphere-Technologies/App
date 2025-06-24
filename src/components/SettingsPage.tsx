import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Lock, 
  Globe, 
  HelpCircle, 
  Info, 
  ChevronRight,
  Eye,
  EyeOff,
  Fingerprint,
  Key,
  Smartphone,
  Clock,
  Languages,
  MessageCircle,
  Book,
  Mail,
  Phone,
  ExternalLink,
  Save,
  Edit3,
  Camera,
  AlertTriangle,
  CheckCircle,
  Copy,
  RefreshCw,
  LogOut,
  Trash2,
  Download,
  Upload,
  Settings as SettingsIcon,
  ArrowLeft,
  Toggle
} from 'lucide-react';

interface ProfileData {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  linkedin: string;
  profileImage: string;
}

interface PrivacySettings {
  shareCredentials: 'public' | 'connections' | 'private';
  shareReputationScore: boolean;
  shareStakingHistory: boolean;
  shareAttestations: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  indexProfile: boolean;
}

interface SecuritySettings {
  biometricsEnabled: boolean;
  pinEnabled: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  autoLockEnabled: boolean;
  seedPhraseBackedUp: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'main' | 'profile' | 'privacy' | 'security' | 'language' | 'support' | 'about'>('main');
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: 'John Doe',
    bio: 'Software Engineer passionate about decentralized identity and blockchain technology.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    twitter: '@johndoe',
    linkedin: 'linkedin.com/in/johndoe',
    profileImage: ''
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    shareCredentials: 'connections',
    shareReputationScore: true,
    shareStakingHistory: false,
    shareAttestations: true,
    allowDirectMessages: true,
    showOnlineStatus: true,
    indexProfile: true
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    biometricsEnabled: true,
    pinEnabled: true,
    twoFactorEnabled: false,
    sessionTimeout: 30,
    autoLockEnabled: true,
    seedPhraseBackedUp: true
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ];

  const seedPhrase = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

  const handleProfileSave = () => {
    // Save profile data
    console.log('Saving profile data:', profileData);
  };

  const handlePrivacyUpdate = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityUpdate = (key: keyof SecuritySettings, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  const renderMainSettings = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <button
          onClick={() => setActiveView('profile')}
          className="w-full bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className="text-dark-text font-medium">Profile Management</h3>
              <p className="text-sm text-dark-text-secondary">Edit public profile information</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-dark-text-secondary" />
        </button>

        <button
          onClick={() => setActiveView('privacy')}
          className="w-full bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-left">
              <h3 className="text-dark-text font-medium">Privacy Controls</h3>
              <p className="text-sm text-dark-text-secondary">Control data sharing and disclosure</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-dark-text-secondary" />
        </button>

        <button
          onClick={() => setActiveView('security')}
          className="w-full bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-left">
              <h3 className="text-dark-text font-medium">Security Settings</h3>
              <p className="text-sm text-dark-text-secondary">Biometrics, PIN, seed phrase management</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-dark-text-secondary" />
        </button>

        <button
          onClick={() => setActiveView('language')}
          className="w-full bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Languages className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-left">
              <h3 className="text-dark-text font-medium">Language Selection</h3>
              <p className="text-sm text-dark-text-secondary">Multilingual support</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-dark-text-secondary" />
        </button>

        <button
          onClick={() => setActiveView('support')}
          className="w-full bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <HelpCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-left">
              <h3 className="text-dark-text font-medium">Support & Feedback</h3>
              <p className="text-sm text-dark-text-secondary">FAQs, knowledge base, contact support</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-dark-text-secondary" />
        </button>

        <button
          onClick={() => setActiveView('about')}
          className="w-full bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Info className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-left">
              <h3 className="text-dark-text font-medium">About NexDentify</h3>
              <p className="text-sm text-dark-text-secondary">Version info, legal disclaimers</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-dark-text-secondary" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-4">
        <h3 className="text-dark-text font-medium mb-3">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full bg-dark-bg border border-dark-border rounded-lg py-3 text-dark-text hover:border-primary-red-light/30 transition-colors flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button className="w-full bg-dark-bg border border-dark-border rounded-lg py-3 text-dark-text hover:border-primary-red-light/30 transition-colors flex items-center justify-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import Data</span>
          </button>
          <button className="w-full bg-red-500/10 border border-red-500/30 rounded-lg py-3 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfileManagement = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profileData.displayName.split(' ').map(n => n[0]).join('')}
          </div>
          <button className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h3 className="text-dark-text font-medium">Profile Picture</h3>
        <p className="text-sm text-dark-text-secondary">Upload a new profile picture</p>
      </div>

      {/* Profile Information */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">Display Name</label>
            <input
              type="text"
              value={profileData.displayName}
              onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">Location</label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">Website</label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">Twitter</label>
              <input
                type="text"
                value={profileData.twitter}
                onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">LinkedIn</label>
              <input
                type="text"
                value={profileData.linkedin}
                onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleProfileSave}
          className="w-full mt-6 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );

  const renderPrivacyControls = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text mb-2">Privacy Controls</h3>
        <p className="text-sm text-dark-text-secondary mb-4">
          Control how your data is shared and who can see your information
        </p>
      </div>

      {/* Data Sharing */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h4 className="text-dark-text font-medium mb-4">Data Sharing</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">Share Credentials</label>
            <select
              value={privacySettings.shareCredentials}
              onChange={(e) => handlePrivacyUpdate('shareCredentials', e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
            >
              <option value="public">Public - Anyone can see</option>
              <option value="connections">Connections Only</option>
              <option value="private">Private - Only me</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text font-medium">Share Reputation Score</p>
              <p className="text-sm text-dark-text-secondary">Allow others to see your reputation score</p>
            </div>
            <button
              onClick={() => handlePrivacyUpdate('shareReputationScore', !privacySettings.shareReputationScore)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacySettings.shareReputationScore ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings.shareReputationScore ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text font-medium">Share Staking History</p>
              <p className="text-sm text-dark-text-secondary">Show your staking activity and rewards</p>
            </div>
            <button
              onClick={() => handlePrivacyUpdate('shareStakingHistory', !privacySettings.shareStakingHistory)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacySettings.shareStakingHistory ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings.shareStakingHistory ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text font-medium">Share Attestations</p>
              <p className="text-sm text-dark-text-secondary">Display attestations from others</p>
            </div>
            <button
              onClick={() => handlePrivacyUpdate('shareAttestations', !privacySettings.shareAttestations)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacySettings.shareAttestations ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings.shareAttestations ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Communication */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h4 className="text-dark-text font-medium mb-4">Communication</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text font-medium">Allow Direct Messages</p>
              <p className="text-sm text-dark-text-secondary">Let others send you direct messages</p>
            </div>
            <button
              onClick={() => handlePrivacyUpdate('allowDirectMessages', !privacySettings.allowDirectMessages)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacySettings.allowDirectMessages ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings.allowDirectMessages ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text font-medium">Show Online Status</p>
              <p className="text-sm text-dark-text-secondary">Display when you're online</p>
            </div>
            <button
              onClick={() => handlePrivacyUpdate('showOnlineStatus', !privacySettings.showOnlineStatus)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacySettings.showOnlineStatus ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Discovery */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h4 className="text-dark-text font-medium mb-4">Search & Discovery</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text font-medium">Index Profile</p>
              <p className="text-sm text-dark-text-secondary">Allow your profile to appear in search results</p>
            </div>
            <button
              onClick={() => handlePrivacyUpdate('indexProfile', !privacySettings.indexProfile)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacySettings.indexProfile ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings.indexProfile ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text mb-2">Security Settings</h3>
        <p className="text-sm text-dark-text-secondary mb-4">
          Manage your account security and authentication methods
        </p>
      </div>

      {/* Authentication */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h4 className="text-dark-text font-medium mb-4">Authentication</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Fingerprint className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-dark-text font-medium">Biometric Authentication</p>
                <p className="text-sm text-dark-text-secondary">Use fingerprint or face recognition</p>
              </div>
            </div>
            <button
              onClick={() => handleSecurityUpdate('biometricsEnabled', !securitySettings.biometricsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.biometricsEnabled ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.biometricsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-dark-text font-medium">PIN Protection</p>
                <p className="text-sm text-dark-text-secondary">Require PIN for sensitive actions</p>
              </div>
            </div>
            <button
              onClick={() => handleSecurityUpdate('pinEnabled', !securitySettings.pinEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.pinEnabled ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.pinEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-dark-text font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-dark-text-secondary">Add an extra layer of security</p>
              </div>
            </div>
            <button
              onClick={() => handleSecurityUpdate('twoFactorEnabled', !securitySettings.twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.twoFactorEnabled ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h4 className="text-dark-text font-medium mb-4">Session Management</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">Session Timeout (minutes)</label>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) => handleSecurityUpdate('sessionTimeout', parseInt(e.target.value))}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={0}>Never</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text font-medium">Auto-Lock</p>
              <p className="text-sm text-dark-text-secondary">Automatically lock app when inactive</p>
            </div>
            <button
              onClick={() => handleSecurityUpdate('autoLockEnabled', !securitySettings.autoLockEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.autoLockEnabled ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.autoLockEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <button className="w-full bg-red-500/10 border border-red-500/30 rounded-lg py-3 text-red-400 hover:bg-red-500/20 transition-colors">
            End All Sessions
          </button>
        </div>
      </div>

      {/* Seed Phrase Management */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h4 className="text-dark-text font-medium mb-4">Seed Phrase Management</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text font-medium">Backup Status</p>
              <p className="text-sm text-dark-text-secondary">
                {securitySettings.seedPhraseBackedUp ? 'Seed phrase backed up' : 'Seed phrase not backed up'}
              </p>
            </div>
            {securitySettings.seedPhraseBackedUp ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
          </div>

          <button
            onClick={() => setShowSeedPhrase(!showSeedPhrase)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg py-3 text-dark-text hover:border-primary-red-light/30 transition-colors flex items-center justify-center space-x-2"
          >
            {showSeedPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showSeedPhrase ? 'Hide' : 'Show'} Seed Phrase</span>
          </button>

          {showSeedPhrase && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium">Keep this safe!</p>
                  <p className="text-sm text-yellow-400/80">Never share your seed phrase with anyone</p>
                </div>
              </div>
              <div className="bg-dark-bg border border-dark-border rounded-lg p-4 font-mono text-sm text-dark-text">
                {seedPhrase}
              </div>
              <button className="w-full mt-3 bg-dark-bg border border-dark-border rounded-lg py-2 text-dark-text hover:border-primary-red-light/30 transition-colors flex items-center justify-center space-x-2">
                <Copy className="w-4 h-4" />
                <span>Copy to Clipboard</span>
              </button>
            </div>
          )}

          <button className="w-full bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
            Generate New Seed Phrase
          </button>
        </div>
      </div>
    </div>
  );

  const renderLanguageSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text mb-2">Language Selection</h3>
        <p className="text-sm text-dark-text-secondary mb-4">
          Choose your preferred language for the interface
        </p>
      </div>

      <div className="space-y-3">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => setSelectedLanguage(language.code)}
            className={`w-full bg-dark-card border rounded-xl p-4 flex items-center justify-between transition-colors ${
              selectedLanguage === language.code
                ? 'border-primary-red bg-primary-red/10'
                : 'border-dark-border hover:border-primary-red-light/30'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{language.flag}</span>
              <span className="text-dark-text font-medium">{language.name}</span>
            </div>
            {selectedLanguage === language.code && (
              <CheckCircle className="w-5 h-5 text-primary-red" />
            )}
          </button>
        ))}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Globe className="w-5 h-5 text-blue-500" />
          <h4 className="text-dark-text font-medium">Help Us Translate</h4>
        </div>
        <p className="text-sm text-dark-text-secondary mb-3">
          Don't see your language? Help us add support for more languages.
        </p>
        <button className="text-primary-red hover:text-primary-red-light transition-colors text-sm flex items-center space-x-1">
          <ExternalLink className="w-4 h-4" />
          <span>Contribute Translations</span>
        </button>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text mb-2">Support & Feedback</h3>
        <p className="text-sm text-dark-text-secondary mb-4">
          Get help, report issues, or provide feedback
        </p>
      </div>

      {/* Help Resources */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h4 className="text-dark-text font-medium mb-4">Help Resources</h4>
        <div className="space-y-3">
          <button className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors">
            <div className="flex items-center space-x-3">
              <Book className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <p className="text-dark-text font-medium">Knowledge Base</p>
                <p className="text-sm text-dark-text-secondary">Browse articles and guides</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-dark-text-secondary" />
          </button>

          <button className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-green-500" />
              <div className="text-left">
                <p className="text-dark-text font-medium">Frequently Asked Questions</p>
                <p className="text-sm text-dark-text-secondary">Find answers to common questions</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-dark-text-secondary" />
          </button>

          <button className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-purple-500" />
              <div className="text-left">
                <p className="text-dark-text font-medium">Community Forum</p>
                <p className="text-sm text-dark-text-secondary">Connect with other users</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-dark-text-secondary" />
          </button>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h4 className="text-dark-text font-medium mb-4">Contact Support</h4>
        <div className="space-y-3">
          <button className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-orange-500" />
              <div className="text-left">
                <p className="text-dark-text font-medium">Email Support</p>
                <p className="text-sm text-dark-text-secondary">support@nexdentify.com</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-dark-text-secondary" />
          </button>

          <button className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <p className="text-dark-text font-medium">Live Chat</p>
                <p className="text-sm text-dark-text-secondary">Available 24/7</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-500">Online</span>
            </div>
          </button>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h4 className="text-dark-text font-medium mb-4">Provide Feedback</h4>
        <div className="space-y-4">
          <textarea
            placeholder="Tell us what you think about NexDentify..."
            rows={4}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-text-secondary focus:border-primary-red focus:outline-none resize-none"
          />
          <button className="w-full bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text mb-2">About NexDentify</h3>
        <p className="text-sm text-dark-text-secondary mb-4">
          Version information and legal disclaimers
        </p>
      </div>

      {/* App Information */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h4 className="text-xl font-semibold text-dark-text mb-2">NexDentify</h4>
        <p className="text-dark-text-secondary mb-4">Decentralized Identity Platform</p>
        <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-dark-text-secondary">Version</p>
              <p className="text-dark-text font-medium">2.1.0</p>
            </div>
            <div>
              <p className="text-dark-text-secondary">Build</p>
              <p className="text-dark-text font-medium">2024.01.20</p>
            </div>
            <div>
              <p className="text-dark-text-secondary">Network</p>
              <p className="text-dark-text font-medium">Algorand Mainnet</p>
            </div>
            <div>
              <p className="text-dark-text-secondary">License</p>
              <p className="text-dark-text font-medium">MIT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Links */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h4 className="text-dark-text font-medium mb-4">Legal</h4>
        <div className="space-y-3">
          <button className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors">
            <span className="text-dark-text">Terms of Service</span>
            <ExternalLink className="w-4 h-4 text-dark-text-secondary" />
          </button>
          <button className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors">
            <span className="text-dark-text">Privacy Policy</span>
            <ExternalLink className="w-4 h-4 text-dark-text-secondary" />
          </button>
          <button className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors">
            <span className="text-dark-text">Cookie Policy</span>
            <ExternalLink className="w-4 h-4 text-dark-text-secondary" />
          </button>
          <button className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors">
            <span className="text-dark-text">Open Source Licenses</span>
            <ExternalLink className="w-4 h-4 text-dark-text-secondary" />
          </button>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h4 className="text-dark-text font-medium mb-4">Company</h4>
        <div className="space-y-2 text-sm">
          <p className="text-dark-text-secondary">© 2024 NexDentify Labs, Inc.</p>
          <p className="text-dark-text-secondary">All rights reserved.</p>
          <p className="text-dark-text-secondary">Built with ❤️ for the decentralized future</p>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h4 className="text-dark-text font-medium mb-4">System Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Platform:</span>
            <span className="text-dark-text">Web</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">User Agent:</span>
            <span className="text-dark-text font-mono text-xs">Chrome/120.0.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Last Updated:</span>
            <span className="text-dark-text">Jan 20, 2024</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (activeView !== 'main') {
    return (
      <div className="min-h-screen bg-dark-bg pb-20">
        {/* Header */}
        <div className="bg-dark-card border-b border-dark-border px-4 py-4 flex items-center space-x-3">
          <button
            onClick={() => setActiveView('main')}
            className="text-dark-text-secondary hover:text-dark-text transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-dark-text">
            {activeView === 'profile' ? 'Profile Management' :
             activeView === 'privacy' ? 'Privacy Controls' :
             activeView === 'security' ? 'Security Settings' :
             activeView === 'language' ? 'Language Selection' :
             activeView === 'support' ? 'Support & Feedback' :
             'About NexDentify'}
          </h1>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {activeView === 'profile' && renderProfileManagement()}
          {activeView === 'privacy' && renderPrivacyControls()}
          {activeView === 'security' && renderSecuritySettings()}
          {activeView === 'language' && renderLanguageSelection()}
          {activeView === 'support' && renderSupport()}
          {activeView === 'about' && renderAbout()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border px-4 py-4">
        <h1 className="text-xl font-semibold text-dark-text">Settings</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {renderMainSettings()}
      </div>
    </div>
  );
};

export default SettingsPage;