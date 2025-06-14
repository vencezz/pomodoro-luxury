import React, { useEffect, useRef, useState } from 'react';
import Layout from './components/Layout';
import Timer from './components/Timer';
import Controls from './components/Controls';
import Settings from './components/Settings';
import { usePomodoro } from './hooks/usePomodoro';
import styles from './App.module.css';
import './styles/globals.css';

function App() {
  const {
    timeLeft,
    isActive,
    isPaused,
    currentSession,
    sessionType,
    workDuration,
    breakDuration,
    longBreakDuration,
    setWorkDuration,
    setBreakDuration,
    setLongBreakDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession
  } = usePomodoro();

  // State untuk force re-render jika diperlukan
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Ref untuk debouncing dan tracking
  const lastKeyPressRef = useRef(0);
  const pressedKeysRef = useRef(new Set());
  const keyboardEnabledRef = useRef(true);
  const DEBOUNCE_DELAY = 150;

  // Force update UI helper
  const triggerForceUpdate = () => {
    setForceUpdate(prev => prev + 1);
  };

  // Enhanced manual action handlers dengan proper focus management
  const handleManualStart = () => {
    console.log('Manual Start:', { isActive, isPaused });
    
    keyboardEnabledRef.current = false;
    startTimer();
    
    if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
      document.activeElement.blur();
    }
    
    setTimeout(() => {
      keyboardEnabledRef.current = true;
      triggerForceUpdate();
      console.log('Keyboard re-enabled after manual start');
    }, 100);
  };

  const handleManualPause = () => {
    console.log('Manual Pause:', { isActive, isPaused });
    
    keyboardEnabledRef.current = false;
    pauseTimer();
    
    if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
      document.activeElement.blur();
    }
    
    setTimeout(() => {
      keyboardEnabledRef.current = true;
      triggerForceUpdate();
      console.log('Keyboard re-enabled after manual pause');
    }, 100);
  };

  const handleManualReset = () => {
    console.log('Manual Reset:', { isActive, isPaused });
    
    keyboardEnabledRef.current = false;
    resetTimer();
    
    if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
      document.activeElement.blur();
    }
    
    setTimeout(() => {
      keyboardEnabledRef.current = true;
      triggerForceUpdate();
      console.log('Keyboard re-enabled after manual reset');
    }, 100);
  };

  const handleManualSkip = () => {
    console.log('Manual Skip:', { isActive, isPaused });
    
    keyboardEnabledRef.current = false;
    skipSession();
    
    if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
      document.activeElement.blur();
    }
    
    setTimeout(() => {
      keyboardEnabledRef.current = true;
      triggerForceUpdate();
      console.log('Keyboard re-enabled after manual skip');
    }, 100);
  };

  // Enhanced keyboard handler dengan better state management
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!keyboardEnabledRef.current) {
        console.log('Keyboard disabled, ignoring...');
        return;
      }

      const activeElement = document.activeElement;
      const isInputActive = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true'
      );
      
      if (isInputActive) return;

      if (activeElement && activeElement.tagName === 'BUTTON') {
        activeElement.blur();
        setTimeout(() => {
          processKeyboardInput(event);
        }, 10);
        return;
      }
      
      processKeyboardInput(event);
    };

    const processKeyboardInput = (event) => {
      const now = Date.now();
      if (now - lastKeyPressRef.current < DEBOUNCE_DELAY) return;
      
      const key = event.key;
      if (pressedKeysRef.current.has(key)) return;
      
      pressedKeysRef.current.add(key);
      
      const isSpaceKey = event.key === ' ' || 
                         event.key === 'Space' || 
                         event.keyCode === 32 || 
                         event.which === 32;
      
      let actionTaken = false;
      
      if (isSpaceKey) {
        event.preventDefault();
        console.log('Keyboard Space (enhanced):', { isActive, isPaused, enabled: keyboardEnabledRef.current });
        
        const currentIsActive = isActive;
        const currentIsPaused = isPaused;
        
        if (!currentIsActive) {
          console.log('Keyboard: Starting...');
          startTimer();
        } else if (currentIsPaused) {
          console.log('Keyboard: Resuming...');
          startTimer();
        } else {
          console.log('Keyboard: Pausing...');
          pauseTimer();
        }
        
        actionTaken = true;
        triggerForceUpdate();
      } else if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        console.log('Keyboard: Reset');
        resetTimer();
        actionTaken = true;
        triggerForceUpdate();
      } else if (event.key.toLowerCase() === 's' && isActive) {
        event.preventDefault();
        console.log('Keyboard: Skip');
        skipSession();
        actionTaken = true;
        triggerForceUpdate();
      }
      
      if (actionTaken) {
        lastKeyPressRef.current = now;
        
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    };

    const handleKeyUp = (event) => {
      pressedKeysRef.current.delete(event.key);
      if (event.key === ' ' || event.key === 'Space' || event.keyCode === 32) {
        pressedKeysRef.current.delete(' ');
        pressedKeysRef.current.delete('Space');
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [isActive, isPaused, startTimer, pauseTimer, resetTimer, skipSession, forceUpdate]);

  useEffect(() => {
    if (window) {
      window.focus();
    }
  }, []);

  useEffect(() => {
    console.log('State changed:', { isActive, isPaused, forceUpdate });
    
    if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
      document.activeElement.blur();
    }
  }, [isActive, isPaused, forceUpdate]);

  return (
    <div className={styles.app} role="main">
      <Layout>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              Pomodoro
            </h1>
            <p className={styles.subtitle}>
              by rapoi
            </p>
          </header>

          <main className={styles.main}>
            <Timer
              timeLeft={timeLeft}
              isActive={isActive}
              isPaused={isPaused}
              sessionType={sessionType}
              currentSession={currentSession}
              workDuration={workDuration}
              breakDuration={breakDuration}
              longBreakDuration={longBreakDuration}
            />
            
            <Controls
              isActive={isActive}
              isPaused={isPaused}
              onStart={handleManualStart}
              onPause={handleManualPause}
              onReset={handleManualReset}
              onSkip={handleManualSkip}
              forceUpdate={forceUpdate}
            />
          </main>

          <aside className={styles.settings}>
            <Settings
              workDuration={workDuration}
              breakDuration={breakDuration}
              longBreakDuration={longBreakDuration}
              onWorkDurationChange={setWorkDuration}
              onBreakDurationChange={setBreakDuration}
              onLongBreakDurationChange={setLongBreakDuration}
              disabled={isActive}
            />
          </aside>
        </div>
      </Layout>
    </div>
  );
}

export default App;
