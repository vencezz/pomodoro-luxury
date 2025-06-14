import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { SESSION_TYPES, DEFAULT_DURATIONS } from '../utils/constants';

export const usePomodoro = () => {
  // Persistent settings
  const [workDuration, setWorkDuration] = useLocalStorage('workDuration', DEFAULT_DURATIONS.WORK);
  const [breakDuration, setBreakDuration] = useLocalStorage('breakDuration', DEFAULT_DURATIONS.SHORT_BREAK);
  const [longBreakDuration, setLongBreakDuration] = useLocalStorage('longBreakDuration', DEFAULT_DURATIONS.LONG_BREAK);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [sessionType, setSessionType] = useState(SESSION_TYPES.WORK);
  
  // Refs for stable references
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);
  
  // Initialize audio context for notifications
  useEffect(() => {
    // Create audio context for sound notifications
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported');
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play notification sound');
    }
  }, []);
  
  // Show browser notification
  const showNotification = useCallback((title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  }, []);
  
  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
  
  // Switch to next session
  const switchToNextSession = useCallback(() => {
    playNotificationSound();
    
    if (sessionType === SESSION_TYPES.WORK) {
      const isLongBreak = currentSession % 4 === 0;
      const nextSessionType = isLongBreak ? SESSION_TYPES.LONG_BREAK : SESSION_TYPES.SHORT_BREAK;
      const nextDuration = isLongBreak ? longBreakDuration : breakDuration;
      
      setSessionType(nextSessionType);
      setTimeLeft(nextDuration * 60);
      
      showNotification(
        'Work session completed! 🎉',
        `Time for a ${isLongBreak ? 'long' : 'short'} break`
      );
    } else {
      setSessionType(SESSION_TYPES.WORK);
      setTimeLeft(workDuration * 60);
      setCurrentSession(prev => prev + 1);
      
      showNotification(
        'Break time over! 💪',
        'Ready to focus again?'
      );
    }
    
    setIsActive(false);
    setIsPaused(false);
  }, [sessionType, currentSession, workDuration, breakDuration, longBreakDuration, playNotificationSound, showNotification]);
  
  // Timer countdown effect
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            switchToNextSession();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, switchToNextSession]);
  
  // Update time when durations change (only if not active)
  useEffect(() => {
    if (!isActive) {
      if (sessionType === SESSION_TYPES.WORK) {
        setTimeLeft(workDuration * 60);
      } else if (sessionType === SESSION_TYPES.SHORT_BREAK) {
        setTimeLeft(breakDuration * 60);
      } else if (sessionType === SESSION_TYPES.LONG_BREAK) {
        setTimeLeft(longBreakDuration * 60);
      }
    }
  }, [workDuration, breakDuration, longBreakDuration, sessionType, isActive]);
  
  // Timer controls
  const startTimer = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
  }, []);
  
  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);
  
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentSession(1);
    setSessionType(SESSION_TYPES.WORK);
    setTimeLeft(workDuration * 60);
  }, [workDuration]);
  
  const skipSession = useCallback(() => {
    switchToNextSession();
  }, [switchToNextSession]);
  
  // Update document title with timer
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.title = isActive 
      ? `${timeString} - ${sessionType === SESSION_TYPES.WORK ? 'Focus' : 'Break'} | Pomodoro`
      : 'Pomodoro Timer';
  }, [timeLeft, isActive, sessionType]);
  
  return {
    // State
    timeLeft,
    isActive,
    isPaused,
    currentSession,
    sessionType,
    
    // Settings
    workDuration,
    breakDuration,
    longBreakDuration,
    setWorkDuration,
    setBreakDuration,
    setLongBreakDuration,
    
    // Controls
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession
  };
};
