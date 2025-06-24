import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

interface WalletData {
  address: string;
  privateKey: string;
  seedPhrase: string;
}

interface ProfileData {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  linkedin: string;
  github: string;
  profileImage: string;
  isPublic: boolean;
}

interface BiometricSettings {
  fingerprintEnabled: boolean;
  faceIdEnabled: boolean;
  pinCode: string;
  confirmPin: string;
}

const OnboardingFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [accountType, setAccountType] = useState<'new' | 'import' | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [seedPhraseBackedUp, setSeedPhraseBackedUp] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [importSeedPhrase, setImportSeedPhrase] = useState('');
  const [importPrivateKey, setImportPrivateKey] = useState('');
  const [importMethod, setImportMethod] = useState<'seed' | 'key'>('seed');
  const [biometricSettings, setBiometricSettings] = useState<BiometricSettings>({
    fingerprintEnabled: false,
    faceIdEnabled: false,
    pinCode: '',
    confirmPin: ''
  });
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    linkedin: '',
    github: '',
    profileImage: '',
    isPublic: true
  });
  const [tutorialVideoPlaying, setTutorialVideoPlaying] = useState(false);
  const [tutorialMuted, setTutorialMuted] = useState(false);
  const [tutorialProgress, setTutorialProgress] = useState(0);

  // Mock seed phrase generation
  const generateSeedPhrase = () => {
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual'
    ];
    
    const seedPhrase = Array.from({ length: 12 }, () => 
      words[Math.floor(Math.random() * words.length)]
    ).join(' ');
    
    const address = 'NEXD' + Math.random().toString(36).substring(2, 15).toUpperCase();
    const privateKey = '0x' + Math.random().toString(16).substring(2, 66);
    
    return { address, privateKey, seedPhrase };
  };

  const handleCreateNewDID = () => {
    const newWallet = generateSeedPhrase();
    setWalletData(newWallet);
    setAccountType('new');
    setCurrentStep(2); // Go to backup step
  };

  const handleImportDID = () => {
    setAccountType('import');
    setCurrentStep(1); // Go to import step
  };

  const handleImportWallet = () => {
    if (importMethod === 'seed' && importSeedPhrase.trim()) {
      // Validate seed phrase (basic validation)
      const words = importSeedPhrase.trim().split(' ');
      if (words.length !== 12 && words.length !== 24) {
        alert('Invalid seed phrase. Must be 12 or 24 words.');
        return;
      }
      
      // Generate wallet from seed phrase (mock)
      const address = 'NEXD' + Math.random().toString(36).substring(2, 15).toUpperCase();
      const privateKey = '0x' + Math.random().toString(16).substring(2, 66);
      
      setWalletData({
        address,
        privateKey,
        seedPhrase: importSeedPhrase
      });
      
      setCurrentStep(4); // Skip backup, go to biometric setup
    } else if (importMethod === 'key' && importPrivateKey.trim()) {
      // Validate private key
      if (!importPrivateKey.startsWith('0x') || importPrivateKey.length !== 66) {
        alert('Invalid private key format.');
        return;
      }
      
      // Generate wallet from private key (mock)
      const address = 'NEXD' + Math.random().toString(36).substring(2, 15).toUpperCase();
      const seedPhrase = generateSeedPhrase().seedPhrase;
      
      setWalletData({
        address,
        privateKey: importPrivateKey,
        seedPhrase
      });
      
      setCurrentStep(4); // Skip backup, go to biometric setup
    }
  };

  const handleBackupComplete = () => {
    setSeedPhraseBackedUp(true);
    setCurrentStep(3); // Go to backup verification
  };

  const handleBiometricSetup = () => {
    if (biometricSettings.pinCode !== biometricSettings.confirmPin) {
      alert('PIN codes do not match');
      return;
    }
    if (biometricSettings.pinCode.length < 4) {
      alert('PIN must be at least 4 digits');
      return;
    }
    setCurrentStep(5); // Go to profile setup
  };

  const handleProfileSetup = () => {
    setCurrentStep(6); // Go to tutorial
  };

  const handleTutorialComplete = () => {
    // Save onboarding completion to localStorage
    localStorage.setItem('nexdentify-onboarded', 'true');
    localStorage.setItem('nexdentify-wallet', JSON.stringify(walletData));
    localStorage.setItem('nexdentify-profile', JSON.stringify(profileData));
    localStorage.setItem('nexdentify-biometric', JSON.stringify(biometricSettings));
    
    onComplete();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadSeedPhrase = () => {
    if (!walletData) return;
    
    const element = document.createElement('a');
    const file = new Blob([walletData.seedPhrase], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'nexdentify-seed-phrase.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Welcome Screen
  const WelcomeScreen = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-3xl flex items-center justify-center mx-auto">
          <Icon icon="mdi:shield-check" className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-dark-text">Welcome to NexDentify</h1>
        <p className="text-dark-text-secondary text-lg max-w-md mx-auto">
          Your gateway to decentralized identity and reputation management
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-left">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                <Icon icon="mdi:key" className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-dark-text font-semibold mb-2">Own Your Identity</h3>
                <p className="text-dark-text-secondary text-sm">
                  Create and control your decentralized identity with verifiable credentials
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-left">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-500/20 rounded-lg flex-shrink-0">
                <Icon icon="mdi:star" className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-dark-text font-semibold mb-2">Build Reputation</h3>
                <p className="text-dark-text-secondary text-sm">
                  Earn trust through verified credentials and community attestations
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-left">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
                <Icon icon="mdi:coins" className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-dark-text font-semibold mb-2">Earn Rewards</h3>
                <p className="text-dark-text-secondary text-sm">
                  Stake NEXDEN tokens and earn rewards for maintaining your reputation
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCreateNewDID}
            className="w-full bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Create New DID
          </button>
          
          <button
            onClick={handleImportDID}
            className="w-full bg-dark-card border border-dark-border text-dark-text py-4 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
          >
            Import Existing DID
          </button>
        </div>
      </div>
    </div>
  );

  // Import DID Screen
  const ImportDIDScreen = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto">
          <Icon icon="mdi:upload" className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark-text">Import Existing DID</h2>
        <p className="text-dark-text-secondary">
          Restore your identity using your seed phrase or private key
        </p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Icon icon="mdi:alert-triangle" className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-medium">Security Warning</p>
            <p className="text-yellow-400/80 text-sm">
              Never share your seed phrase or private key with anyone. Only enter it on trusted devices.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2 bg-dark-card border border-dark-border rounded-lg p-1">
          <button
            onClick={() => setImportMethod('seed')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              importMethod === 'seed'
                ? 'bg-primary-red text-white'
                : 'text-dark-text-secondary hover:text-dark-text'
            }`}
          >
            Seed Phrase
          </button>
          <button
            onClick={() => setImportMethod('key')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              importMethod === 'key'
                ? 'bg-primary-red text-white'
                : 'text-dark-text-secondary hover:text-dark-text'
            }`}
          >
            Private Key
          </button>
        </div>

        {importMethod === 'seed' ? (
          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">
              Seed Phrase (12 or 24 words)
            </label>
            <textarea
              value={importSeedPhrase}
              onChange={(e) => setImportSeedPhrase(e.target.value)}
              placeholder="Enter your seed phrase separated by spaces..."
              rows={4}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-text-secondary focus:border-primary-red focus:outline-none resize-none"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">
              Private Key
            </label>
            <input
              type="password"
              value={importPrivateKey}
              onChange={(e) => setImportPrivateKey(e.target.value)}
              placeholder="0x..."
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-text-secondary focus:border-primary-red focus:outline-none"
            />
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={() => setCurrentStep(0)}
            className="flex-1 bg-dark-card border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleImportWallet}
            disabled={importMethod === 'seed' ? !importSeedPhrase.trim() : !importPrivateKey.trim()}
            className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import Wallet
          </button>
        </div>
      </div>
    </div>
  );

  // Secure Backup Screen
  const SecureBackupScreen = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
          <Icon icon="mdi:lock" className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark-text">Secure Your Wallet</h2>
        <p className="text-dark-text-secondary">
          Back up your seed phrase to restore your wallet if needed
        </p>
      </div>

      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Icon icon="mdi:alert-triangle" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Critical Security Information</p>
            <ul className="text-red-400/80 text-sm mt-1 space-y-1">
              <li>• Never share your seed phrase with anyone</li>
              <li>• Store it in a secure, offline location</li>
              <li>• Anyone with your seed phrase can access your wallet</li>
              <li>• We cannot recover your wallet without this phrase</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-dark-text font-semibold">Your Seed Phrase</h3>
          <button
            onClick={() => setShowSeedPhrase(!showSeedPhrase)}
            className="text-primary-red hover:text-primary-red-light transition-colors"
          >
            {showSeedPhrase ? 
              <Icon icon="mdi:eye-off" className="w-5 h-5" /> : 
              <Icon icon="mdi:eye" className="w-5 h-5" />
            }
          </button>
        </div>

        {showSeedPhrase ? (
          <div className="space-y-4">
            <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                {walletData?.seedPhrase.split(' ').map((word, index) => (
                  <div key={index} className="bg-dark-card border border-dark-border rounded-lg p-2 text-center">
                    <span className="text-dark-text-secondary text-xs">{index + 1}</span>
                    <div className="text-dark-text font-medium">{word}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => copyToClipboard(walletData?.seedPhrase || '')}
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg py-3 text-dark-text hover:border-primary-red-light/30 transition-colors flex items-center justify-center space-x-2"
              >
                <Icon icon="mdi:content-copy" className="w-4 h-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={downloadSeedPhrase}
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg py-3 text-dark-text hover:border-primary-red-light/30 transition-colors flex items-center justify-center space-x-2"
              >
                <Icon icon="mdi:download" className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-dark-bg border border-dark-border rounded-lg p-8 text-center">
            <Icon icon="mdi:eye" className="w-8 h-8 text-dark-text-secondary mx-auto mb-2" />
            <p className="text-dark-text-secondary">Click the eye icon to reveal your seed phrase</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={seedPhraseBackedUp}
            onChange={(e) => setSeedPhraseBackedUp(e.target.checked)}
            className="w-5 h-5 text-primary-red bg-dark-bg border-dark-border rounded focus:ring-primary-red focus:ring-2"
          />
          <span className="text-dark-text">
            I have securely backed up my seed phrase
          </span>
        </label>

        <button
          onClick={handleBackupComplete}
          disabled={!seedPhraseBackedUp}
          className="w-full bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Verification
        </button>
      </div>
    </div>
  );

  // Backup Verification Screen
  const BackupVerificationScreen = () => {
    const [verificationWords, setVerificationWords] = useState<string[]>(['', '', '']);
    const [verificationIndices] = useState(() => {
      const indices = [];
      const seedWords = walletData?.seedPhrase.split(' ') || [];
      while (indices.length < 3) {
        const randomIndex = Math.floor(Math.random() * seedWords.length);
        if (!indices.includes(randomIndex)) {
          indices.push(randomIndex);
        }
      }
      return indices.sort((a, b) => a - b);
    });

    const handleVerification = () => {
      const seedWords = walletData?.seedPhrase.split(' ') || [];
      const isCorrect = verificationIndices.every((index, i) => 
        verificationWords[i].toLowerCase() === seedWords[index].toLowerCase()
      );

      if (isCorrect) {
        setCurrentStep(4); // Go to biometric setup
      } else {
        alert('Verification failed. Please check your words and try again.');
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Icon icon="mdi:check-circle" className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-dark-text">Verify Your Backup</h2>
          <p className="text-dark-text-secondary">
            Enter the requested words from your seed phrase to confirm you've backed it up correctly
          </p>
        </div>

        <div className="space-y-4">
          {verificationIndices.map((wordIndex, i) => (
            <div key={i}>
              <label className="block text-sm text-dark-text-secondary mb-2">
                Word #{wordIndex + 1}
              </label>
              <input
                type="text"
                value={verificationWords[i]}
                onChange={(e) => {
                  const newWords = [...verificationWords];
                  newWords[i] = e.target.value;
                  setVerificationWords(newWords);
                }}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
                placeholder="Enter the word"
              />
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setCurrentStep(2)}
            className="flex-1 bg-dark-card border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleVerification}
            disabled={verificationWords.some(word => !word.trim())}
            className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify Backup
          </button>
        </div>
      </div>
    );
  };

  // Biometric Setup Screen
  const BiometricSetupScreen = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
          <Icon icon="mdi:fingerprint" className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark-text">Secure Access</h2>
        <p className="text-dark-text-secondary">
          Set up biometric authentication and PIN for quick, secure access
        </p>
      </div>

      <div className="space-y-6">
        {/* Biometric Options */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-dark-text font-semibold mb-4">Biometric Authentication</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon icon="mdi:fingerprint" className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-dark-text font-medium">Fingerprint</p>
                  <p className="text-sm text-dark-text-secondary">Use your fingerprint to unlock</p>
                </div>
              </div>
              <button
                onClick={() => setBiometricSettings(prev => ({ 
                  ...prev, 
                  fingerprintEnabled: !prev.fingerprintEnabled 
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  biometricSettings.fingerprintEnabled ? 'bg-primary-red' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    biometricSettings.fingerprintEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon icon="mdi:cellphone" className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-dark-text font-medium">Face ID</p>
                  <p className="text-sm text-dark-text-secondary">Use facial recognition to unlock</p>
                </div>
              </div>
              <button
                onClick={() => setBiometricSettings(prev => ({ 
                  ...prev, 
                  faceIdEnabled: !prev.faceIdEnabled 
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  biometricSettings.faceIdEnabled ? 'bg-primary-red' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    biometricSettings.faceIdEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* PIN Setup */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-dark-text font-semibold mb-4">PIN Code</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">
                Create PIN (4-6 digits)
              </label>
              <input
                type="password"
                value={biometricSettings.pinCode}
                onChange={(e) => setBiometricSettings(prev => ({ 
                  ...prev, 
                  pinCode: e.target.value.replace(/\D/g, '').slice(0, 6)
                }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
                placeholder="Enter PIN"
                maxLength={6}
              />
            </div>

            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">
                Confirm PIN
              </label>
              <input
                type="password"
                value={biometricSettings.confirmPin}
                onChange={(e) => setBiometricSettings(prev => ({ 
                  ...prev, 
                  confirmPin: e.target.value.replace(/\D/g, '').slice(0, 6)
                }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
                placeholder="Confirm PIN"
                maxLength={6}
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setCurrentStep(accountType === 'new' ? 3 : 1)}
            className="flex-1 bg-dark-card border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleBiometricSetup}
            className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  // Profile Setup Screen
  const ProfileSetupScreen = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <Icon icon="mdi:account" className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark-text">Create Your Profile</h2>
        <p className="text-dark-text-secondary">
          Set up your public profile information (optional but recommended)
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profileData.displayName ? profileData.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
              <Icon icon="mdi:camera" className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-dark-text-secondary mt-2">Upload profile picture</p>
        </div>

        {/* Basic Information */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-dark-text font-semibold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary-red focus:outline-none resize-none"
                placeholder="Tell others about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">
                Location
              </label>
              <div className="relative">
                <Icon icon="mdi:map-marker" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-dark-text font-semibold mb-4">Social Links (Optional)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">
                Website
              </label>
              <div className="relative">
                <Icon icon="mdi:link" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">
                  Twitter
                </label>
                <div className="relative">
                  <Icon icon="mdi:twitter" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
                  <input
                    type="text"
                    value={profileData.twitter}
                    onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
                    placeholder="@username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <Icon icon="mdi:linkedin" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
                  <input
                    type="text"
                    value={profileData.linkedin}
                    onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-dark-text focus:border-primary-red focus:outline-none"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-dark-text font-semibold mb-4">Privacy</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text font-medium">Public Profile</p>
              <p className="text-sm text-dark-text-secondary">Make your profile visible to others</p>
            </div>
            <button
              onClick={() => setProfileData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                profileData.isPublic ? 'bg-primary-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profileData.isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setCurrentStep(4)}
            className="flex-1 bg-dark-card border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleProfileSetup}
            className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Continue to Tutorial
          </button>
        </div>
      </div>
    </div>
  );

  // Interactive Tutorial Screen
  const InteractiveTutorialScreen = () => {
    useEffect(() => {
      // Simulate video progress
      const interval = setInterval(() => {
        if (tutorialVideoPlaying) {
          setTutorialProgress(prev => {
            if (prev >= 100) {
              setTutorialVideoPlaying(false);
              return 100;
            }
            return prev + 1;
          });
        }
      }, 100);

      return () => clearInterval(interval);
    }, [tutorialVideoPlaying]);

    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto">
            <Icon icon="mdi:play" className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-dark-text">Learn NexDentify</h2>
          <p className="text-dark-text-secondary">
            Watch our AI guide explain how to use NexDentify effectively
          </p>
        </div>

        {/* Video Player Mockup */}
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            {/* Video Placeholder */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-full flex items-center justify-center mx-auto">
                <Icon icon="mdi:account" className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">AI Guide - Alex</h3>
                <p className="text-gray-300">Your personal NexDentify assistant</p>
              </div>
            </div>

            {/* Play/Pause Overlay */}
            <button
              onClick={() => setTutorialVideoPlaying(!tutorialVideoPlaying)}
              className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors flex items-center justify-center"
            >
              {tutorialVideoPlaying ? (
                <Icon icon="mdi:pause" className="w-16 h-16 text-white" />
              ) : (
                <Icon icon="mdi:play" className="w-16 h-16 text-white" />
              )}
            </button>
          </div>

          {/* Video Controls */}
          <div className="p-4 space-y-3">
            {/* Progress Bar */}
            <div className="w-full bg-dark-bg rounded-full h-2">
              <div
                className="bg-primary-red h-2 rounded-full transition-all duration-100"
                style={{ width: `${tutorialProgress}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setTutorialVideoPlaying(!tutorialVideoPlaying)}
                  className="text-dark-text hover:text-primary-red transition-colors"
                >
                  {tutorialVideoPlaying ? 
                    <Icon icon="mdi:pause" className="w-5 h-5" /> : 
                    <Icon icon="mdi:play" className="w-5 h-5" />
                  }
                </button>
                
                <button
                  onClick={() => setTutorialMuted(!tutorialMuted)}
                  className="text-dark-text hover:text-primary-red transition-colors"
                >
                  {tutorialMuted ? 
                    <Icon icon="mdi:volume-off" className="w-5 h-5" /> : 
                    <Icon icon="mdi:volume-high" className="w-5 h-5" />
                  }
                </button>

                <span className="text-sm text-dark-text-secondary">
                  {Math.floor(tutorialProgress / 100 * 5)}:00 / 5:00
                </span>
              </div>

              <button className="text-dark-text-secondary hover:text-dark-text transition-colors">
                <Icon icon="mdi:open-in-new" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tutorial Topics */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-dark-text font-semibold mb-4">What You'll Learn</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500" />
              <span className="text-dark-text">Understanding Decentralized Identity (DIDs)</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500" />
              <span className="text-dark-text">Managing Verifiable Credentials (VCs)</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500" />
              <span className="text-dark-text">Building and Maintaining Reputation</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500" />
              <span className="text-dark-text">Staking NEXDEN Tokens</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500" />
              <span className="text-dark-text">Connecting with Trusted Platforms</span>
            </div>
          </div>
        </div>

        {/* Tutorial Actions */}
        <div className="space-y-4">
          <div className="flex space-x-3">
            <button
              onClick={() => setCurrentStep(5)}
              className="flex-1 bg-dark-card border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleTutorialComplete}
              className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              {tutorialProgress === 100 ? 'Complete Setup' : 'Skip Tutorial'}
            </button>
          </div>

          <button
            onClick={handleTutorialComplete}
            className="w-full text-dark-text-secondary hover:text-dark-text transition-colors text-sm"
          >
            I'll watch this later
          </button>
        </div>
      </div>
    );
  };

  const steps = [
    { id: 'welcome', title: 'Welcome', description: 'Introduction to NexDentify', component: <WelcomeScreen /> },
    { id: 'import', title: 'Import', description: 'Import existing DID', component: <ImportDIDScreen /> },
    { id: 'backup', title: 'Backup', description: 'Secure your wallet', component: <SecureBackupScreen /> },
    { id: 'verify', title: 'Verify', description: 'Verify backup', component: <BackupVerificationScreen /> },
    { id: 'biometric', title: 'Security', description: 'Set up biometric access', component: <BiometricSetupScreen /> },
    { id: 'profile', title: 'Profile', description: 'Create your profile', component: <ProfileSetupScreen /> },
    { id: 'tutorial', title: 'Tutorial', description: 'Learn how to use NexDentify', component: <InteractiveTutorialScreen /> }
  ];

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-text-secondary">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-dark-text-secondary">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-dark-card rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-red to-primary-red-dark h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          {steps[currentStep]?.component}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;