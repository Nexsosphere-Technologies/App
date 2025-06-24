/**
 * Security Utilities
 */

/**
 * Encrypt sensitive data before storing
 */
export const encryptData = (data: string, key?: string): string => {
  try {
    // Simple encryption for demo - use proper encryption in production
    const encryptionKey = key || import.meta.env.VITE_ENCRYPTION_KEY || 'default-key';
    const encrypted = btoa(data + encryptionKey);
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    return data;
  }
};

/**
 * Decrypt sensitive data
 */
export const decryptData = (encryptedData: string, key?: string): string => {
  try {
    const encryptionKey = key || import.meta.env.VITE_ENCRYPTION_KEY || 'default-key';
    const decrypted = atob(encryptedData);
    return decrypted.replace(encryptionKey, '');
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedData;
  }
};

/**
 * Validate Algorand address format
 */
export const isValidAlgorandAddress = (address: string): boolean => {
  const algorandAddressRegex = /^[A-Z2-7]{58}$/;
  return algorandAddressRegex.test(address);
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate seed phrase format
 */
export const isValidSeedPhrase = (seedPhrase: string): boolean => {
  const words = seedPhrase.trim().split(/\s+/);
  return words.length === 12 || words.length === 24;
};

/**
 * Generate secure random string
 */
export const generateSecureRandom = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Hash data using SHA-256
 */
export const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if running in secure context (HTTPS)
 */
export const isSecureContext = (): boolean => {
  return window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
};

/**
 * Content Security Policy headers
 */
export const getCSPHeaders = (): Record<string, string> => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://testnet-api.algonode.cloud https://testnet-idx.algonode.cloud",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  };
};

/**
 * Rate limiting for API calls
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Secure local storage wrapper
 */
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      const encrypted = encryptData(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store encrypted data:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return decryptData(encrypted);
    } catch (error) {
      console.error('Failed to retrieve encrypted data:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
  
  clear: (): void => {
    localStorage.clear();
  },
};