import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'auto' | 'midnight' | 'ocean' | 'forest';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('nexdentify-theme') as Theme;
    return savedTheme || 'dark';
  });

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      const root = document.documentElement;
      
      // Remove all theme classes
      root.classList.remove('theme-dark', 'theme-light', 'theme-midnight', 'theme-ocean', 'theme-forest');
      
      let actualTheme = theme;
      
      // Handle auto theme
      if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        actualTheme = prefersDark ? 'dark' : 'light';
      }
      
      // Apply theme class
      root.classList.add(`theme-${actualTheme}`);
      
      // Update isDark state
      setIsDark(actualTheme !== 'light');
      
      // Save to localStorage
      localStorage.setItem('nexdentify-theme', theme);
    };

    updateTheme();

    // Listen for system theme changes when auto is selected
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};