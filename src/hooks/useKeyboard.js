import { useEffect, useRef } from 'react';

export const useKeyboard = ({
  onStart,
  onPause,
  onReset,
  onSkip,
  onSettings,
  isActive = false,
  isPaused = false,
  disabled = false
}) => {
  const pressedKeysRef = useRef(new Set());
  const lastActionTimeRef = useRef(0);
  const DEBOUNCE_DELAY = 200;

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event) => {
      // Don't handle shortcuts when typing in input fields
      const activeElement = document.activeElement;
      const isInputActive = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true'
      );
      
      if (isInputActive) return;
      
      const isSpaceKey = event.key === ' ' || 
                         event.key === 'Space' || 
                         event.keyCode === 32 || 
                         event.which === 32;
      
      const key = event.key;
      const now = Date.now();
      
      // Prevent rapid-fire actions
      if (now - lastActionTimeRef.current < DEBOUNCE_DELAY) return;
      
      // Check if key is already pressed
      if (pressedKeysRef.current.has(key)) return;
      
      pressedKeysRef.current.add(key);
      
      let actionTaken = false;
      
      // Space key handling (Start/Pause/Resume)
      if (isSpaceKey) {
        event.preventDefault();
        console.log('Keyboard Space:', { isActive, isPaused }); // DEBUG
        
        if (!isActive) {
          console.log('Keyboard: Starting...'); // DEBUG
          onStart?.();
        } else if (isPaused) {
          console.log('Keyboard: Resuming...'); // DEBUG
          onStart?.();
        } else {
          console.log('Keyboard: Pausing...'); // DEBUG
          onPause?.();
        }
        actionTaken = true;
      }
      
      // Reset (R key)
      else if (key.toLowerCase() === 'r') {
        event.preventDefault();
        console.log('Keyboard: Reset'); // DEBUG
        onReset?.();
        actionTaken = true;
      }
      
      // Skip (S key)
      else if (key.toLowerCase() === 's') {
        event.preventDefault();
        if (isActive) {
          console.log('Keyboard: Skip'); // DEBUG
          onSkip?.();
        }
        actionTaken = true;
      }
      
      // Settings toggle (T key)
      else if (key.toLowerCase() === 't') {
        event.preventDefault();
        onSettings?.();
        actionTaken = true;
      }
      
      // Escape
      else if (key === 'Escape') {
        event.preventDefault();
        onSettings?.(false);
        actionTaken = true;
      }
      
      if (actionTaken) {
        lastActionTimeRef.current = now;
        
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    };

    const handleKeyUp = (event) => {
      pressedKeysRef.current.delete(event.key);
      // Also clean space variations
      if (event.key === ' ' || event.key === 'Space' || event.keyCode === 32) {
        pressedKeysRef.current.delete(' ');
        pressedKeysRef.current.delete('Space');
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [disabled, isActive, isPaused, onStart, onPause, onReset, onSkip, onSettings]); // TAMBAHKAN SEMUA DEPENDENCIES

  // Clear pressed keys when disabled
  useEffect(() => {
    if (disabled) {
      pressedKeysRef.current.clear();
    }
  }, [disabled]);

  // Return keyboard shortcut info for UI
  return {
    shortcuts: [
      {
        key: 'Space',
        description: !isActive ? 'Start' : isPaused ? 'Resume' : 'Pause',
        action: 'start_pause'
      },
      {
        key: 'R',
        description: 'Reset',
        action: 'reset'
      },
      {
        key: 'S',
        description: 'Skip',
        action: 'skip',
        disabled: !isActive
      },
      {
        key: 'T',
        description: 'Settings',
        action: 'settings'
      }
    ]
  };
};

export default useKeyboard;
