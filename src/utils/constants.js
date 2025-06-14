// Timer States
export const TIMER_STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed'
};

// Session Types
export const SESSION_TYPES = {
  WORK: 'work',
  SHORT_BREAK: 'short_break',
  LONG_BREAK: 'long_break'
};

// Default Durations (in minutes)
export const DEFAULT_DURATIONS = {
  WORK: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 15
};

// Duration Limits (in minutes)
export const DURATION_LIMITS = {
  MIN: 1,
  MAX: 60,
  WORK: {
    MIN: 5,
    MAX: 60
  },
  SHORT_BREAK: {
    MIN: 1,
    MAX: 30
  },
  LONG_BREAK: {
    MIN: 5,
    MAX: 60
  }
};

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  START_PAUSE: [' ', 'Space'],
  RESET: ['r', 'R'],
  SKIP: ['s', 'S'],
  SETTINGS: ['t', 'T'],
  ESCAPE: ['Escape']
};

// Local Storage Keys
export const STORAGE_KEYS = {
  WORK_DURATION: 'pomodoro_work_duration',
  SHORT_BREAK_DURATION: 'pomodoro_short_break_duration',
  LONG_BREAK_DURATION: 'pomodoro_long_break_duration',
  SOUND_ENABLED: 'pomodoro_sound_enabled',
  NOTIFICATION_ENABLED: 'pomodoro_notification_enabled',
  THEME: 'pomodoro_theme',
  STATS: 'pomodoro_stats'
};

// Session Configuration
export const SESSION_CONFIG = {
  SESSIONS_UNTIL_LONG_BREAK: 4,
  AUTO_START_BREAKS: false,
  AUTO_START_WORK: false
};

// Notification Messages
export const NOTIFICATIONS = {
  WORK_COMPLETE: {
    title: 'Work Session Complete! 🎉',
    body: 'Great job! Time for a well-deserved break.',
    icon: '🍅'
  },
  SHORT_BREAK_COMPLETE: {
    title: 'Break Time Over! 💪',
    body: 'Ready to get back to work?',
    icon: '⚡'
  },
  LONG_BREAK_COMPLETE: {
    title: 'Long Break Complete! 🚀',
    body: 'You\'re refreshed and ready to focus!',
    icon: '🎯'
  },
  HALFWAY_POINT: {
    title: 'Halfway There! ⏰',
    body: 'Keep up the great work!',
    icon: '💯'
  }
};

// Audio Settings
export const AUDIO_CONFIG = {
  NOTIFICATION_FREQUENCY: 800, // Hz
  NOTIFICATION_DURATION: 300, // ms
  TICK_FREQUENCY: 1000, // Hz (for optional tick sound)
  TICK_DURATION: 50, // ms
  VOLUME: 0.3 // 0.0 to 1.0
};

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  PROGRESS_RING: 1000
};

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1200
};

// Color Themes (for future dark mode support)
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Statistics Tracking
export const STATS_CONFIG = {
  TRACK_SESSIONS: true,
  TRACK_FOCUS_TIME: true,
  TRACK_STREAKS: true,
  RESET_DAILY: false
};

// Performance Settings
export const PERFORMANCE_CONFIG = {
  UPDATE_INTERVAL: 1000, // ms
  BACKGROUND_UPDATE_INTERVAL: 5000, // ms when tab is not active
  ENABLE_BACKGROUND_UPDATES: true
};

// Accessibility Settings
export const A11Y_CONFIG = {
  ANNOUNCE_TIME_REMAINING: true,
  ANNOUNCE_SESSION_CHANGES: true,
  HIGH_CONTRAST_SUPPORT: true,
  REDUCED_MOTION_SUPPORT: true,
  FOCUS_MANAGEMENT: true
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_DURATION: 'Please enter a valid duration between {min} and {max} minutes.',
  STORAGE_ERROR: 'Could not save settings. Please check your browser storage.',
  AUDIO_ERROR: 'Could not play notification sound.',
  NOTIFICATION_ERROR: 'Could not show notification. Please check your browser settings.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SETTINGS_SAVED: 'Settings saved successfully!',
  SESSION_COMPLETE: 'Session completed!',
  TIMER_RESET: 'Timer reset successfully!'
};

// Feature Flags (for future features)
export const FEATURES = {
  DARK_MODE: false,
  STATISTICS: false,
  CUSTOM_SOUNDS: false,
  TASK_INTEGRATION: false,
  SYNC_ACROSS_DEVICES: false
};

// App Metadata
export const APP_INFO = {
  NAME: 'Pomodoro Luxury',
  VERSION: '1.0.0',
  DESCRIPTION: 'An elegant Pomodoro timer for focused productivity',
  AUTHOR: 'Luxury Timer Co.',
  GITHUB_URL: 'https://github.com/your-username/pomodoro-luxury',
  SUPPORT_EMAIL: 'support@pomodoroluxury.com'
};

// Export all constants as a single object for easier importing
const constants = {
  TIMER_STATES,
  SESSION_TYPES,
  DEFAULT_DURATIONS,
  DURATION_LIMITS,
  KEYBOARD_SHORTCUTS,
  STORAGE_KEYS,
  SESSION_CONFIG,
  NOTIFICATIONS,
  AUDIO_CONFIG,
  ANIMATION_DURATIONS,
  BREAKPOINTS,
  THEMES,
  STATS_CONFIG,
  PERFORMANCE_CONFIG,
  A11Y_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
  APP_INFO
};

export default constants;
