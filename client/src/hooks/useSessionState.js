import { useState, useCallback } from 'react';

const PREFIX = 'chessiq_';

/**
 * useState-compatible hook that persists value to sessionStorage.
 * Survives page refresh but clears on tab close.
 *
 * @param {string} key - Storage key (automatically prefixed with 'chessiq_')
 * @param {*} initialValue - Fallback value when nothing stored
 * @returns {[*, Function]}
 *
 * @example
 * const [filters, setFilters] = useSessionState('matchFilters', {});
 */
export function useSessionState(key, initialValue) {
  const storageKey = PREFIX + key;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = sessionStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // sessionStorage full or unavailable — silently ignore
        }
        return next;
      });
    },
    [storageKey],
  );

  return [storedValue, setValue];
}
