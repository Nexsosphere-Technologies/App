import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useAlgorand } from '../hooks/useAlgorand';

interface WalletConnectProps {
  onClose?: () => void;
  isModal?: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onClose, isModal = false }) => {
  const { connectWallet, isConnected, address, loading, error } = useAlgorand();
  const [activeMethod, setActiveMethod] = useState<'new' | 'import' | null>(null);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);

  const handleConnectNew = async () => {
    try {
      await connectWallet();
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to create new wallet:', err);
    }
  };

  const handleImportWallet = async () => {
    if (!seedPhrase.trim()) {
      alert('Please enter your seed phrase');
      return;
    }

    try {
      await connectWallet(seedPhrase.trim());
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to import wallet:', err);
    }
  };

  const handleDisconnect = () => {
    // This would be implemented in the useAlgorand hook
    if (onClose) onClose();
  };

  if (isConnected) {
    return (
      <div className={`${isModal ? 'bg-dark-card border border-dark-border rounded-2xl p-6' : ''}`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
            <Icon icon="mdi:check-circle" className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-dark-text mb-2">Wallet Connected</h3>
            <p className="text-dark-text-secondary text-sm mb-4">
              {address.substring(0, 10)}...{address.substring(-6)}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleDisconnect}
              className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 py-3 rounded-xl font-semibold hover:bg-red-500/20 transition-colors"
            >
              Disconnect
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-2xl flex items-center justify-center mx-auto">
          <Icon icon="mdi:wallet" className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-dark-text mb-2">Connect Wallet</h3>
          <p className="text-dark-text-secondary">
            Connect your Algorand wallet to start using NexDentify
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-500" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {!activeMethod ? (
        /* Method Selection */
        <div className="space-y-4">
          <button
            onClick={() => setActiveMethod('new')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-red to-primary-red-dark text-white p-4 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            <Icon icon="mdi:plus-circle" className="w-6 h-6" />
            <span>Create New Wallet</span>
          </button>

          <button
            onClick={() => setActiveMethod('import')}
            disabled={loading}
            className="w-full bg-dark-bg border border-dark-border text-dark-text p-4 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors flex items-center justify-center space-x-3"
          >
            <Icon icon="mdi:import" className="w-6 h-6" />
            <span>Import Existing Wallet</span>
          </button>

          <div className="text-center">
            <p className="text-xs text-dark-text-secondary">
              By connecting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      ) : activeMethod === 'new' ? (
        /* Create New Wallet */
        <div className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Icon icon="mdi:information" className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-blue-400 font-medium">New Wallet</p>
                <p className="text-blue-400/80 text-sm">
                  A new Algorand wallet will be created for you. Make sure to securely backup your seed phrase.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setActiveMethod(null)}
              className="flex-1 bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConnectNew}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Icon icon="mdi:wallet-plus" className="w-4 h-4" />
                  <span>Create Wallet</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Import Wallet */
        <div className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Icon icon="mdi:shield-alert" className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium">Security Warning</p>
                <p className="text-yellow-400/80 text-sm">
                  Never share your seed phrase with anyone. Only enter it on trusted devices.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">
                Seed Phrase (12 or 24 words)
              </label>
              <div className="relative">
                <textarea
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  placeholder="Enter your seed phrase separated by spaces..."
                  rows={4}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-text-secondary focus:border-primary-red focus:outline-none resize-none"
                  type={showSeedPhrase ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                  className="absolute top-3 right-3 text-dark-text-secondary hover:text-dark-text transition-colors"
                >
                  <Icon 
                    icon={showSeedPhrase ? "mdi:eye-off" : "mdi:eye"} 
                    className="w-5 h-5" 
                  />
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setActiveMethod(null)}
                className="flex-1 bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleImportWallet}
                disabled={loading || !seedPhrase.trim()}
                className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:wallet-plus" className="w-4 h-4" />
                    <span>Import Wallet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md">
          {onClose && (
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="text-dark-text-secondary hover:text-dark-text transition-colors"
              >
                <Icon icon="mdi:close" className="w-6 h-6" />
              </button>
            </div>
          )}
          {content}
        </div>
      </div>
    );
  }

  return <div className="bg-dark-card border border-dark-border rounded-2xl p-6">{content}</div>;
};

export default WalletConnect;