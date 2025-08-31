// src/hooks/useTabFocusDetection.js
import { useEffect, useCallback } from 'react';

// This hook ONLY detects and calls a callback. It holds no state itself.
export const useTabFocusDetection = (onSwitch) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onSwitch('tab_switch');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onSwitch]);
};