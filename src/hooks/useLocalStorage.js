import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Initial value if no stored value exists
 * @returns {[any, Function]} - [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};

/**
 * Hook for managing multiple localStorage values with a single prefix
 * @param {string} prefix - Prefix for localStorage keys
 * @param {Object} initialValues - Object with initial values
 * @returns {[Object, Function]} - [values, setValues]
 */
export const useLocalStorageMultiple = (prefix, initialValues) => {
  const [values, setValues] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValues;
    }

    const storedValues = { ...initialValues };
    
    Object.keys(initialValues).forEach(key => {
      try {
        const item = window.localStorage.getItem(`${prefix}_${key}`);
        if (item) {
          storedValues[key] = JSON.parse(item);
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${prefix}_${key}":`, error);
      }
    });

    return storedValues;
  });

  const setMultipleValues = (newValues) => {
    try {
      const updatedValues = { ...values, ...newValues };
      setValues(updatedValues);

      // Save each value to localStorage
      Object.keys(newValues).forEach(key => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            `${prefix}_${key}`, 
            JSON.stringify(newValues[key])
          );
        }
      });
    } catch (error) {
      console.warn(`Error setting multiple localStorage values:`, error);
    }
  };

  const setSingleValue = (key, value) => {
    setMultipleValues({ [key]: value });
  };

  return [values, setMultipleValues, setSingleValue];
};

/**
 * Hook for managing localStorage with expiration
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Initial value if no stored value exists
 * @param {number} ttl - Time to live in milliseconds
 * @returns {[any, Function, Function]} - [storedValue, setValue, clearValue]
 */
export const useLocalStorageWithExpiry = (key, initialValue, ttl = 86400000) => { // 24 hours default
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsedItem = JSON.parse(item);
      const now = new Date().getTime();

      // Check if item has expired
      if (parsedItem.expiry && now > parsedItem.expiry) {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      return parsedItem.value;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      const now = new Date().getTime();
      const itemWithExpiry = {
        value: valueToStore,
        expiry: now + ttl
      };

      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(itemWithExpiry));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  const clearValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error clearing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, clearValue];
};
