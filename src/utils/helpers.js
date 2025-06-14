/**
 * Format time in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format time for display with units
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time with units
 */
export const formatTimeWithUnits = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  
  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  
  return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Convert minutes to seconds
 * @param {number} minutes - Time in minutes
 * @returns {number} Time in seconds
 */
export const minutesToSeconds = (minutes) => minutes * 60;

/**
 * Convert seconds to minutes
 * @param {number} seconds - Time in seconds
 * @returns {number} Time in minutes
 */
export const secondsToMinutes = (seconds) => Math.floor(seconds / 60);

/**
 * Validate duration input
 * @param {any} value - Input value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} Whether the value is valid
 */
export const isValidDuration = (value, min = 1, max = 60) => {
  const num = parseInt(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to execute immediately
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if device supports notifications
 * @returns {boolean} Whether notifications are supported
 */
export const supportsNotifications = () => {
  return 'Notification' in window;
};

/**
 * Request notification permission
 * @returns {Promise<string>} Permission status
 */
export const requestNotificationPermission = async () => {
  if (!supportsNotifications()) {
    return 'not-supported';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission === 'denied') {
    return 'denied';
  }
  
  const permission = await Notification.requestPermission();
  return permission;
};

/**
 * Show browser notification
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 * @returns {Notification|null} Notification instance or null
 */
export const showNotification = (title, options = {}) => {
  if (!supportsNotifications() || Notification.permission !== 'granted') {
    return null;
  }
  
  const defaultOptions = {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'pomodoro-timer',
    renotify: true,
    requireInteraction: false,
    ...options
  };
  
  return new Notification(title, defaultOptions);
};

/**
 * Check if device is mobile
 * @returns {boolean} Whether device is mobile
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if device is touch enabled
 * @returns {boolean} Whether device supports touch
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get readable time ago string
 * @param {Date} date - Date to compare
 * @returns {string} Human readable time ago
 */
export const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
};

/**
 * Calculate session progress percentage
 * @param {number} timeLeft - Time remaining in seconds
 * @param {number} totalTime - Total session time in seconds
 * @returns {number} Progress percentage (0-100)
 */
export const getSessionProgress = (timeLeft, totalTime) => {
  if (totalTime === 0) return 0;
  const elapsed = totalTime - timeLeft;
  return Math.min(Math.max((elapsed / totalTime) * 100, 0), 100);
};

/**
 * Format session type for display
 * @param {string} sessionType - Session type constant
 * @returns {string} Formatted session type
 */
export const formatSessionType = (sessionType) => {
  const types = {
    work: 'Focus Time',
    short_break: 'Short Break',
    long_break: 'Long Break'
  };
  return types[sessionType] || 'Unknown';
};

/**
 * Get session type emoji
 * @param {string} sessionType - Session type constant
 * @returns {string} Emoji representation
 */
export const getSessionEmoji = (sessionType) => {
  const emojis = {
    work: '🍅',
    short_break: '☕',
    long_break: '🌿'
  };
  return emojis[sessionType] || '⏰';
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean} Whether user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Safe JSON parse with fallback
 * @param {string} str - JSON string to parse
 * @param {any} fallback - Fallback value if parsing fails
 * @returns {any} Parsed value or fallback
 */
export const safeJsonParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.warn('JSON parse error:', error);
    return fallback;
  }
};

/**
 * Safe JSON stringify
 * @param {any} obj - Object to stringify
 * @param {string} fallback - Fallback string if stringify fails
 * @returns {string} JSON string or fallback
 */
export const safeJsonStringify = (obj, fallback = '{}') => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.warn('JSON stringify error:', error);
    return fallback;
  }
};
