import React, { useState } from 'react';
import { useTheme, Theme } from '../contexts/ThemeContext';
import { Icon } from '@iconify/react';

interface ThemeOption {
  id: Theme;
  name: string;
  description: string;
  icon: string;
  preview: {
    bg: string;
    card: string;
    accent: string;
    text: string;
  };
}

interface ThemeSelectorProps {
  isModal?: boolean;
  onClose?: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isModal = false, onClose }) => {
  const { theme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const themes: ThemeOption[] = [
    {
      id: 'dark',
      name: 'Dark',
      description: 'Classic dark theme for comfortable viewing',
      icon: 'mdi:moon-waning-crescent',
      preview: {
        bg: '#0f0f0f',
        card: '#1a1a1a',
        accent: '#ef4444',
        text: '#fafafa'
      }
    },
    {
      id: 'light',
      name: 'Light',
      description: 'Clean light theme for bright environments',
      icon: 'mdi:white-balance-sunny',
      preview: {
        bg: '#ffffff',
        card: '#f8fafc',
        accent: '#ef4444',
        text: '#0f172a'
      }
    },
    {
      id: 'auto',
      name: 'Auto',
      description: 'Automatically switch based on system preference',
      icon: 'mdi:monitor',
      preview: {
        bg: 'linear-gradient(45deg, #0f0f0f 50%, #ffffff 50%)',
        card: 'linear-gradient(45deg, #1a1a1a 50%, #f8fafc 50%)',
        accent: '#ef4444',
        text: '#64748b'
      }
    },
    {
      id: 'midnight',
      name: 'Midnight',
      description: 'Deep blue theme inspired by the night sky',
      icon: 'mdi:star-four-points',
      preview: {
        bg: '#0c1426',
        card: '#1e293b',
        accent: '#3b82f6',
        text: '#e2e8f0'
      }
    },
    {
      id: 'ocean',
      name: 'Ocean',
      description: 'Calming blue-green theme like deep waters',
      icon: 'mdi:waves',
      preview: {
        bg: '#0f1419',
        card: '#1a2332',
        accent: '#06b6d4',
        text: '#e0f2fe'
      }
    },
    {
      id: 'forest',
      name: 'Forest',
      description: 'Natural green theme for a refreshing feel',
      icon: 'mdi:tree',
      preview: {
        bg: '#0f1b0f',
        card: '#1a2e1a',
        accent: '#22c55e',
        text: '#dcfce7'
      }
    }
  ];

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setShowDropdown(false);
    if (onClose) {
      setTimeout(onClose, 300); // Small delay to show the change
    }
  };

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-red/20 rounded-lg">
                <Icon icon="mdi:palette" className="w-6 h-6 text-primary-red" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-text">Choose Theme</h3>
                <p className="text-sm text-dark-text-secondary">Customize your experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-dark-text-secondary hover:text-dark-text transition-colors"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => handleThemeChange(themeOption.id)}
                className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                  theme === themeOption.id
                    ? 'border-primary-red bg-primary-red/10'
                    : 'border-dark-border hover:border-primary-red-light/30'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Theme Preview */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-dark-border flex-shrink-0">
                    <div 
                      className="w-full h-full"
                      style={{ background: themeOption.preview.bg }}
                    >
                      <div 
                        className="w-full h-6"
                        style={{ background: themeOption.preview.card }}
                      />
                      <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
                        style={{ background: themeOption.preview.accent }}
                      />
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon icon={themeOption.icon} className="w-5 h-5" />
                      <h4 className="text-dark-text font-medium">{themeOption.name}</h4>
                    </div>
                    <p className="text-sm text-dark-text-secondary">{themeOption.description}</p>
                  </div>

                  {/* Selected Indicator */}
                  {theme === themeOption.id && (
                    <Icon icon="mdi:check" className="w-5 h-5 text-primary-red flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-dark-border">
            <p className="text-xs text-dark-text-secondary text-center">
              Theme changes are saved automatically and will persist across sessions
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Compact dropdown version for settings
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between hover:border-primary-red-light/30 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-red/20 rounded-lg">
            <Icon icon="mdi:palette" className="w-5 h-5 text-primary-red" />
          </div>
          <div className="text-left">
            <h3 className="text-dark-text font-medium">Theme</h3>
            <p className="text-sm text-dark-text-secondary">
              Current: {currentTheme.name}
            </p>
          </div>
        </div>
        <Icon 
          icon="mdi:chevron-down" 
          className={`w-5 h-5 text-dark-text-secondary transition-transform ${
            showDropdown ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark-border rounded-xl shadow-lg z-10 overflow-hidden">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => handleThemeChange(themeOption.id)}
              className={`w-full p-3 flex items-center space-x-3 hover:bg-dark-bg transition-colors ${
                theme === themeOption.id ? 'bg-primary-red/10' : ''
              }`}
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-dark-border flex-shrink-0">
                <div 
                  className="w-full h-full"
                  style={{ background: themeOption.preview.bg }}
                >
                  <div 
                    className="w-full h-4"
                    style={{ background: themeOption.preview.card }}
                  />
                  <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: themeOption.preview.accent }}
                  />
                </div>
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center space-x-2">
                  <Icon icon={themeOption.icon} className="w-4 h-4" />
                  <span className="text-dark-text font-medium">{themeOption.name}</span>
                </div>
              </div>

              {theme === themeOption.id && (
                <Icon icon="mdi:check" className="w-4 h-4 text-primary-red flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;