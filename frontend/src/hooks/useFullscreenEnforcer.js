// src/hooks/useFullscreenEnforcer.js
import { useEffect } from 'react';

export const useFullscreenEnforcer = (onExit) => {
  // Function to request fullscreen, to be called by the component
  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err) => {
        // This is important for user experience. Let them know why it failed.
        alert(
          `Could not enter fullscreen mode: ${err.message}. Please allow fullscreen to start the test.`
        );
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      // If we are no longer in fullscreen, trigger the callback
      if (!document.fullscreenElement) {
        onExit('exit_fullscreen');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onExit]);

  return { enterFullscreen };
};